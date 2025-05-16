import { jest, describe, it, expect } from '@jest/globals';
import bcrypt from 'bcrypt';
import { getCookie, setCookie, deleteCookie } from 'cookies-next/server';
import { cookies } from 'next/headers';
import * as authService from '../authService';
import * as customerService from '../customerService';
import { ICustomer } from '@/interfaces';

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

jest.mock('cookies-next/server', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

jest.mock('next/headers', () => ({
  cookies: {}
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
    it('should authenticate user with valid credentials', async () => {
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
      expect(result).toEqual({
        success: true,
        userId: 'customer123',
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

  describe('createUserSession', () => {
    it('should create user session by setting a cookie', async () => {
      (setCookie as jest.Mock).mockResolvedValue(undefined as never);

      await authService.createUserSession('customer123');

      expect(setCookie).toHaveBeenCalledWith('user_session', 'customer123', {
        cookies,
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
    });

    it('should throw an error when setting cookie fails', async () => {
      const errorMessage = 'Failed to set cookie';
      (setCookie as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(
        authService.createUserSession('customer123')
      ).rejects.toThrow(
        `Erro ao criar sessão do usuário: Error: ${errorMessage}`
      );
    });
  });

  describe('logoutUser', () => {
    it('should logout user by removing session cookie', async () => {
      (deleteCookie as jest.Mock).mockResolvedValue(undefined as never);

      await authService.logoutUser();

      expect(deleteCookie).toHaveBeenCalledWith('user_session', { cookies });
    });

    it('should throw an error when removing cookie fails', async () => {
      const errorMessage = 'Failed to delete cookie';
      (deleteCookie as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(authService.logoutUser()).rejects.toThrow(
        `Erro ao encerrar sessão do usuário: Error: ${errorMessage}`
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user ID when session cookie exists', async () => {
      (getCookie as jest.Mock).mockResolvedValue('customer123' as never);

      const result = await authService.getCurrentUser();

      expect(getCookie).toHaveBeenCalledWith('user_session', { cookies });
      expect(result).toBe('customer123');
    });

    it('should return null when no session cookie exists', async () => {
      (getCookie as jest.Mock).mockResolvedValue(null as never);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should throw an error when getting cookie fails', async () => {
      const errorMessage = 'Failed to get cookie';
      (getCookie as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(authService.getCurrentUser()).rejects.toThrow(
        `Erro ao verificar sessão atual: Error: ${errorMessage}`
      );
    });
  });
});
