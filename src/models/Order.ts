const { ServiceSchema } = require("./Service");

const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
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

module.exports = mongoose.model("Order", OrderSchema);
