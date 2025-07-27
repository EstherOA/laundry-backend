const { ServiceSchema } = require("./Service");

const mongoose = require("mongoose");

// Function to get next order ID
async function getNextOrderId() {
  const Order = mongoose.model("Order");
  const lastOrder = await Order.findOne().sort({ orderId: -1 });

  if (!lastOrder) {
    return "00001";
  }

  const lastId = parseInt(lastOrder.orderId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

// Function to get next payment ID
async function getNextPaymentId() {
  const Order = mongoose.model("Order");
  const lastOrder = await Order.findOne({
    "payments.paymentId": { $exists: true },
  }).sort({ "payments.paymentId": -1 });

  if (!lastOrder || !lastOrder.payments || lastOrder.payments.length === 0) {
    return "00001";
  }

  // Find the highest payment ID across all orders
  const allPayments = await Order.aggregate([
    { $unwind: "$payments" },
    { $sort: { "payments.paymentId": -1 } },
    { $limit: 1 },
  ]);

  if (allPayments.length === 0) {
    return "00001";
  }

  const lastId = parseInt(allPayments[0].payments.paymentId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

const PaymentSchema = mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
    },
    mode: {
      required: true,
      type: String,
      enum: ["momo", "cash"],
    },
    amount: {
      required: true,
      type: Number,
    },
    receipt: {
      type: String,
    },
    sender: {
      required: true,
      type: String,
    },
    senderPhoneNumber: {
      type: String,
    },
    processedBy: {
      name: { required: true, type: String },
      staffId: { required: true, type: String },
    },
  },
  {
    timestamps: true,
  }
);

const OrderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    items: [ServiceSchema],
    customer: {
      firstName: { required: true, type: String },
      customerId: { type: String },
      lastName: { required: true, type: String },
      phoneNumber: { required: true, type: String },
      address: { required: true, type: String },
      deliveryNotes: { type: String },
      landmark: { required: true, type: String },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    processedBy: {
      name: { required: true, type: String },
      staffId: { required: true, type: String },
    },
    recordedBy: {
      name: { required: true, type: String },
      staffId: { required: true, type: String },
    },
    deliveredBy: {
      name: { type: String },
      staffId: { type: String },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "cancelled", "overdue", "complete", "almost-due"],
    },
    deliveryDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    invoiceId: { type: String, required: true, index: { unique: true } },
    payments: [PaymentSchema],
    paymentStatus: {
      type: String,
      enum: ["full", "partial", "none"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for PaymentSchema
PaymentSchema.pre("save", async function (this: any, next: any) {
  if (!this.paymentId) {
    try {
      this.paymentId = await getNextPaymentId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Pre-save hook for OrderSchema
OrderSchema.pre("save", async function (this: any, next: any) {
  if (!this.orderId) {
    try {
      this.orderId = await getNextOrderId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
