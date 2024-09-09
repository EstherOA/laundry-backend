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
    paymentMode: { type: String, enum: ["Momo", "Cash"], required: true },
    paymentReceipt: { type: String, required: true },
    status: {
      type: String,
      enum: ["InStock", "LowStock", "OutOfStock"],
      default: "InStock",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", InventorySchema, "inventory");
