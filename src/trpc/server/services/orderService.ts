import {
  orderModel as Order,
  productModel as Product,
  customerModel as Customer
} from '../models';
import {
  IOrder,
  EStatus,
  IProduct,
  IPagedQuery,
  IPagedResult
} from '@/interfaces';

/**
 * Retrieves all orders from the database with populated client and cart information.
 *
 * @returns {Promise<IOrder[]>} A promise that resolves to an array of orders.
 * @throws {Error} If there's an error retrieving the orders.
 */
export async function getAllOrders(): Promise<IOrder[]> {
  try {
    return await Order.find()
      .populate('cliente', 'nomeCompleto')
      .populate('cesta');
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    throw error;
  }
}

/**
 * Retrieves orders with pagination, sorting, and search capabilities.
 *
 * @param {IPaginationQuery} query - The pagination query.
 * @param {number} [query.page=1] - The page number to retrieve.
 * @param {number} [query.size=10] - The number of items per page.
 * @param {string} [query.sort] - The field to sort by, prefix with '-' for descending order.
 * @param {string} [query.search] - The search query to filter orders.
 * @returns {Promise<IPagedResult<IOrder>>} A promise that resolves to the paginated result containing orders.
 * @throws {Error} If there's an error retrieving the paginated orders.
 */
export async function getAllOrdersPaged({
  page = 1,
  size = 10,
  sort,
  search
}: IPagedQuery): Promise<IPagedResult<IOrder>> {
  try {
    const filter = search
      ? {
          $or: [
            { 'cliente.nomeCompleto': { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { observacao: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sortOption: Record<string, 1 | -1> = sort
      ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 }
      : { dataHora: -1 };

    const totalCount = await Order.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / size) || 1;

    const items = await Order.find(filter)
      .populate('cliente', 'nomeCompleto')
      .populate('cesta')
      .sort(sortOption)
      .skip((page - 1) * size)
      .limit(size);

    return {
      items,
      pagination: {
        page,
        size,
        totalPages,
        totalCount
      }
    };
  } catch (error) {
    throw new Error(`Erro ao listar os pedidos paginados: ${error}`);
  }
}

/**
 * Finds an order by its ID with populated client and cart information.
 *
 * @param {string} id - The ID of the order to find.
 * @returns {Promise<IOrder | null>} A promise that resolves to the found order or null if not found.
 * @throws {Error} If there's an error finding the order.
 */
export async function findOrderById(id: string): Promise<IOrder | null> {
  try {
    return await Order.findById(id)
      .populate('cliente', 'nomeCompleto')
      .populate('cesta');
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    throw error;
  }
}

/**
 * Updates a customer's purchase history with a new order.
 *
 * @param {string} customerId - The ID of the customer to update.
 * @param {IOrder} order - The order to add to the customer's history.
 * @returns {Promise<void>} A promise that resolves when the history is updated.
 */
async function updateCustomerHistory(
  customerId: string,
  order: IOrder
): Promise<void> {
  await Customer.findByIdAndUpdate(
    customerId,
    { $push: { historicoDeCompras: order } },
    { new: true }
  );
}

/**
 * Updates product inventory quantities based on purchased items.
 *
 * @param {IProduct[]} products - The array of products to update.
 * @param {number[]} quantities - The array of quantities to subtract from each product's inventory.
 * @returns {Promise<void>} A promise that resolves when all inventory updates are complete.
 */
async function updateProductInventory(
  products: IProduct[],
  quantities: number[]
): Promise<void> {
  const updatePromises = products.map((prod, index) =>
    Product.findByIdAndUpdate(prod._id, {
      $inc: { quantidade: -quantities[index] }
    })
  );
  await Promise.all(updatePromises);
}

/**
 * Creates a new order in the database and handles related operations:
 * - Updates the customer's purchase history
 * - Updates product inventory
 *
 * @param {IOrder} order - The order data to create.
 * @returns {Promise<IOrder | null>} A promise that resolves to the created order or null.
 * @throws {Error} If there's an error creating the order.
 */
export async function createOrder(order: IOrder): Promise<IOrder | null> {
  try {
    const createdOrder: IOrder = await Order.create(order);

    await Promise.all([
      updateCustomerHistory(order.cliente._id!, createdOrder),
      updateProductInventory(order.cesta, order.quantidades)
    ]);
    return await findOrderById(createdOrder._id!);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

/**
 * Updates the status of an order in the database.
 *
 * @param {string} orderId - The ID of the order to update.
 * @param {EStatus} updatedStatus - The new status to set.
 * @returns {Promise<IOrder | null>} A promise that resolves to the updated order or null.
 * @throws {Error} If there's an error updating the order status.
 */
async function updateOrderStatusInDatabase(
  orderId: string,
  updatedStatus: EStatus
): Promise<IOrder | null> {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { status: updatedStatus },
      { new: true }
    );
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw error;
  }
}

/**
 * Updates the status of an order. If the new status is ENTREGUE (delivered),
 * the order is removed instead of being updated.
 *
 * @param {string} orderId - The ID of the order to update.
 * @param {EStatus} updatedStatus - The new status to set.
 * @returns {Promise<IOrder | null>} A promise that resolves to the updated order or null if removed.
 * @throws {Error} If there's an error updating the order status.
 */
export async function updateOrderStatus(
  orderId: string,
  updatedStatus: EStatus
): Promise<IOrder | null> {
  if (updatedStatus == EStatus.ENTREGUE) {
    await removeOrderById(orderId);
    return null;
  }
  return await updateOrderStatusInDatabase(orderId, updatedStatus);
}

/**
 * Removes an order by its ID.
 *
 * @param {string} orderId - The ID of the order to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if the order was removed, false otherwise.
 * @throws {Error} If there's an error removing the order.
 */
export async function removeOrderById(orderId: string): Promise<boolean> {
  try {
    const removedOrder: IOrder | null = await Order.findByIdAndDelete(orderId);
    return removedOrder !== null;
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    throw error;
  }
}
