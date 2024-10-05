'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('statuses',[
      {
        id:1,
        uuid:'918c583f-f1b9-4974-8075-e91453d9cbcd',
        name:'NEW',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'1219e2f7-dfef-4971-a773-c2bebe8b0688',
        name:'ACTIVE',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'6d01a1d6-aa39-494c-a808-1b0d5d178ea6',
        name:'NON ACTIVE',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('statuses');
  }
};
