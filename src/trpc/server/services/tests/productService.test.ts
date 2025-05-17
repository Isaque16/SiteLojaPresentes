import { jest, describe, it, expect } from '@jest/globals';
import * as productService from '../productService';
import { productModel as Product } from '@/trpc/server/models';
import IProduct from '@/interfaces/IProduct';

jest.mock('@/trpc/server/models', () => ({
  productModel: {
    find: jest.fn<() => Promise<IProduct[]>>(),
    findById: jest.fn<() => Promise<IProduct | null>>(),
    findByIdAndUpdate: jest.fn<() => Promise<IProduct | null>>(),
    create: jest.fn<() => Promise<IProduct>>(),
    findByIdAndDelete: jest.fn<() => Promise<IProduct | null>>(),
    countDocuments: jest.fn<() => Promise<number>>()
  }
}));

describe('Product Service', () => {
  const mockProducts: IProduct[] = [
    {
      _id: '1',
      nome: 'Produto 1',
      preco: 10.5,
      quantidade: 5,
      descricao: 'Descrição 1',
      categoria: 'Categoria 1',
      imagem: ['imagem1.jpg'],
      nomeImagem: ['nomeImagem1.jpg']
    },
    {
      _id: '2',
      nome: 'Produto 2',
      preco: 20.5,
      quantidade: 0,
      descricao: 'Descrição 2',
      categoria: 'Categoria 2',
      imagem: ['imagem2.jpg'],
      nomeImagem: ['nomeImagem2.jpg']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      (Product.find as jest.Mock).mockResolvedValue(mockProducts as never);

      const result = await productService.getAllProducts();

      expect(Product.find).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error when failing to list products', async () => {
      const errorMessage = 'Database error';
      (Product.find as jest.Mock).mockRejectedValue(
        new Error(errorMessage) as never
      );

      await expect(productService.getAllProducts()).rejects.toThrow(
        'Erro ao listar os produtos'
      );
    });
  });

  describe('getAllProductsPaged', () => {
    const mockFindReturn = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockProducts as never)
    };
    const defaultQuery = { page: 1, size: 10 };

    beforeEach(() => {
      jest.clearAllMocks();
      (Product.find as jest.Mock).mockReturnValue(mockFindReturn);
      (Product.countDocuments as jest.Mock).mockResolvedValue(2 as never);
    });

    it('should return paginated products with default parameters', async () => {
      const result = await productService.getAllProductsPaged(defaultQuery);

      expect(Product.countDocuments).toHaveBeenCalledWith({});
      expect(Product.find).toHaveBeenCalledWith({});
      expect(mockFindReturn.sort).toHaveBeenCalledWith({ nome: 1 });
      expect(mockFindReturn.skip).toHaveBeenCalledWith(0);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(10);

      expect(result).toEqual({
        items: mockProducts,
        page: 1,
        size: 10,
        totalPages: 1,
        totalCount: 2
      });
    });

    it('should return paginated products with custom page and size', async () => {
      const page = 2;
      const size = 5;

      const result = await productService.getAllProductsPaged({ page, size });

      expect(mockFindReturn.skip).toHaveBeenCalledWith((page - 1) * size);
      expect(mockFindReturn.limit).toHaveBeenCalledWith(size);
      expect(result.page).toBe(page);
      expect(result.size).toBe(size);
    });

    it('should apply search filter correctly', async () => {
      const search = 'test';
      const expectedFilter = {
        $or: [
          { nome: { $regex: search, $options: 'i' } },
          { descricao: { $regex: search, $options: 'i' } },
          { categoria: { $regex: search, $options: 'i' } }
        ]
      };

      await productService.getAllProductsPaged({ ...defaultQuery, search });

      expect(Product.find).toHaveBeenCalledWith(expectedFilter);
      expect(Product.countDocuments).toHaveBeenCalledWith(expectedFilter);
    });

    it('should apply ascending sort correctly', async () => {
      const sort = 'preco';

      await productService.getAllProductsPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ preco: 1 });
    });

    it('should apply descending sort correctly', async () => {
      const sort = '-preco';

      await productService.getAllProductsPaged({ ...defaultQuery, sort });

      expect(mockFindReturn.sort).toHaveBeenCalledWith({ preco: -1 });
    });

    it('should calculate total pages correctly', async () => {
      (Product.countDocuments as jest.Mock).mockResolvedValue(21 as never);

      const result = await productService.getAllProductsPaged({
        page: 1,
        size: 10
      });

      expect(result.totalPages).toBe(3);
    });

    it('should return at least 1 page when no results found', async () => {
      (Product.countDocuments as jest.Mock).mockResolvedValue(0 as never);

      const result = await productService.getAllProductsPaged(defaultQuery);

      expect(result.totalPages).toBe(1);
    });

    it('should throw an error when failing to retrieve paginated products', async () => {
      (Product.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Database error') as never
      );

      await expect(
        productService.getAllProductsPaged(defaultQuery)
      ).rejects.toThrow('Erro ao listar os produtos paginados');
    });
  });

  describe('filterProductsByCategory', () => {
    it('should filter products by category', async () => {
      const categoria = 'Categoria 1';
      const filteredProducts = [mockProducts[0]];
      (Product.find as jest.Mock).mockResolvedValue(filteredProducts as never);

      const result = await productService.filterProductsByCategory(categoria);

      expect(Product.find).toHaveBeenCalledWith({ categoria });
      expect(result).toEqual(filteredProducts);
    });

    it('should return an empty array when no products match the category', async () => {
      const categoria = 'CategoriaInexistente';
      (Product.find as jest.Mock).mockResolvedValue([] as never);

      const result = await productService.filterProductsByCategory(categoria);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw an error when failing to filter by category', async () => {
      const categoria = 'Categoria 1';
      (Product.find as jest.Mock).mockRejectedValue(new Error('Erro') as never);

      await expect(
        productService.filterProductsByCategory(categoria)
      ).rejects.toThrow();
    });
  });

  describe('findProductById', () => {
    it('should find a product by ID', async () => {
      const productId = '1';
      (Product.findById as jest.Mock).mockResolvedValue(
        mockProducts[0] as never
      );

      const result = await productService.findProductById(productId);

      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProducts[0]);
    });

    it('should return null when the product is not found', async () => {
      const productId = 'idInexistente';
      (Product.findById as jest.Mock).mockResolvedValue(null as never);

      const result = await productService.findProductById(productId);

      expect(result).toBeNull();
    });

    it('should throw an error when failing to find the product', async () => {
      const productId = '1';
      (Product.findById as jest.Mock).mockRejectedValue(new Error() as never);

      await expect(productService.findProductById(productId)).rejects.toThrow();
    });
  });

  describe('checkProductStock', () => {
    it('should return true when the product has stock', async () => {
      const productId = '1';
      (Product.findById as jest.Mock).mockResolvedValue(
        mockProducts[0] as never
      ); // quantidade 5

      const result = await productService.checkProductStock(productId);

      expect(result).toBe(true);
    });

    it('should return false when the product is out of stock', async () => {
      const productId = '2';
      (Product.findById as jest.Mock).mockResolvedValue(
        mockProducts[1] as never
      ); // quantidade 0

      const result = await productService.checkProductStock(productId);

      expect(result).toBe(false);
    });

    it('should return false when the product is not found', async () => {
      const productId = 'idInexistente';
      (Product.findById as jest.Mock).mockResolvedValue(null as never);

      const result = await productService.checkProductStock(productId);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to check stock', async () => {
      const productId = '1';
      (Product.findById as jest.Mock).mockRejectedValue(new Error() as never);

      await expect(
        productService.checkProductStock(productId)
      ).rejects.toThrow();
    });
  });

  describe('saveProduct', () => {
    it('should create a new product when there is no ID', async () => {
      const newProduct: IProduct = {
        nome: 'Novo Produto',
        preco: 30.5,
        quantidade: 10,
        descricao: 'Nova Descrição',
        categoria: 'Nova Categoria',
        imagem: ['nova-imagem.jpg'],
        nomeImagem: ['nova-imagem.jpg']
      };
      const savedProduct = { ...newProduct, _id: '3' };

      (Product.create as jest.Mock).mockResolvedValue(savedProduct as never);

      const result = await productService.saveProduct(newProduct);

      expect(Product.create).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(savedProduct);
    });

    it('should update an existing product when there is an ID', async () => {
      const existingProduct = {
        ...mockProducts[0],
        nome: 'Produto Atualizado'
      };

      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        existingProduct as never
      );

      const result = await productService.saveProduct(existingProduct);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        existingProduct._id,
        existingProduct,
        { new: true }
      );
      expect(result).toEqual(existingProduct);
    });

    it('should throw an error when failing to save the product', async () => {
      const newProduct: IProduct = {
        nome: 'Produto',
        preco: 10,
        quantidade: 5,
        descricao: '',
        categoria: '',
        imagem: [],
        nomeImagem: []
      };
      (Product.create as jest.Mock).mockRejectedValue(new Error() as never);

      await expect(productService.saveProduct(newProduct)).rejects.toThrow();
    });
  });

  describe('removeProductById', () => {
    it('should remove a product by ID and return true', async () => {
      const productId = '1';
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockProducts[0] as never
      );

      const result = await productService.removeProductById(productId);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(productId);
      expect(result).toBe(true);
    });

    it('should return false when the product to be removed is not found', async () => {
      const productId = 'idInexistente';
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null as never);

      const result = await productService.removeProductById(productId);

      expect(result).toBe(false);
    });

    it('should throw an error when failing to remove the product', async () => {
      const productId = '1';
      (Product.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error() as never
      );

      await expect(
        productService.removeProductById(productId)
      ).rejects.toThrow();
    });
  });
});
