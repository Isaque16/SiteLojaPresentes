import { productModel as Product } from '@/trpc/server/models';
import { IProduct, IPagedQuery, IPagedResult } from '@/interfaces';

/**
 * Retrieves all products from the database.
 *
 * @returns {Promise<IProduct[]>} A promise that resolves to an array of products.
 * @throws {Error} If there's an error retrieving the products.
 */
export async function getAllProducts(): Promise<IProduct[]> {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error(`Erro ao listar os produtos: ${error}`);
  }
}

/**
 * Retrieves products with pagination, sorting, and search capabilities.
 *
 * @param {IPaginationQuery} query - The pagination query.
 * @param {number} [query.page=1] - The page number to retrieve.
 * @param {number} [query.size=10] - The number of items per page.
 * @param {string} [query.sort] - The field to sort by, prefix with '-' for descending order.
 * @param {string} [query.search] - The search query to filter products.
 * @returns {Promise<IPagedResult<IProduct>>} A promise that resolves to the paginated result containing products.
 * @throws {Error} If there's an error retrieving the paginated products.
 */
export async function getAllProductsPaged({
  page = 1,
  size = 10,
  sort,
  search
}: IPagedQuery): Promise<IPagedResult<IProduct>> {
  try {
    const filter = search
      ? {
          $or: [
            { nome: { $regex: search, $options: 'i' } },
            { descricao: { $regex: search, $options: 'i' } },
            { categoria: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sortOption: Record<string, 1 | -1> = sort
      ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 }
      : { nome: 1 };

    const totalCount = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / size) || 1;

    const items = await Product.find(filter)
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
    throw new Error(`Erro ao listar os produtos paginados: ${error}`);
  }
}

/**
 * Filters products by a specific category.
 *
 * @param {string} category - The category to filter products by.
 * @returns {Promise<IProduct[]>} A promise that resolves to an array of filtered products.
 * @throws {Error} If there's an error filtering the products.
 */
export async function filterProductsByCategory(
  category: string
): Promise<IProduct[]> {
  try {
    return await Product.find({
      categoria: category
    });
  } catch (error) {
    throw new Error(`Erro ao filtrar produtos pela categoria: ${error}`);
  }
}

/**
 * Finds a product by its ID.
 *
 * @param {string} id - The ID of the product to find.
 * @returns {Promise<IProduct | null>} A promise that resolves to the found product or null if not found.
 * @throws {Error} If there's an error finding the product.
 */
export async function findProductById(id: string): Promise<IProduct | null> {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error(`Erro ao encontrar o produto: ${error}`);
  }
}

/**
 * Checks if a product has stock available.
 *
 * @param {string} id - The ID of the product to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the product has stock, false otherwise.
 * @throws {Error} If there's an error checking the product stock.
 */
export async function checkProductStock(id: string): Promise<boolean> {
  try {
    const foundProduct: IProduct | null = await Product.findById(id);
    return foundProduct ? foundProduct.quantidade > 0 : false;
  } catch (error) {
    throw new Error(`Erro ao verificar o estoque do produto: ${error}`);
  }
}

/**
 * Saves a product to the database. If the product has an ID, it updates the existing product;
 * otherwise, it creates a new one.
 *
 * @param {IProduct} productData - The product data to save.
 * @returns {Promise<IProduct | null>} A promise that resolves to the saved product or null.
 * @throws {Error} If there's an error saving the product.
 */
export async function saveProduct(
  productData: IProduct
): Promise<IProduct | null> {
  let savedProduct: IProduct | null = null;
  try {
    if (productData._id) {
      savedProduct = await Product.findByIdAndUpdate(
        productData._id,
        productData,
        { new: true }
      );
    } else savedProduct = await Product.create(productData);
    return savedProduct;
  } catch (error) {
    throw new Error(`Erro ao salvar o produto: ${error}`);
  }
}

/**
 * Removes a product by its ID.
 *
 * @param {string} id - The ID of the product to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if the product was removed, false otherwise.
 * @throws {Error} If there's an error removing the product.
 */
export async function removeProductById(id: string): Promise<boolean> {
  try {
    const removedProduct: IProduct | null = await Product.findByIdAndDelete(id);
    return removedProduct !== null;
  } catch (error) {
    throw new Error(`Erro ao remover o produto: ${error}`);
  }
}
