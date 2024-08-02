const CustomerService = require("../../services/CustomerService");

const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.post("/login", async (req: any, res: any) => {
    const { phoneNumber, password } = req.body;
    const inventory = await CustomerService.getAll();

    return res.status(200).send(inventory);
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

  return router;
};
