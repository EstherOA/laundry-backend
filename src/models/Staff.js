const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

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
    password: { type: String, required: true },
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

async function generateHash(password) {
  // Generate a salt
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  // Hash the password using the generated salt
  return await bcrypt.hash(password, salt);
}

StaffSchema.pre("save", async function (next) {
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

StaffSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Staff", StaffSchema, "staff");
