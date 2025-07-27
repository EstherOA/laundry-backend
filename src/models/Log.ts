const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["access", "create", "update", "delete"],
      required: true,
    },
    resourceId: { type: String },
    message: { type: String, required: true },
    staffId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", LogSchema, "logs");

export default Log;
