const mongoose = require("mongoose");
const crypto = require("crypto");

// Define constants for crypto
const SALT_LENGTH = 16; // Length of the salt in bytes
const ITERATIONS = 10000; // Number of iterations for PBKDF2
const KEY_LENGTH = 64; // Length of the derived key (password hash) in bytes
const DIGEST = "sha512"; // Hash function to use

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
    dateCommenced: { type: Date, required: true },
    salary: { type: Number, required: true },
    shift: { type: String, required: true },
    contract: { type: String },
  },
  {
    timestamps: true,
  }
);

async function generateHash(password) {
  // Generate a salt
  const salt = await crypto.randomBytes(SALT_LENGTH).toString("hex");
  // Hash the password using the generated salt
  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
  return `${salt}:${hash}`;}

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
  const [salt, storedHash] = this.password.split(":"); // Split the stored password into salt and hash

  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(candidatePassword, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
  return storedHash === hash; // Compare the stored hash with the newly generated hash
};

module.exports = mongoose.model("Staff", StaffSchema, "staff");
