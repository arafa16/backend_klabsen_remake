'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jam_operasionals',[
      {
        id:1,
        uuid:'62db59bd-43a4-4888-87ad-38a2a55a0b1a',
        jam_operasional_group_id:1,
        name:'JAM OPERASIONAL REGULAR 1',
        jam_masuk:'08:00:59',
        jam_pulang:'17:00:00',
        keterangan:'FLEXY REGULER 1',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'eec1aa56-09a7-4d78-b729-d1dfa8165f12',
        jam_operasional_group_id:2,
        name:'JAM OPERASIONAL REGULAR TEKNISI 1',
        jam_masuk:'09:00:00',
        jam_pulang:'18:00:00',
        keterangan:'JAM NORMAL',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'22a41e8d-fa07-4462-a3b6-6a4e54f71785',
        jam_operasional_group_id:1,
        name:'JAM OPERASIONAL REGULAR RAMADHAN',
        jam_masuk:'07:30:00',
        jam_pulang:'15:30:00',
        keterangan:'JAM NORMAL',
        code:5,
        is_active:false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'05673148-6f03-4c17-8650-43fbe8d0c7ff',
        jam_operasional_group_id:2,
        name:'JAM OPERASIONAL REGULAR RAMADHAN TEKNISI',
        jam_masuk:'08:30:00',
        jam_pulang:'16:30:00',
        keterangan:'JAM NORMAL',
        code:6,
        is_active:false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'c2175ccd-dc49-489a-a863-73bcd62f3f81',
        jam_operasional_group_id:1,
        name:'JAM OPERASIONAL REGULER 2',
        jam_masuk:'08:30:00',
        jam_pulang:'17:30:00',
        keterangan:'FLEXY REGULER 2',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:8,
        uuid:'bbc5cfef-b184-47ad-b9e2-4bc7da4ee46c',
        jam_operasional_group_id:1,
        name:'JAM OPERASIONAL REGULER 3',
        jam_masuk:'09:00:00',
        jam_pulang:'18:00:00',
        keterangan:'FLEXY REGULER 2',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:9,
        uuid:'445594b9-38cf-428d-ab12-31194619fd60',
        jam_operasional_group_id:3,
        name:'SHIFT TEKNISI',
        jam_masuk:'18:00:00',
        jam_pulang:'06:00:00',
        keterangan:'SHIFT TEKNISI',
        code:7,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jam_operasionals');
  }
};
