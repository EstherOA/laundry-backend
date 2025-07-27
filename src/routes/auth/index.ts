const CustomerService = require("../../services/CustomerService");
const StaffService = require("../../services/StaffService");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");

module.exports = (config: any) => {
  const router = express.Router();

  router.post("/login", async (req: any, res: any) => {
    try {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res.status(400).json({
          error: "Phone number and password are required",
        });
      }

      // First check if user exists in staff table
      const staff = await StaffService.findByPhoneNumber(phoneNumber);

      if (!staff) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const isAuthenticated = await staff.comparePassword(password);

      if (!isAuthenticated) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: staff._id,
          staffId: staff.staffId,
          role: staff.role,
          phoneNumber: staff.phoneNumber,
        },
        config.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        token,
        user: {
          staffId: staff.staffId,
          firstName: staff.firstName,
          lastName: staff.lastName,
          role: staff.role,
          hasDefaultPassword: staff.hasDefaultPassword,
        },
      });
    } catch (err: any) {
      console.error("error authenticating user:", err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  router.get("/logout", async (req: any, res: any) => {
    const item = await CustomerService.getOne(req.params.id);

    return res.status(200).send(item);
  });

  router.post("/request-otp", async (req: any, res: any) => {
    const item = await CustomerService.getOne(req.params.id);

    return res.status(200).send(item);
  });

  router.post("/reset-password", async (req: any, res: any) => {
    const item = await CustomerService.getOne(req.params.id);

    return res.status(200).json({ item });
  });

  router.post("/change-password", async (req: any, res: any) => {
    try {
      const { phoneNumber, currentPassword, newPassword } = req.body;

      if (!phoneNumber || !currentPassword || !newPassword) {
        return res.status(400).json({
          error:
            "Phone number, current password, and new password are required",
        });
      }

      // Find the staff member
      const staff = await StaffService.findByPhoneNumber(phoneNumber);

      if (!staff) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await staff.comparePassword(
        currentPassword
      );

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          error: "Current password is incorrect",
        });
      }

      // Change password and update hasDefaultPassword flag
      await staff.changePassword(newPassword);

      return res.status(200).json({
        message: "Password changed successfully",
        hasDefaultPassword: false,
      });
    } catch (err: any) {
      console.error("error changing password:", err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  return router;
};
