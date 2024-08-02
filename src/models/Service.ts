const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema(
  {
    itemName: { type: String, required: true },
    serviceType: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, min: 1, default: 1 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", ServiceSchema);
module.exports.ServiceSchema = ServiceSchema;
