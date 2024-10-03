'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      absen_id:{
        type: Sequelize.STRING,
        allowNull:true
      },
      nik:{
        type: Sequelize.STRING,
        allowNull:true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image:{
        type: Sequelize.STRING,
        allowNull:true
      },
      url_image:{
          type: Sequelize.TEXT,
          allowNull:true
      },
      gander_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      extention: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nomor_hp:{
        type: Sequelize.STRING,
        allowNull:true
      },
      penempatan_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      jabatan_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      atasan_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      nomor_ktp:{
          type: Sequelize.STRING,
          allowNull:true
      },
      alamat_ktp:{
          type: Sequelize.TEXT,
          allowNull:true
      },
      alamat_domisili:{
          type: Sequelize.TEXT,
          allowNull:true
      },
      tempat_lahir:{
          type: Sequelize.STRING,
          allowNull:true
      },
      tanggal_lahir:{
          type: Sequelize.DATE,
          allowNull:true
      },
      nomor_npwp:{
          type: Sequelize.STRING,
          allowNull:true
      },
      status_perkawinan_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      jumlah_anak:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      nama_ibu:{
          type: Sequelize.STRING,
          allowNull:true
      },
      pendidikan_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      nama_sekolah:{
          type: Sequelize.STRING,
          allowNull:true
      },
      jurusan_sekolah:{
          type: Sequelize.STRING,
          allowNull:true
      },
      tahun_lulus:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      ipk:{
          type: Sequelize.STRING,
          allowNull:true
      },
      nomor_bpjs_kesehatan:{
          type: Sequelize.STRING,
          allowNull:true
      },
      nomor_bpjs_ketenagakerjaan:{
          type: Sequelize.STRING,
          allowNull:true
      },
      contact_emergency_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      emergency_number:{
          type: Sequelize.STRING,
          allowNull:true
      },
      emergancy_address:{
          type: Sequelize.STRING,
          allowNull:true
      },
      nomor_sim:{
          type: Sequelize.STRING,
          allowNull:true
      },
      golongan_darah_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      bank_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      nomor_rekening:{
          type: Sequelize.STRING,
          allowNull:true
      },
      jam_operasional_group_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      group_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      quote:{
          type: Sequelize.STRING,
          allowNull:true
      },
      privilege_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      status_id:{
          type: Sequelize.INTEGER,
          allowNull:true
      },
      is_atasan:{
          type: Sequelize.BOOLEAN,
          defaultValue:false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};