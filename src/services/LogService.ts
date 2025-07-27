const LogModel = require("../models/Log");

class LogService {
  static async create(logType: string, logMessage: string, staffId: string) {
    const log = new LogModel({ logType, logMessage, staffId });
    return log.save();
  }

  static async getAll() {
    return LogModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(id: string) {
    return LogModel.findById(id).exec();
  }

  static async update(
    id: string,
    logType: string,
    logMessage: string,
    staffId: string
  ) {
    return LogModel.findByIdAndUpdate(
      id,
      { logType, logMessage, staffId },
      { new: true }
    ).exec();
  }

  static async remove(id: string) {
    return LogModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = LogService;
