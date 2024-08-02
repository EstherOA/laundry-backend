const express = require("express");
const customerRouter = require("./customers");
const serviceRouter = require("./services");
const orderRouter = require("./orders");
const inventoryRouter = require("./inventory");
const staffRouter = require("./staff");

module.exports = (config: any) => {
  const router = express.Router();

  router.get("/", (req: any, res: any) => {
    return res.status(200).send("ping");
  });

  router.use("/customers", customerRouter(config));
  router.use("/orderes", orderRouter(config));
  router.use("/services", serviceRouter(config));
  router.use("/staff", staffRouter(config));
  router.use("/inventory", inventoryRouter(config));

  return router;
};
