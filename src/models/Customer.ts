const mongoose = require("mongoose");

// Function to get next customer ID
async function getNextCustomerId() {
  const Customer = mongoose.model("Customer");
  const lastCustomer = await Customer.findOne().sort({ customerId: -1 });

  if (!lastCustomer) {
    return "00001";
  }

  const lastId = parseInt(lastCustomer.customerId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },
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

// Pre-save hook to auto-generate customerId
CustomerSchema.pre("save", async function (this: any, next: any) {
  if (!this.customerId) {
    try {
      this.customerId = await getNextCustomerId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
