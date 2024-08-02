const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

const CustomerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: { type: String, required: true },
    landmark: { type: String, required: true },
    deliveryNotes: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

async function generateHash(password) {
 
    // Generate a salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // Hash the password using the generated salt
    return await bcrypt.hash(password, salt);
  }

CustomerSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await generateHash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

CustomerSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Customer", CustomerSchema);
