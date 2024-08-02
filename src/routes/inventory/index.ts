const InventoryService = require("../../services/InventoryService");

const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req: any, res: any) => {
    const inventory = await InventoryService.getAll();

    return res.status(200).send(inventory);
  });

  router.get("/:id", async (req: any, res: any) => {
    const item = await InventoryService.getOne(req.params.id);

    return res.status(200).send(item);
  });

  router.post("/", async (req: any, res: any) => {
    const item = await InventoryService.create(req.body);

    return res.status(201).send(item);
  });

  router.delete("/:id", async (req: any, res: any) => {
    const deleted = await InventoryService.remove(req.params.id);

    return res.status(200).send(deleted);
  });

  router.put("/:id", async (req: any, res: any) => {
    const updated = await InventoryService.update(req.params.id, req.body);

    return res.status(200).send(updated);
  });
  return router;
};
