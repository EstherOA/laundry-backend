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
    landmark: { type: String, required: true },
    deliveryNotes: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
