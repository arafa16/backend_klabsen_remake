'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tipe_absens',[
      {
        id:1,
        uuid:'f097d41d-36c7-4f08-86bd-b249e6c078aa',
        name:'MASUK',
        code:0,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        uuid:'e964f3e4-8ad6-4953-ae32-6f3ad9a7c3bf',
        name:'PULANG',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:3,
        uuid:'5c993145-f986-4f1b-931e-6c060d7420b6',
        name:'SHIFT MASUK',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'8089f9ce-29c8-4e03-990c-f43528375f33',
        name:'SHIFT PULANG',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'11bc97f6-1716-4f87-8576-6e7cf9e8eb03',
        name:'WFH MASUK',
        code:8,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'74c9948c-029d-4b2c-bdf3-73df4462d7e5',
        name:'WFH PULANG',
        code:9,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:7,
        uuid:'f73e83cb-c4fa-4c3a-a47b-6c9544582f52',
        name:'TIDAK ABSEN MASUK',
        code:11,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:8,
        uuid:'5de75d4d-d81b-49f4-aff8-092dd844094a',
        name:'TIDAK ABSEN PULANG',
        code:12,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:9,
        uuid:'efb64032-d90c-4e78-85e6-8db7d4e5e16f',
        name:'CUTI',
        code:13,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:10,
        uuid:'bf28506a-54db-4fe4-b381-c48ee81e95e4',
        name:'SAKIT',
        code:14,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:11,
        uuid:'68464b20-ca86-4c9e-8934-e98398ba8af9',
        name:'IJIN',
        code:15,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:12,
        uuid:'a5e864f6-1035-43c4-948d-4a3c6e08e907',
        name:'SPJ',
        code:16,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tipe_absens');
  }
};
