'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('banks',[
      {
        id:1,
        uuid:'2b456b16-d818-435d-a08b-ec4cbf1f0326',
        name:'MANDIRI',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'beb85ce6-37d8-428f-a895-e89cf9ebb889',
        name:'BCA',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'3466ac72-2bf1-4dff-b598-9f2dfd5f41dc',
        name:'BRI',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'8a798190-9e05-4f4e-8ca2-7562a98ace52',
        name:'BANK SYARIAH INDONESIA',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'dd2d24bc-cc7c-4e66-959b-ea1cb1df9e24',
        name:'BANK SYARIAH MANDIRI',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'a1cd44c5-2e10-44df-b0cc-19643bb53669',
        name:'PT BANK SYARIAH INDONESIA',
        code:6,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('banks');
  }
};
