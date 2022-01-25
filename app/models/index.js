const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stakingInfo = require("./stakingInfo.model.js")(sequelize, Sequelize);

module.exports = db;
