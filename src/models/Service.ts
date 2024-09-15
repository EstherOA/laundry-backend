const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    itemName: { type: String, required: true },
    serviceType: { type: String, enum: ["washing", "dry-cleaning", "ironing"] },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, min: 1, default: 1 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", ServiceSchema);
module.exports.ServiceSchema = ServiceSchema;
