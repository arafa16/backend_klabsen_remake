'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_perkawinans',[
      {
        id:1,
        uuid:'144f8afa-7c2a-44de-9709-4e89ce725cae',
        name:'MENIKAH',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'19cef11f-bcba-4046-9436-ec16ad272f1d',
        name:'BELUM MENIKAH',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'2beb27a6-548c-493d-95df-395fb7f711cb',
        name:'DUDA/JANDA',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_perkawinans');
  }
};
