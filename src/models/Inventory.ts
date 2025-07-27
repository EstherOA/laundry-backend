const mongoose = require("mongoose");

// Function to get next item ID
async function getNextItemId() {
  const Inventory = mongoose.model("Inventory");
  const lastItem = await Inventory.findOne().sort({ itemId: -1 });

  if (!lastItem) {
    return "00001";
  }

  const lastId = parseInt(lastItem.itemId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

const InventorySchema = mongoose.Schema(
  {
    itemId: {
      type: String,
      unique: true,
    },
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    purchasedBy: {
      name: { required: true, type: String },
      staffId: { required: true, type: String },
    },
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

// Pre-save hook to auto-generate itemId
InventorySchema.pre("save", async function (this: any, next: any) {
  if (!this.itemId) {
    try {
      this.itemId = await getNextItemId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Inventory", InventorySchema, "inventory");
