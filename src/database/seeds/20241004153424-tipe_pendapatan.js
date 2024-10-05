'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tipe_pendapatans',[
      {
        id:1,
        uuid:'2c09ee81-0c75-4728-bbba-1b91fb0c571e',
        name:'PENDAPATAN',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'35547b22-82ae-497d-84a7-5a85cddc8210',
        name:'PENDAPATAN LAIN',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tipe_pendapatans');
  }
};
