const ServiceService = require("../../services/ServiceService");
const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req: any, res: any) => {
    const services = await ServiceService.getAll();

    return res.status(200).send(services);
  });

  router.get("/:id", async (req: any, res: any) => {
    const item = await ServiceService.getOne(req.params.id);

    return res.status(200).send(item);
  });

  router.post("/", async (req: any, res: any) => {
    const item = await ServiceService.create(req.body);

    return res.status(201).send(item);
  });

  router.delete("/:id", async (req: any, res: any) => {
    const deleted = await ServiceService.remove(req.params.id);

    return res.status(200).send(deleted);
  });

  router.put("/:id", async (req: any, res: any) => {
    const updated = await ServiceService.update(req.params.id, req.body);

    return res.status(200).send(updated);
  });
  return router;
};
