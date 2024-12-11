'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('privileges',[
      {
        id:1,
        uuid:'1c09ee81-0c75-4728-bbba-1b91fb0c571e',
        dashboard: 1,
        edit_user_sub: 1,
        absen: 1,
        kalendar_sub: 1,
        pengajuan_koreksi_sub: 1,
        approval_koreksi_sub: 1,
        approval_all_koreksi_sub: 1,
        absen_modal: 1,
        wfh_modal: 1,
        shift_modal: 1,
        absen_check: 1,
        admin_event: 1,
        perhitungan_absen: 1,
        slip_gaji: 1,
        pendapatan_sub: 1,
        pendapatan_lain_sub: 1,
        pendapatan_admin_sub: 1,
        employees: 1,
        data_employee: 1,
        attribute: 1,
        setting: 1,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('privileges');
  }
};
