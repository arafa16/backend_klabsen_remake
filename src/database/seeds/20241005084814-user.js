'use strict';
const argon = require('argon2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users',[
      {
        id:1,
        uuid:'1c09ee81-0c75-4728-bbba-1b91fb0c571e',
        absen_id: '1',
        nik: '1',
        name: 'admin',
        email: 'admin@gmail.com',
        password: await argon.hash('admin'),
        jam_operasional_group_id:1,
        privilege_id: 1,
        status_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users');
  }
};
