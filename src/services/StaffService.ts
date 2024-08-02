const StaffModel = require("../models/Staff");

class StaffService {
  static async getAll() {
    return StaffModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return StaffModel.findById(id).exec();
  }

  static async create(data: any) {
    const employee = new StaffModel(data);
    return employee.save();
  }

  static async update(id: string, data: any) {
    return StaffModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async remove(id: string) {
    return StaffModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = StaffService;
