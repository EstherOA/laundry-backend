const CustomerModel = require("../models/Customer");

class CustomerService {
  static async getAll() {
    return CustomerModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return CustomerModel.findById(id).exec();
  }

  static async create(data: any) {
    const customer = new CustomerModel(data);
    return customer.save();
  }

  static async update(id: string, data: any) {
    return CustomerModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async remove(id: string) {
    return CustomerModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = CustomerService;
