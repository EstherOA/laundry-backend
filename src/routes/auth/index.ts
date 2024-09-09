const CustomerService = require("../../services/CustomerService");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");

module.exports = (config: any) => {
  const router = express.Router();

  router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    async (req: any, res: any) => {
      try {
        const token = jwt.sign(
          {
            userId: req.user.id,
          },
          config.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
          token,
        });
      } catch (err: any) {
        console.error("error authenticating user:", err);
        return res.status(400).json({
          token: null,
        });
      }
    }
  );

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

  return router;
};
