const mongoose = require("mongoose");

const InventorySchema = mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    purchasedBy: { type: String, required: true },
    vendor: { type: String, required: true },
    datePurchased: { type: Date, required: true },
    paymentMode: { type: String, enum: ["momo", "cash"], required: true },
    paymentReceipt: { type: String },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", InventorySchema, "inventory");
