import connectToDatabase from "../database/connectDB";
import IProduct from "../interfaces/IProduct";
import Product from "../models/ProductModel"; // Modelo do Mongoose

export default class ProductService {
  // Lista todos os produtos do banco de dados
  async listAll(): Promise<IProduct[]> {
    await connectToDatabase();
    return await Product.find();
  }

  // Filtra produtos por categoria
  async findByCategory(category: string): Promise<IProduct[]> {
    await connectToDatabase();
    return await Product.find({ categoria: category });
  }

  // Encontra um produto por ID
  async findById(id: string): Promise<IProduct | null> {
    await connectToDatabase();
    return await Product.findById(id);
  }

  // Verifica se um produto está em estoque
  async checkStock(id: string): Promise<boolean> {
    await connectToDatabase();
    const product = await this.findById(id);
    return product ? product.quantidade > 0 : false;
  }

  // Atualiza um produto existente pelo ID ou cria um novo
  async save(productData: IProduct | Partial<IProduct>, id?: string) {
    await connectToDatabase();
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
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
  }
}
