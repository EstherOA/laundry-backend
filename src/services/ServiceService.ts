const ServiceModel = require("../models/Service");

class ServiceService {
  static async getAll() {
    return ServiceModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return ServiceModel.findById(id).exec();
  }

  static async create(data: any) {
    const service = new ServiceModel(data);
    return service.save();
  }

  static async update(id: string, data: any) {
    return ServiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async remove(id: string) {
    return ServiceModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = ServiceService;
