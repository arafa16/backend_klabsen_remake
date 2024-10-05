'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('pendidikans',[
      {
        id:1,
        uuid:'d266e60c-fdb5-44fd-88b2-79ef284ea01c',
        name:'SD',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'4af5216f-da99-4f67-a051-c4193315d9dd',
        name:'SMP',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'d064e6e6-18bf-4302-8fec-7d57e320661d',
        name:'SMA',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'1b4ff8f9-4021-468a-a6a5-e199e5b7d5f3',
        name:'SMK',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'100cd02c-3efd-4fb9-8164-f4e9c56ba987',
        name:'D1',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'c714ed6f-580e-4e0f-95a9-108491d16068',
        name:'D2',
        code:6,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:7,
        uuid:'534d26c6-0382-446f-9010-2925739545e8',
        name:'D3',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:8,
        uuid:'f26758fd-26f0-49ab-ba1a-48030b810e4e',
        name:'D4',
        code:8,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:9,
        uuid:'25a0b60c-ce62-4d77-9fa0-2ccf4e4be72f',
        name:'S1',
        code:9,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:10,
        uuid:'002d5591-a0d2-4651-8e10-b9de8a38e814',
        name:'SD',
        code:10,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:11,
        uuid:'072bccf2-df78-4883-9a30-6cbf70007381',
        name:'11',
        code:11,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('pendidikans');
  }
};
