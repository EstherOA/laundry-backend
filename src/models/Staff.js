const mongoose = require("mongoose");
const crypto = require("crypto");

// Define constants for crypto
const SALT_LENGTH = 16; // Length of the salt in bytes
const ITERATIONS = 10000; // Number of iterations for PBKDF2
const KEY_LENGTH = 64; // Length of the derived key (password hash) in bytes
const DIGEST = "sha512"; // Hash function to use

const StaffSchema = mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      index: { unique: true },
      trim: true,
    },
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true },
    ssnit: { type: String, required: true },
    idNumber: { type: String, required: true },
    tin: { type: String, required: true },
    dateCommenced: { type: Date, required: true },
    salary: { type: Number, required: true },
    shift: { type: String, required: true },
    contract: { type: String },
    hasDefaultPassword: { type: Boolean, default: true },
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
    crypto.pbkdf2(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
  return `${salt}:${hash}`;
}

// Function to get next staff ID
async function getNextStaffId() {
  const Staff = mongoose.model("Staff");
  const lastStaff = await Staff.findOne().sort({ staffId: -1 });

  if (!lastStaff) {
    return "00001";
  }

  const lastId = parseInt(lastStaff.staffId, 10);
  const nextId = lastId + 1;
  return nextId.toString().padStart(5, "0");
}

StaffSchema.pre("save", async function (next) {
  // Auto-generate staffId if not provided
  if (!this.staffId) {
    try {
      this.staffId = await getNextStaffId();
    } catch (err) {
      return next(err);
    }
  }

  // Only hash the password if it is not default
  console.log("has default password:", this.hasDefaultPassword);

  if (this.hasDefaultPassword) {
    console.log("has default password");

    return next();
  }
  try {
    console.log("hashing password");

    this.password = await generateHash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

// Helper function to hash password in update queries
async function hashPasswordInUpdate(next) {
  const update = this.getUpdate();
  if (!update) return next();

  // Only hash if password is being updated and hasDefaultPassword is not true
  if (update.password && !update.hasDefaultPassword) {
    try {
      update.password = await generateHash(update.password);
    } catch (err) {
      return next(err);
    }
  }
  next();
}

StaffSchema.pre("update", hashPasswordInUpdate);
StaffSchema.pre("updateOne", hashPasswordInUpdate);
StaffSchema.pre("updateMany", hashPasswordInUpdate);
StaffSchema.pre("findOneAndUpdate", hashPasswordInUpdate);

StaffSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  // If user has default password, compare directly
  if (this.hasDefaultPassword) {
    return this.password === candidatePassword;
  }

  // For hashed passwords, use the existing logic
  const [salt, storedHash] = this.password.split(":"); // Split the stored password into salt and hash

  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(
      candidatePassword,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
  return storedHash === hash; // Compare the stored hash with the newly generated hash
};

// Method to change password and update hasDefaultPassword flag
StaffSchema.methods.changePassword = async function changePassword(
  newPassword
) {
  this.password = newPassword;
  this.hasDefaultPassword = false;
  return this.save();
};

module.exports = mongoose.model("Staff", StaffSchema, "staff");
