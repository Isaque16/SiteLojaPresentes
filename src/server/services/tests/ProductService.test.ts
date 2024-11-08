import IProduct from "@/interfaces/IProduct";
import Product from "../../models/ProductModel";
import ProductService from "../ProductService";

jest.mock("../../models/ProductModel");
jest.mock("../../database/connectDB", () => jest.fn());

describe("ProductService", () => {
  let service: ProductService;

  const mockProduct: IProduct = {
    _id: "123",
    nome: "Produto Atualizado",
    categoria: "Eletrônicos",
    preco: 100,
    quantidade: 10,
    descricao: "Descrição do produto",
    imagem: "imagem.png",
    nomeImagem: "nomeImagem.png"
  };

  beforeEach(() => {
    service = new ProductService();
  });

  it("Should list all products", async () => {
    const mockProducts = [
      mockProduct,
      { ...mockProduct, _id: "456", nome: "Produto 2" }
    ];
    (Product.find as jest.Mock).mockResolvedValue(mockProducts);

    const result = await service.listAll();
    expect(result).toEqual(mockProducts);
    expect(Product.find).toHaveBeenCalled();
  });

  it("Should find products by category", async () => {
    const mockCategory = "Eletrônicos";
    const mockProducts = [mockProduct];
    (Product.find as jest.Mock).mockResolvedValue(mockProducts);

    const result = await service.listByCategory(mockCategory);
    expect(result).toEqual(mockProducts);
    expect(Product.find).toHaveBeenCalledWith({ categoria: mockCategory });
  });

  it("Should find product by id", async () => {
    (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

    const result = await service.findById(mockProduct._id);
    expect(result).toEqual(mockProduct);
    expect(Product.findById).toHaveBeenCalledWith(mockProduct._id);
  });

  it("Should create a new product", async () => {
    const newProduct = { ...mockProduct, _id: "" };
    const savedProduct = { ...mockProduct, _id: "123" };
    (Product.prototype.save as jest.Mock).mockResolvedValue(savedProduct);

    const result = await service.save(newProduct);
    expect(result).toEqual(savedProduct);
    expect(Product.prototype.save).toHaveBeenCalled();
  });

  it("Should update a product", async () => {
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);

    const result = await service.save(mockProduct);
    expect(result).toEqual(mockProduct);
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      mockProduct._id,
      mockProduct,
      { new: true, upsert: true }
    );
  });

  it("Should remove a product", async () => {
    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);

    const result = await service.remove(mockProduct._id);
    expect(result).toEqual(mockProduct);
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith(mockProduct._id);
  });
});
