'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('pelanggarans',[
      {
        id:1,
        uuid:'2b349996-66ea-48bf-9dfe-b547e0062278',
        name:'NORMAL',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'a2ce8601-e012-4390-ab9b-cd617cda4c18',
        name:'MELANGGAR',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('pelanggarans');
  }
};
