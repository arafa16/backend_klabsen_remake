const {
    user : userModel, 
    status:statusModel, 
    penempatan:penempatanModel,
    gander:ganderModel,
    pendidikan:pendidikanModel,
    jabatan:jabatanModel,
    status_perkawinan:statusPerkawinanModel,
    contact_emergency:contactEmergencyModel,
    bank:bankModel,
    golongan_darah:golonganDarahModal,
    jam_operasional_group:jamOperasionalGroupModal,
    group:groupModal,
    status:statusModal,
    privilege:privilegeModal,
} = require('../models');
const {Op, where} = require('sequelize');
const argon = require('argon2');

const getUserTable = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(search){
        querySearchObject.name = {[Op.like]:`%${search}%`}
        querySearchObject.email = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.name = {[Op.like]:`%${''}%`}
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(page - 1) * limit;

    if(sort){
        sortList = sort;
    }else{
        sortList ='name';
    }

    try {
        const result = await userModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            limit,
            offset,
            include:[
                {
                    model:penempatanModel
                },
                {
                    model:statusModel
                }
            ],
            attributes:{
                exclude:['id','password']
            },
            order:[sortList]
        });

        return res.status(200).json({
            status:200,
            success: true,
            data:{
                message:"success",
                data:result,
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            data:{
                message:error
            }
        })
    }
}

const getUserById = async(req, res) => {
    try {
        const result = await userModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:ganderModel,
                    attributes:['uuid','name']
                },
                {
                    model:pendidikanModel,
                    attributes:['uuid','name']
                },
                {
                    model:penempatanModel,
                    attributes:['uuid','name']
                },
                {
                    model:jabatanModel,
                    attributes:['uuid','name']
                },
                {
                    model:statusPerkawinanModel,
                    attributes:['uuid','name']
                },
                {
                    model:contactEmergencyModel,
                    attributes:['uuid','name']
                },
                {
                    model:bankModel,
                    attributes:['uuid','name']
                },
                {
                    model:golonganDarahModal,
                    attributes:['uuid','name']
                },
                {
                    model:jamOperasionalGroupModal,
                    attributes:['uuid','name','keterangan','code','is_active']
                },
                {
                    model:groupModal,
                    attributes:['uuid','name']
                },
                {
                    model:statusModal,
                    attributes:['id','uuid','name']
                },
                {
                    model:userModel,
                    as: 'atasan'
                },
                {
                    model:privilegeModal
                }
            ]
        });

        return res.status(200).json({
            status:200,
            success:true,
            data: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error
            }
        });
    }
}

const createUser = async(req, res) => {
    const { nik,
            absen_id, 
            name, 
            gander_id, 
            email,
            extention,
            nomor_hp,
            penempatan_id,
            jabatan_id,
            atasan_id,
            nomor_ktp,
            alamat_ktp,
            alamat_domisili,
            tempat_lahir,
            tanggal_lahir,
            nomor_npwp,
            status_perkawinan_id,
            jumlah_anak,
            nama_ibu,
            pendidikan_id,
            nama_sekolah,
            jurusan_sekolah,
            tahun_lulus,
            ipk,
            nomor_bpjs_kesehatan,
            nomor_bpjs_ketenagakerjaan,
            contact_emergency_id,
            emergency_number,
            emergency_address,
            nomor_sim,
            golongan_darah_id,
            bank_id,
            nomor_rekening,
            jamOperasional_group_id,
            group_id,
            password,
            quote,
            status_id,
            is_atasan,
            is_active
        } = req.body;

    if(password === null || password === ''){
        return res.status(404).json({msg: "password can't be null"})
    }
    
    const hasPassword = await argon.hash(password);

    try {
        const result = await userModel.create({
            nik,
            absen_id,
            name, 
            gander_id, 
            email,
            password:hasPassword,
            extention,
            nomor_hp,
            penempatan_id,
            jabatan_id,
            atasan_id,
            nomor_ktp,
            alamat_ktp,
            alamat_domisili,
            tempat_lahir,
            tanggal_lahir,
            nomor_npwp,
            status_perkawinan_id,
            jumlah_anak,
            nama_ibu,
            pendidikan_id,
            nama_sekolah,
            jurusan_sekolah,
            tahun_lulus,
            ipk,
            nomor_bpjs_kesehatan,
            nomor_bpjs_ketenagakerjaan,
            contact_emergency_id,
            emergency_number,
            emergency_address,
            nomor_sim,
            golongan_darah_id,
            bank_id,
            nomor_rekening,
            jamOperasional_group_id,
            group_id,
            quote,
            status_id,
            is_atasan,
            is_active
        });

        return res.status(201).json({
            status:201,
            success:true,
            data: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error
            }
        });
    }
}

const updateUser = async(req, res) => {
    const { nik,
            absen_id, 
            name, 
            gander_id, 
            email,
            extention,
            nomor_hp,
            penempatan_id,
            jabatan_id,
            atasan_id,
            nomor_ktp,
            alamat_ktp,
            alamat_domisili,
            tempat_lahir,
            tanggal_lahir,
            nomor_npwp,
            status_perkawinan_id,
            jumlah_anak,
            nama_ibu,
            pendidikan_id,
            nama_sekolah,
            jurusan_sekolah,
            tahun_lulus,
            ipk,
            nomor_bpjs_kesehatan,
            nomor_bpjs_ketenagakerjaan,
            contact_emergency_id,
            emergency_number,
            emergency_address,
            nomor_sim,
            golongan_darah_id,
            bank_id,
            nomor_rekening,
            jamOperasional_group_id,
            group_id,
            quote,
            status_id,
            is_atasan,
            is_active
        } = req.body;

    try {
        const result = await userModel.findOne({
            where:{
                uuid:req.params.id
            }
        })
        
        result.update({
            nik,
            absen_id,
            name, 
            gander_id, 
            email,
            extention,
            nomor_hp,
            penempatan_id,
            jabatan_id,
            atasan_id,
            nomor_ktp,
            alamat_ktp,
            alamat_domisili,
            tempat_lahir,
            tanggal_lahir,
            nomor_npwp,
            status_perkawinan_id,
            jumlah_anak,
            nama_ibu,
            pendidikan_id,
            nama_sekolah,
            jurusan_sekolah,
            tahun_lulus,
            ipk,
            nomor_bpjs_kesehatan,
            nomor_bpjs_ketenagakerjaan,
            contact_emergency_id,
            emergency_number,
            emergency_address,
            nomor_sim,
            golongan_darah_id,
            bank_id,
            nomor_rekening,
            jamOperasional_group_id,
            group_id,
            quote,
            status_id,
            is_atasan,
            is_active
        });

        return res.status(201).json({
            status:201,
            success:true,
            data: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error
            }
        });
    }
}

const deleteUser = async(req, res) => {
    const {id} = req.params;

    const result = await userModel.findOne({
        where:{
            uuid:id
        }
    });

    if(!result){
        return res.status(404).json({
            message:"user not found"
        })
    }

    try {
        result.destroy();

        return res.status(200).json({
            status:200,
            success:true,
            data: {
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error
            }
        });
    }

    
}

module.exports = {
    getUserTable,
    getUserById,
    createUser,
    deleteUser,
    updateUser
}