module.exports = (sequelize, Sequelize) => {
  const poolLiquidity = sequelize.define("pool_liquidities", {
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
  }, {
        tableName: 'pool_liquidities',
      });
  poolLiquidity.associate = function(models) {
    poolLiquidity.hasMany(models.stakingInfos,{
      sourceKey: 'pid',
      foreignKey: 'plq_id',
    })
  };
  return poolLiquidity;
};
