const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: { type: String, required: true },
    landmark: { type: String },
    deliveryNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
