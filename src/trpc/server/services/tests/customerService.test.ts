import { jest, describe, it, expect } from '@jest/globals';
import * as customerService from '../customerService';
import { customerModel as Customer } from '@/trpc/server/models';
import ICustomer from '@/interfaces/ICustomer';
import IAddress from '@/interfaces/IAddress';
import bcrypt from 'bcrypt';

jest.mock('@/trpc/server/models', () => ({
  customerModel: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('Customer Service', () => {
  const mockCustomers: ICustomer[] = [
    {
      _id: '1',
      nomeCompleto: 'Cliente 1',
      nomeUsuario: 'cliente1',
      senha: 'senha123',
      email: 'cliente1@example.com',
      telefone: '123456789',
      endereco: {
        rua: 'Rua A',
        numero: '123',
        complemento: 'Apto 1',
        bairro: 'Bairro A',
        cidade: 'Cidade A',
        estado: 'Estado A',
        CEP: '12345-678'
      },
      historicoDeCompras: []
    },
    {
      _id: '2',
      nomeCompleto: 'Cliente 2',
      nomeUsuario: 'cliente2',
      senha: 'senha456',
      email: 'cliente2@example.com',
      telefone: '987654321',
      endereco: {
        rua: 'Rua B',
        numero: '456',
        complemento: 'Apto 2',
        bairro: 'Bairro B',
        cidade: 'Cidade B',
        estado: 'Estado B',
        CEP: '98765-432'
      },
      historicoDeCompras: []
    }
  ];

  const mockAddress: IAddress = {
    rua: 'Rua Nova',
    numero: '789',
    complemento: 'Apto 3',
    bairro: 'Bairro Novo',
    cidade: 'Cidade Nova',
    estado: 'Estado Novo',
    CEP: '45678-901'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      (Customer.find as jest.Mock).mockResolvedValue(mockCustomers as never);

      const result = await customerService.getAllCustomers();

      expect(Customer.find).toHaveBeenCalled();
      expect(result).toEqual(mockCustomers);
    });

    it('should throw an error when failing to list customers', async () => {
      const errorMessage = 'Database error';
      (Customer.find as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(customerService.getAllCustomers()).rejects.toThrow(
        `Erro ao listar os clientes`
      );
    });
  });

  describe('getAllCustomersPaged', () => {
    const mockFindReturn = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCustomers as never)
    };

    const defaultQuery = { page: 1, size: 10 };

    beforeEach(() => {
      jest.clearAllMocks();
      (Customer.find as jest.Mock).mockReturnValue(mockFindReturn);
      (Customer.countDocuments as jest.Mock).mockResolvedValue(2 as never);
    });

    it('should return paginated customers with default parameters', async () => {
      const result = await customerService.getAllCustomersPaged({
        ...defaultQuery
      });

      expect(Customer.countDocuments).toHaveBeenCalledWith({});
      expect(Customer.find).toHaveBeenCalledWith({});
      expect(mockFindReturn.sort).toHaveBeenCalledWith({ nomeCompleto: 1 });
      expect(mockFindReturn.skip).toHaveBeenCalledWith(0);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(10);

      expect(result).toEqual({
        items: mockCustomers,
        page: 1,
        size: 10,
        totalPages: 1,
        totalCount: 2
      });
    });

    it('should return paginated customers with custom page and size', async () => {
      const page = 2;
      const size = 5;

      const result = await customerService.getAllCustomersPaged({ page, size });

      expect(mockFindReturn.skip).toHaveBeenCalledWith((page - 1) * size);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(size);
      expect(result.page).toBe(page);
      expect(result.size).toBe(size);
    });

    it('should apply search filter correctly', async () => {
      const search = 'test';
      const expectedFilter = {
        $or: [
          { nomeCompleto: { $regex: search, $options: 'i' } },
          { nomeUsuario: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { telefone: { $regex: search, $options: 'i' } }
        ]
      };

      await customerService.getAllCustomersPaged({ ...defaultQuery, search });

      expect(Customer.find).toHaveBeenCalledWith(expectedFilter);
      expect(Customer.countDocuments).toHaveBeenCalledWith(expectedFilter);
    });

    it('should apply ascending sort correctly', async () => {
      const sort = 'email';

      await customerService.getAllCustomersPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ email: 1 });
    });

    it('should apply descending sort correctly', async () => {
      const sort = '-nomeCompleto';

      await customerService.getAllCustomersPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ nomeCompleto: -1 });
    });

    it('should calculate total pages correctly', async () => {
      (Customer.countDocuments as jest.Mock).mockResolvedValue(21 as never);

      const result = await customerService.getAllCustomersPaged({
        ...defaultQuery,
        size: 10
      });

      expect(result.totalPages).toBe(3);
    });

    it('should return at least 1 page when no results found', async () => {
      (Customer.countDocuments as jest.Mock).mockResolvedValue(0 as never);

      const result = await customerService.getAllCustomersPaged({
        ...defaultQuery
      });

      expect(result.totalPages).toBe(1);
    });

    it('should throw an error when failing to retrieve paginated customers', async () => {
      (Customer.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.getAllCustomersPaged({ ...defaultQuery })
      ).rejects.toThrow('Erro ao listar os clientes paginados');
    });
  });

  describe('findCustomerByUserName', () => {
    it('should find a customer by username', async () => {
      const username = 'cliente1';
      (Customer.findOne as jest.Mock).mockResolvedValue(
        mockCustomers[0] as never
      );

      const result = await customerService.findCustomerByUserName(username);

      expect(Customer.findOne).toHaveBeenCalledWith({
        nomeUsuario: { $regex: username, $options: 'i' }
      });
      expect(result).toEqual(mockCustomers[0]);
    });

    it('should return null when customer is not found', async () => {
      const username = 'nonexistent';
      (Customer.findOne as jest.Mock).mockResolvedValue(null as never);

      const result = await customerService.findCustomerByUserName(username);

      expect(result).toBeNull();
    });

    it('should throw an error when failing to find customer by username', async () => {
      const username = 'cliente1';
      (Customer.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.findCustomerByUserName(username)
      ).rejects.toThrow();
    });
  });

  describe('findCustomerById', () => {
    it('should find a customer by id with populated purchase history', async () => {
      const customerId = '1';
      const populateMock = jest
        .fn()
        .mockResolvedValue(mockCustomers[0] as never);
      (Customer.findById as jest.Mock).mockReturnValue({
        populate: populateMock
      });

      const result = await customerService.findCustomerById(customerId);

      expect(Customer.findById).toHaveBeenCalledWith(customerId);
      expect(populateMock).toHaveBeenCalledWith('historicoDeCompras');
      expect(result).toEqual(mockCustomers[0]);
    });

    it('should return null when customer is not found', async () => {
      const customerId = 'nonexistent';
      const populateMock = jest.fn().mockResolvedValue(null as never);
      (Customer.findById as jest.Mock).mockReturnValue({
        populate: populateMock
      });

      const result = await customerService.findCustomerById(customerId);

      expect(result).toBeNull();
    });

    it('should throw an error when failing to find customer by id', async () => {
      const customerId = '1';
      (Customer.findById as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        customerService.findCustomerById(customerId)
      ).rejects.toThrow();
    });
  });

  describe('saveCustomer', () => {
    it('should create a new customer when no id is provided', async () => {
      const newCustomer: ICustomer = {
        nomeCompleto: 'Novo Cliente',
        nomeUsuario: 'novocliente',
        senha: 'senha789',
        email: 'novo@example.com',
        telefone: '111222333',
        endereco: {
          rua: 'Rua C',
          numero: '789',
          bairro: 'Bairro C',
          cidade: 'Cidade C',
          estado: 'Estado C',
          CEP: '33333-333'
        },
        historicoDeCompras: []
      };
      const hashedPassword = 'hashedPassword123';
      const savedCustomer = { ...newCustomer, _id: '3', senha: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword as never);
      (Customer.create as jest.Mock).mockResolvedValue(savedCustomer as never);

      const result = await customerService.saveCustomer(newCustomer);

      expect(bcrypt.hash).toHaveBeenCalledWith(newCustomer.senha, 10);
      expect(Customer.create).toHaveBeenCalledWith({
        ...newCustomer,
        senha: hashedPassword
      });
      expect(result).toEqual(savedCustomer);
    });

    it('should update an existing customer when id is provided', async () => {
      const existingCustomer = {
        ...mockCustomers[0],
        nome: 'Cliente Atualizado'
      };
      const hashedPassword = 'hashedPassword123';
      const updatedCustomer = { ...existingCustomer, senha: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword as never);
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedCustomer as never
      );

      const result = await customerService.saveCustomer(existingCustomer);

      expect(bcrypt.hash).toHaveBeenCalledWith(existingCustomer.senha, 10);
      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(
        existingCustomer._id,
        { ...existingCustomer, senha: hashedPassword },
        { new: true }
      );
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw an error when failing to save customer', async () => {
      const newCustomer: ICustomer = {
        nomeCompleto: 'Novo Cliente',
        nomeUsuario: 'novocliente',
        senha: 'senha789',
        email: 'novo@example.com',
        telefone: '111222333',
        endereco: {
          rua: 'Rua C',
          numero: '789',
          bairro: 'Bairro C',
          cidade: 'Cidade C',
          estado: 'Estado C',
          CEP: '33333-333'
        },
        historicoDeCompras: []
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword' as never);
      (Customer.create as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(customerService.saveCustomer(newCustomer)).rejects.toThrow();
    });
  });

  describe('saveCustomerAdress', () => {
    it('should update a customer address', async () => {
      const customerId = '1';
      const updatedCustomer = {
        ...mockCustomers[0],
        endereco: mockAddress
      };

      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedCustomer as never
      );

      const result = await customerService.saveCustomerAdress(
        customerId,
        mockAddress
      );

      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(
        customerId,
        { endereco: mockAddress },
        { new: true }
      );
      expect(result).toEqual(updatedCustomer);
    });

    it('should return null when customer is not found', async () => {
      const customerId = 'nonexistent';

      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        null as never
      );

      const result = await customerService.saveCustomerAdress(
        customerId,
        mockAddress
      );

      expect(result).toBeNull();
    });

    it('should throw an error when failing to update customer address', async () => {
      const customerId = '1';

      (Customer.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.saveCustomerAdress(customerId, mockAddress)
      ).rejects.toThrow();
    });
  });

  describe('removeCustomerById', () => {
    it('should remove a customer by id and return true', async () => {
      const customerId = '1';

      (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockCustomers[0] as never
      );

      const result = await customerService.removeCustomerById(customerId);

      expect(Customer.findByIdAndDelete).toHaveBeenCalledWith(customerId);
      expect(result).toBe(true);
    });

    it('should return false when customer to remove is not found', async () => {
      const customerId = 'nonexistent';

      (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue(
        null as never
      );

      const result = await customerService.removeCustomerById(customerId);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to remove customer', async () => {
      const customerId = '1';

      (Customer.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.removeCustomerById(customerId)
      ).rejects.toThrow();
    });
  });

  describe('removeCustomerByUserName', () => {
    it('should remove a customer by username and return true', async () => {
      const customerName = 'Cliente 1';

      (Customer.findOneAndDelete as jest.Mock).mockResolvedValue(
        mockCustomers[0] as never
      );

      const result =
        await customerService.removeCustomerByUserName(customerName);

      expect(Customer.findOneAndDelete).toHaveBeenCalledWith({
        nome: customerName
      });
      expect(result).toBe(true);
    });

    it('should return false when customer to remove is not found', async () => {
      const customerName = 'NonexistentCustomer';

      (Customer.findOneAndDelete as jest.Mock).mockResolvedValue(null as never);

      const result =
        await customerService.removeCustomerByUserName(customerName);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to remove customer by username', async () => {
      const customerName = 'Cliente 1';

      (Customer.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.removeCustomerByUserName(customerName)
      ).rejects.toThrow();
    });
  });

  describe('checkCustomerByEmail', () => {
    it('should return true when a customer with the email exists', async () => {
      const email = 'cliente1@example.com';

      (Customer.findOne as jest.Mock).mockResolvedValue(
        mockCustomers[0] as never
      );

      const result = await customerService.checkCustomerByEmail(email);

      expect(Customer.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBe(true);
    });

    it('should return false when no customer with the email exists', async () => {
      const email = 'nonexistent@example.com';

      (Customer.findOne as jest.Mock).mockResolvedValue(null as never);

      const result = await customerService.checkCustomerByEmail(email);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to check for customer by email', async () => {
      const email = 'cliente1@example.com';

      (Customer.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        customerService.checkCustomerByEmail(email)
      ).rejects.toThrow();
    });
  });
});
