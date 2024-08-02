const mongoose = require("mongoose");

const StaffSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      index: { unique: true },
      trim: true,
    },
    role: { type: String, required: true },
    ssnit: { type: String, required: true },
    tin: { type: String, required: true },
    dateCommenced: { type: String, required: true },
    salary: { type: Number, required: true },
    shift: { type: String, required: true },
    contract: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", StaffSchema, "staff");
