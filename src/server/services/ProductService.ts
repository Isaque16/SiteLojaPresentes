import IProduct from "../../interfaces/IProduct";
import Product from "../models/ProductModel"; // Modelo do Mongoose

export default class ProductService {
  async getAllProducts(): Promise<IProduct[]> {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error(`Erro ao listar os produtos: ${error}`);
    }
  }

  async filterProductsByCategory(category: string): Promise<IProduct[]> {
    try {
      return await Product.find({ categoria: category });
    } catch (error) {
      throw new Error(`Erro ao filtrar produtos pela categoria: ${error}`);
    }
  }

  async findProductById(id: string): Promise<IProduct | null> {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Erro ao encontrar o produto: ${error}`);
    }
  }

  async checkStock(id: string): Promise<boolean> {
    try {
      const product = await this.findProductById(id);
      return product ? product.quantidade > 0 : false;
    } catch (error) {
      throw new Error(`Erro ao verificar o estoque do produto: ${error}`);
    }
  }

  async saveProduct(productData: IProduct): Promise<IProduct | null> {
    try {
      if (productData._id) {
        return await Product.findByIdAndUpdate(productData._id, productData, {
          new: true
        });
      }
      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Erro ao salvar o produto: ${error}`);
    }
  }

  async removeProductById(id: string): Promise<boolean> {
    try {
      const product = await this.findProductById(id);
      if (!product) return false;
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao remover o produto: ${error}`);
    }
  }
}
