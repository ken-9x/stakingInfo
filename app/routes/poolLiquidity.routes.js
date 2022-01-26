const pool = require("../controllers/poolLiquidity.controller.js");
const router = require("express").Router();

module.exports = app => {
  router.get("/", pool.findAll);
  app.use('/api/pool', router);
};
