import { jest, describe, it, expect } from '@jest/globals';
import * as orderService from '../orderService';
import getAllOrdersPaged from '../orderService';
import {
  orderModel as Order,
  productModel as Product,
  customerModel as Customer
} from '@/trpc/server/models';
import {
  IOrder,
  IProduct,
  ICustomer,
  EStatus,
  EPaymentMethod
} from '@/interfaces';

jest.mock('@/trpc/server/models', () => ({
  orderModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn()
  },
  productModel: {
    findByIdAndUpdate: jest.fn()
  },
  customerModel: {
    findByIdAndUpdate: jest.fn()
  }
}));

describe('Order Service', () => {
  const mockCustomer: ICustomer = {
    _id: 'customer1',
    nomeCompleto: 'Cliente Teste',
    nomeUsuario: 'clienteteste',
    senha: 'senha123',
    email: 'cliente@teste.com',
    telefone: '123456789',
    endereco: {
      rua: 'Rua Teste',
      numero: '123',
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'Estado Teste',
      CEP: '12345-678'
    },
    historicoDeCompras: []
  };

  const mockProducts: IProduct[] = [
    {
      _id: 'product1',
      nome: 'Produto 1',
      preco: 10.5,
      quantidade: 5,
      descricao: 'Descrição 1',
      categoria: 'Categoria 1',
      imagem: ['imagem1.jpg'],
      nomeImagem: ['Nome da Imagem 1']
    },
    {
      _id: 'product2',
      nome: 'Produto 2',
      preco: 20.5,
      quantidade: 10,
      descricao: 'Descrição 2',
      categoria: 'Categoria 2',
      imagem: ['imagem2.jpg'],
      nomeImagem: ['Nome da Imagem 2']
    }
  ];

  const mockOrders: IOrder[] = [
    {
      _id: 'order1',
      cliente: mockCustomer,
      cesta: mockProducts,
      quantidades: [2, 1],
      valorTotal: 41.5,
      status: EStatus.PENDENTE,
      dataPedido: new Date('2023-01-01'),
      subTotal: 0,
      formaPagamento: EPaymentMethod.pix
    },
    {
      _id: 'order2',
      cliente: mockCustomer,
      cesta: [mockProducts[0]],
      quantidades: [3],
      valorTotal: 31.5,
      status: EStatus.PREPARANDO,
      dataPedido: new Date('2023-01-02'),
      subTotal: 0,
      formaPagamento: EPaymentMethod.pix
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders with populated client and cart', async () => {
      const populateClientMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders as never)
      });

      (Order.find as jest.Mock).mockReturnValue({
        populate: populateClientMock
      });

      const result = await orderService.getAllOrders();

      expect(Order.find).toHaveBeenCalled();
      expect(populateClientMock).toHaveBeenCalledWith(
        'cliente',
        'nomeCompleto'
      );
      expect(result).toEqual(mockOrders);
    });

    it('should throw an error when failing to list orders', async () => {
      (Order.find as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(orderService.getAllOrders()).rejects.toThrow();
    });
  });

  describe('getAllOrdersPaged', () => {
    const mockFindReturn = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockOrders as never)
    };

    const defaultQuery = { page: 1, size: 10 };

    beforeEach(() => {
      jest.clearAllMocks();
      (Order.find as jest.Mock).mockReturnValue(mockFindReturn);
      (Order.countDocuments as jest.Mock).mockResolvedValue(2 as never);
    });

    it('should return paginated orders with default parameters', async () => {
      const result = await getAllOrdersPaged({ ...defaultQuery });

      expect(Order.countDocuments).toHaveBeenCalledWith({});
      expect(Order.find).toHaveBeenCalledWith({});
      expect(mockFindReturn.populate).toHaveBeenNthCalledWith(
        1,
        'cliente',
        'nomeCompleto'
      );
      expect(mockFindReturn.populate).toHaveBeenNthCalledWith(2, 'cesta');
      expect(mockFindReturn.sort).toHaveBeenCalledWith({ dataHora: -1 });
      expect(mockFindReturn.skip).toHaveBeenCalledWith(0);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(10);

      expect(result).toEqual({
        items: mockOrders,
        page: 1,
        size: 10,
        totalPages: 1,
        totalCount: 2
      });
    });

    it('should return paginated orders with custom page and size', async () => {
      const page = 2;
      const size = 5;

      const result = await getAllOrdersPaged({ page, size });

      expect(mockFindReturn.skip).toHaveBeenCalledWith((page - 1) * size);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(size);
      expect(result.page).toBe(page);
      expect(result.size).toBe(size);
    });

    it('should apply search filter correctly', async () => {
      const search = 'test';
      const expectedFilter = {
        $or: [
          { 'cliente.nomeCompleto': { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { observacao: { $regex: search, $options: 'i' } }
        ]
      };

      await getAllOrdersPaged({ ...defaultQuery, search });

      expect(Order.find).toHaveBeenCalledWith(expectedFilter);
      expect(Order.countDocuments).toHaveBeenCalledWith(expectedFilter);
    });

    it('should apply ascending sort correctly', async () => {
      const sort = 'status';

      await getAllOrdersPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ status: 1 });
    });

    it('should apply descending sort correctly', async () => {
      const sort = '-valorTotal';

      await getAllOrdersPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ valorTotal: -1 });
    });

    it('should calculate total pages correctly', async () => {
      (Order.countDocuments as jest.Mock).mockResolvedValue(21 as never);

      const result = await getAllOrdersPaged({ page: 1, size: 10 });

      expect(result.totalPages).toBe(3);
    });

    it('should return at least 1 page when no results found', async () => {
      (Order.countDocuments as jest.Mock).mockResolvedValue(0 as never);

      const result = await getAllOrdersPaged({ ...defaultQuery });

      expect(result.totalPages).toBe(1);
    });

    it('should throw an error when failing to retrieve paginated orders', async () => {
      (Order.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(getAllOrdersPaged({ ...defaultQuery })).rejects.toThrow(
        'Erro ao listar os pedidos paginados'
      );
    });
  });

  describe('findOrderById', () => {
    it('should find an order by id with populated data', async () => {
      const orderId = 'order1';
      const populateClientMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders[0] as never)
      });

      (Order.findById as jest.Mock).mockReturnValue({
        populate: populateClientMock
      });

      const result = await orderService.findOrderById(orderId);

      expect(Order.findById).toHaveBeenCalledWith(orderId);
      expect(populateClientMock).toHaveBeenCalledWith(
        'cliente',
        'nomeCompleto'
      );
      expect(result).toEqual(mockOrders[0]);
    });

    it('should return null when order is not found', async () => {
      const orderId = 'nonexistent';
      const populateClientMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null as never)
      });

      (Order.findById as jest.Mock).mockReturnValue({
        populate: populateClientMock
      });

      const result = await orderService.findOrderById(orderId);

      expect(result).toBeNull();
    });

    it('should throw an error when failing to find order', async () => {
      const orderId = 'order1';
      (Order.findById as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(orderService.findOrderById(orderId)).rejects.toThrow();
    });
  });

  describe('createOrder', () => {
    it('should create an order and update related data', async () => {
      const newOrder: IOrder = {
        cliente: { _id: 'customer1' } as ICustomer,
        cesta: mockProducts,
        quantidades: [1, 2],
        valorTotal: 51.5,
        status: EStatus.PENDENTE,
        dataPedido: new Date('2023-01-03'),
        subTotal: 0,
        formaPagamento: EPaymentMethod.pix
      };

      const createdOrder = { ...newOrder, _id: 'new-order-id' };

      (Order.create as jest.Mock).mockResolvedValue(createdOrder as never);
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockCustomer as never
      );

      const productUpdateMock = jest.fn().mockResolvedValue({} as never);
      (Product.findByIdAndUpdate as jest.Mock).mockImplementation(
        productUpdateMock
      );

      const populateClientMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(createdOrder as never)
      });

      (Order.findById as jest.Mock).mockReturnValue({
        populate: populateClientMock
      });

      const result = await orderService.createOrder(newOrder);

      expect(Order.create).toHaveBeenCalledWith(newOrder);
      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(
        'customer1',
        { $push: { historicoDeCompras: createdOrder } },
        { new: true }
      );
      expect(Product.findByIdAndUpdate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(createdOrder);
    });

    it('should throw an error when failing to create order', async () => {
      const newOrder: IOrder = {
        cliente: { _id: 'customer1' } as ICustomer,
        cesta: mockProducts,
        quantidades: [1, 2],
        valorTotal: 51.5,
        status: EStatus.PENDENTE,
        dataPedido: new Date('2023-01-03'),
        subTotal: 0,
        formaPagamento: EPaymentMethod.pix
      };

      (Order.create as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(orderService.createOrder(newOrder)).rejects.toThrow();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status when not delivered', async () => {
      const orderId = 'order1';
      const newStatus = EStatus.PREPARANDO;
      const updatedOrder = { ...mockOrders[0], status: newStatus };

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedOrder as never
      );

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        orderId,
        { status: newStatus },
        { new: true }
      );
      expect(result).toEqual(updatedOrder);
    });

    it('should remove order when status is ENTREGUE', async () => {
      const orderId = 'order1';
      const newStatus = EStatus.ENTREGUE;

      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockOrders[0] as never
      );

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(Order.findByIdAndDelete).toHaveBeenCalledWith(orderId);
      expect(result).toBeNull();
    });

    it('should throw an error when failing to update order status', async () => {
      const orderId = 'order1';
      const newStatus = EStatus.PREPARANDO;

      (Order.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        orderService.updateOrderStatus(orderId, newStatus)
      ).rejects.toThrow();
    });
  });

  describe('removeOrderById', () => {
    it('should remove an order by id and return true', async () => {
      const orderId = 'order1';

      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockOrders[0] as never
      );

      const result = await orderService.removeOrderById(orderId);

      expect(Order.findByIdAndDelete).toHaveBeenCalledWith(orderId);
      expect(result).toBe(true);
    });

    it('should return false when order to remove is not found', async () => {
      const orderId = 'nonexistent';

      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(null as never);

      const result = await orderService.removeOrderById(orderId);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to remove order', async () => {
      const orderId = 'order1';

      (Order.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(orderService.removeOrderById(orderId)).rejects.toThrow();
    });
  });
});
