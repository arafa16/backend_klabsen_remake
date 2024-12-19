'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('contact_emergencies',[
      {
        id:1,
        uuid:'759c56a5-331e-4226-8223-45193cab3f2d',
        name:'IBU KANDUNG',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'8efaa3bc-9837-46c4-b53a-fea511d1846c',
        name:'AYAH KANDUNG',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'f4d7d0df-580c-457c-8d4d-153e86d9afa0',
        name:'SAUDARA KANDUNG',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'26d802b4-3bd2-4adf-8c31-ee333ec7aa87',
        name:'SUAMI',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:7,
        uuid:'d16be39f-9e3e-4af5-8abd-34e6fc0fa46d',
        name:'ISTRI',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('contact_emergencies');
  }
};
