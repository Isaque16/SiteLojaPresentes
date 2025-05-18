import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authService from '../authService';
import * as customerService from '../customerService';
import { ICustomer } from '@/interfaces';

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
  verify: jest.fn()
}));

jest.mock('../customerService', () => ({
  findCustomerByUserName: jest.fn()
}));

describe('Auth Service', () => {
  const mockCustomer: ICustomer = {
    _id: 'customer123',
    nomeCompleto: 'Test Customer',
    nomeUsuario: 'testuser',
    senha: 'hashedPassword123',
    email: 'test@example.com',
    telefone: '123456789',
    endereco: {
      rua: 'Test Street',
      numero: '123',
      bairro: 'Test District',
      cidade: 'Test City',
      estado: 'Test State',
      CEP: '12345-678'
    },
    historicoDeCompras: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      (customerService.findCustomerByUserName as jest.Mock).mockResolvedValue(
        mockCustomer as never
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

      const result = await authService.authenticateUser(
        'testuser',
        'password123'
      );

      expect(customerService.findCustomerByUserName).toHaveBeenCalledWith(
        'testuser'
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123'
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'customer123' },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toEqual({
        success: true,
        token: 'fake-jwt-token',
        message: 'Login realizado com sucesso!'
      });
    });

    it('should fail authentication when user does not exist', async () => {
      (customerService.findCustomerByUserName as jest.Mock).mockResolvedValue(
        null as never
      );

      const result = await authService.authenticateUser(
        'nonexistentuser',
        'password123'
      );

      expect(result).toEqual({
        success: false,
        message: 'nome de usuário ou senha incorretos'
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should fail authentication when password is incorrect', async () => {
      (customerService.findCustomerByUserName as jest.Mock).mockResolvedValue(
        mockCustomer as never
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      const result = await authService.authenticateUser(
        'testuser',
        'wrongpassword'
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword123'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: 'nome de usuário ou senha incorretos'
      });
    });

    it('should throw an error when database query fails', async () => {
      const errorMessage = 'Database connection error';
      (customerService.findCustomerByUserName as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(
        authService.authenticateUser('testuser', 'password123')
      ).rejects.toThrow(`Erro ao autenticar usuário: Error: ${errorMessage}`);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded token payload when valid', () => {
      const mockPayload = { userId: 'customer123' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = authService.verifyToken('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-token',
        expect.any(String)
      );
      expect(result).toEqual(mockPayload);
    });

    it('should return null when token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.verifyToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user ID when token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'customer123' });

      const result = await authService.getCurrentUser('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-token',
        expect.any(String)
      );
      expect(result).toBe('customer123');
    });

    it('should return null when token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.getCurrentUser('invalid-token');

      expect(result).toBeNull();
    });

    it('should throw an error when verification process fails unexpectedly', async () => {
      const errorMessage = 'Unexpected error';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error(errorMessage);
        error.name = 'UnexpectedError';
        throw error;
      });

      await expect(authService.getCurrentUser('token')).rejects.toThrow(
        `Erro ao verificar sessão atual: Error: ${errorMessage}`
      );
    });
  });
});
