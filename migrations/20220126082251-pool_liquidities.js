'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('pool_liquidities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },

      pid: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      lp_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('pool_liquidities');
  }
};
