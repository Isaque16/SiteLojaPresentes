import connectToDatabase from "../database/connectDB";
import IProduct from "../interfaces/IProduct";
import Product from "../models/ProductModel"; // Modelo do Mongoose

export default class ProductService {

  constructor() {
    connectToDatabase();
  }

  // Lista todos os produtos do banco de dados
  async listAll(): Promise<IProduct[]> {
    return await Product.find();
  }

  // Filtra produtos por categoria
  async findByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ categoria: category });
  }

  // Encontra um produto por ID
  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  // Verifica se um produto está em estoque
  async checkStock(id: string): Promise<boolean> {
    const product = await this.findById(id);
    return product ? product.quantidade > 0 : false;
  }

  // Atualiza um produto existente pelo ID ou cria um novo
  async save(productData: IProduct | Partial<IProduct>, id?: string) {
    if (id)
      return await Product.findByIdAndUpdate(id, productData, {
        new: true,
        upsert: true,
      });
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  // Remove um produto pelo ID
  async remove(id: string): Promise<void> {
    await Product.findByIdAndDelete(id);
  }
}
