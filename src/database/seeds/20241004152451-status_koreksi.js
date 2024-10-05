'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_koreksis',[
      {
        id:1,
        uuid:'c14616d1-a9c4-49ce-8255-855449372496',
        name:'PENGAJUAN',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'32a25a9c-1d3a-4337-9261-c681c0eb2f6c',
        name:'APPROVED',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'977cd684-e762-48cd-91bf-edd432d6522d',
        name:'NOT APPROVED',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_koreksis');
  }
};
