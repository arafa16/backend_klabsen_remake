'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('golongan_darahs',[
      {
        id:1,
        uuid:'0eeba409-ffbb-41f8-ac32-49a4dd50df1c',
        name:'A',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'eae83d40-5b79-43f6-a6e0-c30fbe12c655',
        name:'B',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'460012a3-2d3a-4f6d-9f47-44c06949c9af',
        name:'0',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'48d1d398-6084-4445-8b5c-7052cf550ead',
        name:'AB',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'3674ba96-841c-430f-9289-3b98564693ef',
        name:'UNIDENTIFIED',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('golongan_darahs');
  }
};
