const stakingInfo = require("../controllers/stakingInfo.controller.js");
const router = require("express").Router();

module.exports = app => {
  router.get("/", stakingInfo.findAll);
  app.use('/api/stakingInfo', router);
};
