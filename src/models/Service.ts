const mongoose = require("mongoose");

// Function to get next service ID
async function getNextServiceId() {
  const Service = mongoose.model("Service");
  const lastService = await Service.findOne().sort({ serviceId: -1 });

  if (!lastService) {
    return "00001";
  }

  const lastId = parseInt(lastService.serviceId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

const ServiceSchema = mongoose.Schema(
  {
    serviceId: {
      type: String,
    },
    itemName: { type: String, required: true },
    serviceType: { type: String, enum: ["washing", "dry-cleaning", "ironing"] },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, min: 1, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate serviceId
ServiceSchema.pre("save", async function (this: any, next: any) {
  if (!this.serviceId) {
    try {
      this.serviceId = await getNextServiceId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Service", ServiceSchema);
module.exports.ServiceSchema = ServiceSchema;
