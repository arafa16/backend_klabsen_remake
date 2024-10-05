'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_emails',[
      {
        id:1,
        uuid:'1c09ee81-0c75-4728-bbba-1b91fb0c571e',
        name:'draft',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'25547b22-82ae-497d-84a7-5a85cddc8210',
        name:'send',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'25547b22-82ae-497d-84a7-5a85cddc8210',
        name:'success',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_emails');
  }
};
