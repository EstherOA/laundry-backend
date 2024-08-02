const InventoryModel = require("../models/Inventory");

class InventoryService {
  static async getAll() {
    return InventoryModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return InventoryModel.findById(id).exec();
  }

  static async create(data: any) {
    const item = new InventoryModel(data);
    return item.save();
  }

  static async update(id: string, data: any) {
    return InventoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async remove(id: string) {
    return InventoryModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = InventoryService;
