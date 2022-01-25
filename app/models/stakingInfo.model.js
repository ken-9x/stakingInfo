module.exports = (sequelize, Sequelize) => {
  return sequelize.define("stakingInfos", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    user_address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    plq_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    score: {
      type: Sequelize.FLOAT,
      allowNull: true,
    }
  });
};
