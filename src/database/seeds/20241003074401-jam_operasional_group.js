'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jam_operasional_groups',[
      {
        id:1,
        uuid:'5dceeb99-80a9-4c86-b4ae-d851a15c3617',
        name:'STAFF',
        keterangan:'GROUP STAFF',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'d73da4e0-dc99-4ff4-b35d-781d552aaedf',
        name:'TEKNISI',
        keterangan:'GROUP TEKNISI',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'19d25034-ca24-4ba1-8533-f7d7e6904797',
        name:'SHIFT',
        keterangan:'GROUP SHIFT',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jam_operasional_groups');
  }
};
