const CustomerService = require("../../services/CustomerService");

const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req: any, res: any) => {
    const customers = await CustomerService.getAll();

    return res.status(200).send(customers);
  });

  router.get("/:id", async (req: any, res: any) => {
    const customer = await CustomerService.getOne(req.params.id);

    return res.status(200).send(customer);
  });

  router.post("/", async (req: any, res: any) => {
    const customer = await CustomerService.create(req.body);

    return res.status(201).send(customer);
  });

  router.delete("/:id", async (req: any, res: any) => {
    const deleted = await CustomerService.remove(req.params.id);

    return res.status(200).send(deleted);
  });

  router.put("/:id", async (req: any, res: any) => {
    const updated = await CustomerService.update(req.params.id, req.body);

    return res.status(200).send(updated);
  });

  return router;
};
