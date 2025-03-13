'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('overtime_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      overtime_task_id: {
        type: Sequelize.INTEGER
      },
      assignor_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING
      },
      time_start: {
        type: Sequelize.DATE
      },
      time_finised: {
        type: Sequelize.DATE
      },
      note: {
        type: Sequelize.TEXT
      },
      superior_id: {
        type: Sequelize.INTEGER
      },
      overtime_task_status_id: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('overtime_reports');
  }
};