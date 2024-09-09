const StaffService = require("../../services/StaffService");

const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req: any, res: any) => {
    const staff = await StaffService.getAll();

    return res.status(200).send(staff);
  });

  router.get("/:id", async (req: any, res: any) => {
    const employee = await StaffService.getOne(req.params.id);

    return res.status(200).send(employee);
  });

  router.post("/", async (req: any, res: any) => {
    const employee = await StaffService.create({
      ...req.body,
      dateCommenced: new Date(),
    });

    return res.status(201).send(employee);
  });

  router.delete("/:id", async (req: any, res: any) => {
    const deleted = await StaffService.remove(req.params.id);

    return res.status(200).send(deleted);
  });

  router.put("/:id", async (req: any, res: any) => {
    const updated = await StaffService.update(req.params.id, req.body);

    return res.status(200).send(updated);
  });
  return router;

  //TODO: sanitize and validate and request data
};
