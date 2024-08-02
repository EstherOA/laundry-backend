const OrderService = require("../../services/OrderService");

const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req: any, res: any) => {
    const orders = await OrderService.getAll();

    return res.status(200).send(orders);
  });

  router.get("/:id", async (req: any, res: any) => {
    const order = await OrderService.getOne(req.params.id);

    return res.status(200).send(order);
  });

  router.post("/", async (req: any, res: any) => {
    const order = await OrderService.create(req.body);

    return res.status(201).send(order);
  });

  router.delete("/:id", async (req: any, res: any) => {
    const deleted = await OrderService.remove(req.params.id);

    return res.status(200).send(deleted);
  });

  router.put("/:id", async (req: any, res: any) => {
    const updated = await OrderService.update(req.params.id, req.body);

    return res.status(200).send(updated);
  });
  return router;
};
