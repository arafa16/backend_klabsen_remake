'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('groups',[
      {
        id:1,
        uuid:'f49b8ca9-f716-4d5a-9862-bfb44e1424cc',
        name:'PENGURUS KOPKARLA',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'faa8e6c0-fe80-49ea-a1e8-1c656e1af2de',
        name:'STAFF KOPKARLA',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'16faae8a-eac8-455c-9982-3b52fdcd1a7a',
        name:'DRIVER DIREKSI KOPKARLA',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'a3d6be26-e9f6-4e3f-b8be-a28e4734eee6',
        name:'DRIVER DAN JANITOR KOPKARLA',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'951a03c2-58fa-4a8c-8a39-bef643c0fa8f',
        name:'JASA INSTALASI',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'c6754a06-4b8d-4348-8880-1af434b586e2',
        name:'DRIVER ARTAJASA',
        code:6,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:7,
        uuid:'4802bbfb-3fa8-4110-b551-ae8f290f115b',
        name:'DRIVER LINTASARTA',
        code:7,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:8,
        uuid:'7ee6eb98-e3aa-414d-96f1-66225a37b322',
        name:'REGIONAL KOPKARLA',
        code:8,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:9,
        uuid:'ee073176-b40a-4905-94e4-42ccabb48ce8',
        name:'DRIVER ARTAJASA',
        code:9,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('groups');
  }
};
