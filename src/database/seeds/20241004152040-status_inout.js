'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_inouts',[
      {
        id:1,
        uuid:'fc928624-81b4-47c3-bbbc-e001ad9d116b',
        name:'NORMAL',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'31517be9-a3fc-457f-a204-2b6582ad3d7d',
        name:'PENGAJUAN',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'a5389bf4-6261-4ba3-8f21-1d3850569445',
        name:'DITOLAK',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'fe5cb26b-c2da-4510-b42a-8dbc28d72883',
        name:'DISETUJUI',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_inouts');
  }
};
