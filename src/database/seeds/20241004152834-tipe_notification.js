'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tipe_notifications',[
      {
        id:1,
        uuid:'fae4d4a8-c894-4f90-a1a6-64cb2ef3f3bc',
        name:'POP UP',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'efec825f-cabd-4f17-97d6-ad0f55534b5e',
        name:'SHOW',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tipe_notifications');
  }
};
