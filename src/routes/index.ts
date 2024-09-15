const express = require("express");
const passport = require("passport");
const customerRouter = require("./customers");
const serviceRouter = require("./services");
const orderRouter = require("./orders");
const inventoryRouter = require("./inventory");
const staffRouter = require("./staff");
const authRouter = require("./auth");

module.exports = (config: any) => {
  const router = express.Router();

  router.get("/", (req: any, res: any) => {
    return res.status(200).send("ping");
  });

  router.get(
    "/whoami",
    passport.authenticate("jwt", { session: false }),
    (req: any, res: any) => {
      return res.json({
        user: req.user,
      });
    }
  );

  router.use("/auth", authRouter(config));

  router.use(
    "/customers",
    passport.authenticate("jwt", { session: false }),
    customerRouter(config)
  );
  router.use(
    "/orders",
    passport.authenticate("jwt", { session: false }),
    orderRouter(config)
  );
  router.use(
    "/services",
    passport.authenticate("jwt", { session: false }),
    serviceRouter(config)
  );
  router.use(
    "/staff",
    passport.authenticate("jwt", { session: false }),
    staffRouter(config)
  );
  router.use(
    "/inventory",
    passport.authenticate("jwt", { session: false }),
    inventoryRouter(config)
  );

  return router;
};
