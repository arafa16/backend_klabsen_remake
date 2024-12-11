'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tipe_events',[
      {
        id:1,
        uuid:'710215c2-be75-4a36-bd2d-1de1def0143e',
        name:'HARI LIBUR NASIONAL',
        code:1,
        color:'red',
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'169018fc-e915-445b-bd62-b1a0d654113d',
        name:'CUTI BERSAMA PERUSAHAAAN',
        code:2,
        color:'red',
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'6a7da906-c91b-4706-8152-4ac95697867a',
        name:'CUTI BERSAMA',
        code:3,
        color:'red',
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tipe_events');
  }
};
