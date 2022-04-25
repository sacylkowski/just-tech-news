// serve to collect all of the API routes and package them for us

const router = require("express").Router();
const userRoutes = require("./user-routes.js");

router.use("/users", userRoutes);




module.exports = router;