module.exports = app => {
  const stakingInfo = require("../controllers/stakingInfo.controller.js");

  let router = require("express").Router();
  
  router.get("/", stakingInfo.findAll);
  
  app.use('/api/stakingInfo', router);
};
