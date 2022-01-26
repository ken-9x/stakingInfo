const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const db = {};
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database, config.username, config.password, {...config, logging: false})

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stakingInfo = require("./stakingInfo.model.js")(sequelize, Sequelize);
db.pool = require("./poolLiquidity.model.js")(sequelize, Sequelize);
const models = sequelize.models;
Object.keys(models).forEach(name => {
    if ('associate' in models[name]) {
        models[name].associate(models);
    }
});
module.exports = db;
