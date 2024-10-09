'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jabatans',[
      {
        id:1,
        uuid:'b7d428bd-f7a2-4e1a-97d1-d5ca1b24883a',
        name:'PENGURUS',
        code:1,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:4,
        uuid:'6a1727de-36b4-49e4-a36c-e5c28cdec22f',
        name:'ADVISOR',
        code:2,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:5,
        uuid:'e79f70b5-3d53-4286-a97b-0b8ea6943f67',
        name:'MANAGER',
        code:3,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:6,
        uuid:'964e10c2-5e19-4b49-b207-a13823a02e0a',
        name:'SPECIALIST',
        code:4,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:7,
        uuid:'27c9080b-dafb-4675-ba7a-039969f0a155',
        name:'ASSISTANT MANAGER',
        code:5,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:8,
        uuid:'ca1c0fd1-c82f-478c-bf86-9089d340a855',
        name:'SUPERVISOR',
        code:6,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:9,
        uuid:'4a59d489-6d90-4ef8-991e-50b26e51a3e2',
        name:'SENIOR ENGINEER, SENIOR OFFICER',
        code:7,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:10,
        uuid:'bee934d1-1025-477c-bdd3-855f92afb16a',
        name:'COORDINATOR',
        code:8,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:11,
        uuid:'81180f55-7460-4782-be39-9f264b677ea8',
        name:'ENGINEER, OFFICER',
        code:9,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:12,
        uuid:'eb7312e2-1717-47c0-8f08-5dfeb22d4073',
        name:'JUNIOR ENGINEER, JUNIOR OFFICER',
        code:10,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:13,
        uuid:'2e7ad51a-3614-4079-a433-02aca228db31',
        name:'TECHNICIAN, ADMINISTRATION',
        code:11,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:14,
        uuid:'7137629f-8c3e-4109-b4b4-50a8da298fd9',
        name:'KETUA PENGURUS',
        code:12,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:15,
        uuid:'bfcfe430-eb14-44ba-adb6-606e8117eddf',
        name:'JANITOR, DRIVER, COURIER',
        code:13,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:16,
        uuid:'d280422d-9a3c-4af0-85b5-3c27773d49de',
        name:'HELPER',
        code:14,
        is_active:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jabatans');
  }
};