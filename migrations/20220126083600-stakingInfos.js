'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('stakingInfos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },

      user_address: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      plq_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      score: {
        allowNull: true,
        type: Sequelize.DECIMAL(38, 12),
        defaultValue: 0
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
    return queryInterface.dropTable('stakingInfos');
  }
};
