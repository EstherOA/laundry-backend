const OrderModel = require("../models/Order");

class OrderService {
  static async getAll() {
    return OrderModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return OrderModel.findById(id).exec();
  }

  static async create(data: any) {
    const order = new OrderModel(data);
    return order.save();
  }

  static async update(id: string, data: any) {
    return OrderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async remove(id: string) {
    return OrderModel.deleteOne({ _id: id }).exec();
  }

  static async addPayment(id: string, data: any) {
    const order = OrderModel.findById(id).exec();

    if (order) {
      order.payments.push(data);
    }
    return order.save();
  }

  static async getStats() {
    return;
  }
}

module.exports = OrderService;
