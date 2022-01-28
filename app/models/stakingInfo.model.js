module.exports = (sequelize, Sequelize) => {
  const stakingInfo = sequelize.define("stakingInfos", {
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
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  });
  stakingInfo.associate = function(models) {
    stakingInfo.belongsTo(models.pool_liquidities,{
      foreignKey: 'plq_id',
      targetKey: 'pid',
    })
  };
  return stakingInfo;
};
