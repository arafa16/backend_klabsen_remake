'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ganders',[
      {
        id:1,
        uuid:'bd959bd0-c54f-4345-9712-6589140413c8',
        name:'LAKI-LAKI',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'5dae8cc0-e045-4b40-bfae-2c860dd03841',
        name:'PEREMPUAN',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ganders');
  }
};
