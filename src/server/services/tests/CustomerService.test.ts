import CustomerService from "../CustomerService";
import Customer from "../../models/CustomerModel";
import ICustomer from "../../../interfaces/ICustomer";

jest.mock("../../models/CustomerModel");
jest.mock("../../database/connectDB", () => jest.fn());

describe("CustomerService", () => {
  let service: CustomerService;

  const mockCustomer: ICustomer = {
    _id: "123",
    nome: "Cliente Teste",
    senha: "senha123",
    email: "cliente@teste.com",
    telefone: "123456789",
    CEP: "12345678"
  };

  beforeEach(() => {
    service = new CustomerService() as jest.Mocked<CustomerService>;
  });

  it("Should list all customers", async () => {
    const mockCustomers = [
      mockCustomer,
      { ...mockCustomer, _id: "456", nome: "Cliente Dois" }
    ];
    (Customer.find as jest.Mock).mockResolvedValue(mockCustomers);

    const result = await service.listAll();
    expect(result).toEqual(mockCustomers);
    expect(Customer.find).toHaveBeenCalled();
  });

  it("Should find a customer by name", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await service.findByName("cliente teste");
    expect(result).toEqual(mockCustomer);
    expect(Customer.findOne).toHaveBeenCalledWith({
      nome: { $regex: "cliente teste", $options: "i" }
    });
  });

  it("Should find a customer by ID", async () => {
    (Customer.findById as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await service.findById(mockCustomer._id);
    expect(result).toEqual(mockCustomer);
    expect(Customer.findById).toHaveBeenCalledWith(mockCustomer._id);
  });

  it("Should check if a customer exists by email", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await service.checkByEmail("cliente@teste.com");
    expect(result).toBe(true);
    expect(Customer.findOne).toHaveBeenCalledWith({
      email: "cliente@teste.com"
    });
  });

  it("Should return false if no customer is found by email", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    const result = await service.checkByEmail("naoexiste@teste.com");
    expect(result).toBe(false);
    expect(Customer.findOne).toHaveBeenCalledWith({
      email: "naoexiste@teste.com"
    });
  });

  it("Should create a new customer if _id is not provided", async () => {
    const newCustomerData = { ...mockCustomer, _id: "" };
    const savedCustomer = { ...mockCustomer, _id: "789" };
    (Customer.prototype.save as jest.Mock).mockResolvedValue(savedCustomer);

    const result = await service.save(newCustomerData as ICustomer);
    expect(result).toEqual(savedCustomer);
    expect(Customer.prototype.save).toHaveBeenCalled();
  });

  it("Should update an existing customer if _id is provided", async () => {
    (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await service.save(mockCustomer);
    expect(result).toEqual(mockCustomer);
    expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCustomer._id,
      mockCustomer,
      { new: true, upsert: true }
    );
  });

  it("Should remove a customer by ID", async () => {
    (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await service.remove(mockCustomer._id);
    expect(result).toBeUndefined();
    expect(Customer.findByIdAndDelete).toHaveBeenCalledWith(mockCustomer._id);
  });
});
