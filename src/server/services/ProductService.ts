"use server";
import IProduct from "../../interfaces/IProduct";
import Product from "../models/ProductModel"; // Modelo do Mongoose

export async function getAllProducts(): Promise<IProduct[]> {
  try {
    const products: IProduct[] = await Product.find();
    return products;
  } catch (error) {
    throw new Error(`Erro ao listar os produtos: ${error}`);
  }
}

export async function filterProductsByCategory(
  category: string
): Promise<IProduct[]> {
  try {
    const filteredProducts: IProduct[] = await Product.find({
      categoria: category
    });
    return filteredProducts;
  } catch (error) {
    throw new Error(`Erro ao filtrar produtos pela categoria: ${error}`);
  }
}

export async function findProductById(id: string): Promise<IProduct | null> {
  try {
    const foundProduct: IProduct | null = await Product.findById(id);
    return foundProduct;
  } catch (error) {
    throw new Error(`Erro ao encontrar o produto: ${error}`);
  }
}

export async function checkStock(id: string): Promise<boolean> {
  try {
    const foundProduct: IProduct | null = await Product.findById(id);
    return foundProduct ? foundProduct.quantidade > 0 : false;
  } catch (error) {
    throw new Error(`Erro ao verificar o estoque do produto: ${error}`);
  }
}

export async function saveProduct(
  productData: IProduct
): Promise<IProduct | null> {
  let savedProduct: IProduct | null = null;
  try {
    if (productData._id) {
      savedProduct = await Product.findByIdAndUpdate(
        productData._id,
        productData,
        {
          new: true
        }
      );
    } else savedProduct = await Product.create(productData);
    return savedProduct;
  } catch (error) {
    throw new Error(`Erro ao salvar o produto: ${error}`);
  }
}

export async function removeProductById(id: string): Promise<boolean> {
  try {
    const removedProduct: IProduct | null = await Product.findByIdAndDelete(id);
    return removedProduct !== null;
  } catch (error) {
    throw new Error(`Erro ao remover o produto: ${error}`);
  }
}
