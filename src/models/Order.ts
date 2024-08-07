const { ServiceSchema } = require("./Service");

const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    mode: {
      required: true,
      type: String,
      enum: ["Momo", "Cash"],
    },
    amount: {
      required: true,
      type: Number,
    },
    proofUrl: {
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
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderSchema = mongoose.Schema(
  {
    items: [ServiceSchema],
    customer: { required: true, type: mongoose.Schema.Types.ObjectId },
    totalAmount: {
      type: Number,
      required: true,
    },
    processedBy: { required: true, type: mongoose.Schema.Types.ObjectId },
    recordedBy: { required: true, type: mongoose.Schema.Types.ObjectId },
    deliveredBy: { required: true, type: mongoose.Schema.Types.ObjectId },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Cancelled", "Overdue", "Complete"],
    },
    deliveryDate: {
      type: Date,
    },
    invoiceId: { type: String, required: true },
    invoiceUrl: { type: String, required: true },
    payments: [PaymentSchema],
    paymentStatus: {
      type: String,
      enum: ["Full", "Partial", "None"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
