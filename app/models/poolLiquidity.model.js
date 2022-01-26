module.exports = (sequelize, Sequelize) => {
  return sequelize.define("pool_liquidities", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    pid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lp_token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
