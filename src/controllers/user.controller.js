const {
    user:userModel, 
    status:statusModel, 
    penempatan:penempatanModel,
    gander:ganderModel,
    pendidikan:pendidikanModel,
    jabatan:jabatanModel,
    status_perkawinan:statusPerkawinanModel,
    contact_emergency:contactEmergencyModel,
    bank:bankModel,
    golongan_darah:golonganDarahModel,
    jam_operasional_group:jamOperasionalGroupModel,
    group:groupModel,
    privilege:privilegeModel,
} = require('../models/index.js');
const {Op, where} = require('sequelize');
const argon = require('argon2');

const getDataTable = async(req, res) => {
    const {search, sort, status_code} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(search){
        querySearchObject.name = {[Op.like]:`%${search}%`}
        querySearchObject.email = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.name = {[Op.like]:`%${''}%`}
    }

    if(status_code){
        const find_status = await statusModel.findOne({
            where:{
                code:status_code
            }
        })

        if(find_status !== null){
            queryObject.status_id = find_status.id
        }
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
            datas:{
                message:"success",
                data:result,
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            datas:{
                message:error.message
            }
        })
    }
}

const getCountDatas = async(req, res) => {

    try {
        let result = {};

        const pendaftaran = await userModel.count({
            include:[
                {
                    model:statusModel,
                    where:{
                        code:1
                    }
                }
            ]
        });

        result.pendaftaran = pendaftaran;

        const active = await userModel.count({
            include:[
                {
                    model:statusModel,
                    where:{
                        code:2
                    }
                }
            ]
        });

        result.active = active

        const non_active = await userModel.count({
            include:[
                {
                    model:statusModel,
                    where:{
                        code:3
                    }
                }
            ]
        });

        result.non_active = non_active

        const all = await userModel.count();

        result.all = all

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                data:result,
                message: "success count"
            }
        });

    } catch (error) {

        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }
}

const getDataById = async(req, res) => {
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
                    model:golonganDarahModel,
                    attributes:['uuid','name']
                },
                {
                    model:jamOperasionalGroupModel,
                    attributes:['uuid','name','keterangan','code','is_active']
                },
                {
                    model:groupModel,
                    attributes:['uuid','name']
                },
                {
                    model:statusModel,
                    attributes:['id','uuid','name']
                },
                {
                    model:userModel,
                    as: 'atasan'
                },
                {
                    model:privilegeModel
                }
            ]
        });

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }
}

const createData = async(req, res) => {
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
            jam_operasional_group_id,
            group_id,
            password,
            quote,
            status_id,
            is_atasan,
            is_active
        } = req.body;

    if(password === null || password === ''){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "password can't be null"
            }
        });
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
            jam_operasional_group_id,
            group_id,
            quote,
            status_id,
            is_atasan,
            is_active
        });

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }
}

const updateData = async(req, res) => {
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
            datas: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }
}

const deleteData = async(req, res) => {
    const {id} = req.params;

    const result = await userModel.findOne({
        where:{
            uuid:id
        }
    });

    if(!result){
        return res.status(404).json({
            message:"data not found"
        })
    }

    try {
        result.destroy();

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }

    
}

const updatePassword = async(req, res) => {
    const {id} = req.params;
    const {password} = req.body;
    const {confPassword} = req.body;

    const user = await userModel.findOne({
        where:{
            uuid:id
        }
    })

    if(!user){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                 message:"data not found"
            }
        });
    }

    if(!password || !confPassword){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                message:"password can't null"
            }
        });
    }

    if(password !== confPassword){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                message:"password and confirmation password dosn't match"
            }
        });
    }

    try {
        const hasPassword = await argon.hash(password);

        await user.update({
            password:hasPassword
        });

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:null,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error.message
            }
        });
    }

    
}

module.exports = {
    getDataTable,
    getDataById,
    createData,
    updateData,
    deleteData,
    updatePassword,
    getCountDatas
}