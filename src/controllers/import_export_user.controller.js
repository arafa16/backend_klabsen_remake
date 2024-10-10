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
const argon = require('argon2');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const excelJs = require('exceljs');
const db = require('../models/index.js');

const findGander = async(data)=> {
    const result = await ganderModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findPenempatan = async(data)=> {
    const result = await penempatanModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findJabatan = async(data)=> {
    const result = await jabatanModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findAtasan = async(data)=> {
    const result = await userModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findStatusPerkawinan = async(data)=> {
    const result = await statusPerkawinanModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findPendidikan = async(data)=> {
    const result = await pendidikanModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findContactEmergency = async(data)=> {
    const result = await contactEmergencyModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findGolonganDarah = async(data)=> {
    const result = await golonganDarahModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findBank = async(data)=> {
    const result = await bankModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findJamOperasionalGroup = async(data)=> {
    const result = await jamOperasionalGroupModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findStatus = async(data)=> {
    const result = await statusModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findGroup = async(data)=> {
    const result = await groupModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const importData = async(req, res)=>{

    if(!req.files) {
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const {file} = req.files;

    if(!file) {
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    // const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedType = ['.xlsx'];

    //filter file type
    if(!allowedType.includes(ext.toLowerCase())){
        return res.status(422).json({
            status:422,
            success:false,
            data: {
                data: null,
                message: "Type file is not allowed"
            }
        });
    }

    const fileName = file.md5+ext;
    const filePath = `./public/assets/imports/${fileName}`;

    const t = await db.sequelize.transaction();

    file.mv(filePath, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});

        try {
            let workbook = xlsx.readFile(`./public/assets/imports/${fileName}`);
            let sheetNames = workbook.SheetNames[0];
            let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames]);
        
            for(let i = 0; i < data.length; i++){

                let gander_id = null;
                let penempatan_id = null;
                let jabatan_id = null;
                let atasan_id = null;
                let status_perkawinan_id = null;
                let pendidikan_id = null;
                let contact_emergency_id = null;
                let golongan_darah_id = null;
                let bank_id = null;
                let jam_operasional_group_id = null;
                let group_id = null;
                let status_id = null;
                let hasPassword = null;
    
                if(data[i].gander){
                    const result = await findGander({name:data[i].gander});
                    
                    gander_id = result && result.id;
                }
    
                if(data[i].penempatan){
                    const result = await findPenempatan({name:data[i].penempatan});
                    
                    penempatan_id = result && result.id;
                }
    
                if(data[i].jabatan){
                    const result = await findJabatan({name:data[i].jabatan});
                    
                    penempatan_id = result && result.id;
                }
    
                if(data[i].atasan){
                    const result = await findAtasan({name:data[i].atasan});
                    
                    atasan_id = result && result.id;
                }
    
                if(data[i].status_perkawinan){
                    const result = await findStatusPerkawinan({name:data[i].status_perkawinan});
                    
                    status_perkawinan_id = result && result.id;
                }
    
                if(data[i].pendidikan){
                    const result = await findPendidikan({name:data[i].pendidikan});
                    
                    pendidikan_id = result && result.id;
                }
    
                if(data[i].contact_emergency){
                    const result = await findContactEmergency({name:data[i].contact_emergency});
                    
                    contact_emergency_id = result && result.id;
                }
    
                if(data[i].golongan_darah){
                    const result = await findGolonganDarah({name:data[i].golongan_darah});
                    
                    golongan_darah_id = result && result.id;
                }
    
                if(data[i].bank){
                    const result = await findBank({name:data[i].bank});
                    
                    bank_id = result && result.id;
                }
    
                if(data[i].jam_operasional_group){
                    const result = await findJamOperasionalGroup({name:data[i].jam_operasional_group});
                    
                    jam_operasional_group_id = result && result.id;
                }
    
                if(data[i].group){
                    const result = await findGroup({name:data[i].group});
                    
                    group_id = result && result.id;
                }
    
                if(data[i].status){
                    const result = await findStatus({name:data[i].status});
                    
                    status_id = result && result.id;
                }
    
                if(data[i].password){
                    hasPassword = await argon.hash(data[i].password);
                }
    
                await privilegeModel.create(
                    {
                        dashboard:1,
                        absen:1, 
                        kalendar_sub:1,
                        pengajuan_koreksi_sub:1,
                        slip_gaji:1,
                        pendapatan_sub:1,
                        pendapatan_lain_sub:1
                    },
                    { transaction: t }
                );
    
                await userModel.create(
                    {
                        nik:data[i].nik,
                        absen_id:data[i].absen_id,
                        name:data[i].name, 
                        gander_id, 
                        email:data[i].email,
                        password:hasPassword,
                        extention:data[i].extention,
                        nomor_hp:data[i].nomor_hp,
                        penempatan_id,
                        jabatan_id,
                        atasan_id,
                        nomor_ktp:data[i].nomor_ktp,
                        alamat_ktp:data[i].alamat_ktp,
                        alamat_domisili:data[i].alamat_domisili,
                        tempat_lahir:data[i].tempat_lahir,
                        tanggal_lahir:data[i].tanggal_lahir,
                        nomor_npwp:data[i].nomor_npwp,
                        status_perkawinan_id,
                        jumlah_anak:data[i].jumlah_anak,
                        nama_ibu:data[i].nama_ibu,
                        pendidikan_id,
                        nama_sekolah:data[i].nama_sekolah,
                        jurusan_sekolah:data[i].jurusan_sekolah,
                        tahun_lulus:data[i].tahun_lulus,
                        ipk:data[i].ipk,
                        nomor_bpjs_kesehatan:data[i].nomor_bpjs_kesehatan,
                        nomor_bpjs_ketenagakerjaan:data[i].nomor_bpjs_ketenagakerjaan,
                        contact_emergency_id,
                        emergency_number:data[i].emergency_number,
                        emergency_address:data[i].emergency_address,
                        nomor_sim:data[i].nomor_sim,
                        golongan_darah_id,
                        bank_id,
                        nomor_rekening:data[i].nomor_rekening,
                        jam_operasional_group_id,
                        group_id,
                        quote:data[i].quote,
                        status_id,
                        is_atasan:data[i].is_atasan,
                    },
                    { transaction: t }
                );
    
            }

            fs.unlinkSync(filePath);

            await t.commit()

            return res.status(200).json({
                status:200,
                success:true,
                data: {
                    data:null,
                    message: "success"
                }
            });

        } catch (error) {

            await t.rollback()

            return res.status(500).json({
                status:500,
                success:false,
                data: {
                    message: error.message
                }
            });
            
        }
    });
}

const exportData = async(req, res) => {
    const {status} = req.query;

    let dataResult = null;

    try {

        if(status){
            const statusResult = await findStatus({name:status});

            if(statusResult !== null){
                const result = await userModel.findAll({
                    where:{
                        status_id:statusResult.id
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
                })
    
                dataResult = result;
            }
            else{
                return res.status(404).json({
                    status:404,
                    success: false,
                    data:{
                        message:"status not found",
                        data:null,
                    }
                });
            }
        }
        else{
            const result = await userModel.findAll();

            dataResult = result;
        }

        if(dataResult !== null){
            let workbook = new excelJs.Workbook();
            const sheet = workbook.addWorksheet("data user");

            sheet.columns= [
                {header : "No", key:"no", width: 25},
                {header : "uuid", key:"uuid", width: 25},
                {header : "absen_id", key:"absen_id", width: 25},
                {header : "nik", key:"nik", width: 25},
                {header : "name", key:"name", width: 25},
                {header : "email", key:"email", width: 25},
                {header : "password", key:"password", width: 25},
                {header : "gander", key:"gander", width: 25},
                {header : "extention", key:"extention", width: 25},
                {header : "nomor_hp", key:"nomor_hp", width: 25},
                {header : "penempatan", key:"penempatan", width: 25},
                {header : "jabatan", key:"jabatan", width: 25},
                {header : "atasan", key:"atasan", width: 25},
                {header : "nomor_ktp", key:"nomor_ktp", width: 25},
                {header : "alamat_ktp", key:"alamat_ktp", width: 25},
                {header : "alamat_domisili", key:"alamat_domisili", width: 25},
                {header : "tempat_lahir", key:"tempat_lahir", width: 25},
                {header : "tanggal_lahir", key:"tanggal_lahir", width: 25},
                {header : "nomor_npwp", key:"nomor_npwp", width: 25},
                {header : "status_perkawinan", key:"status_perkawinan", width: 25},
                {header : "jumlah_anak", key:"jumlah_anak", width: 25},
                {header : "nama_ibu", key:"nama_ibu", width: 25},
                {header : "pendidikan", key:"pendidikan", width: 25},
                {header : "nama_sekolah", key:"nama_sekolah", width: 25},
                {header : "jurusan_sekolah", key:"jurusan_sekolah", width: 25},
                {header : "tahun_lulus", key:"tahun_lulus", width: 25},
                {header : "ipk", key:"ipk", width: 25},
                {header : "nomor_bpjs_kesehatan", key:"nomor_bpjs_kesehatan", width: 25},
                {header : "nomor_bpjs_ketenagakerjaan", key:"nomor_bpjs_ketenagakerjaan", width: 25},
                {header : "contact_emergency", key:"contact_emergency", width: 25},
                {header : "emergency_number", key:"emergency_number", width: 25},
                {header : "emergency_address", key:"emergency_address", width: 25},
                {header : "nomor_sim", key:"nomor_sim", width: 25},
                {header : "golongan_darah", key:"golongan_darah", width: 25},
                {header : "bank", key:"bank", width: 25},
                {header : "nomor_rekening", key:"nomor_rekening", width: 25},
                {header : "jam_operasional_group", key:"jam_operasional_group", width: 25},
                {header : "group", key:"group", width: 25},
                {header : "quote", key:"quote", width: 25},
                {header : "status", key:"status", width: 25},
                {header : "is_atasan", key:"is_atasan", width: 25},
            ];

            dataResult.map((data, index) => {
                sheet.addRow({
                    no:index+1,
                    nik:data && data.nik,
                    absen_id:data && data.absen && data.absen.name, 
                    name:data && data.name, 
                    gander_id:data && data.gander && data.gander.name, 
                    email:data && data.email,
                    extention:data && data.extention,
                    nomor_hp:data && data.nomor_hp,
                    penempatan_id:data && data.penempatan && data.penempatan.name,
                    jabatan_id:data && data.jabatan && data.jabatan.name,
                    atasan_id:data && data.atasan && data.atasan.name,
                    nomor_ktp:data && data.nomor_ktp,
                    alamat_ktp:data && data.alamat_ktp,
                    alamat_domisili:data && data.alamat_domisili,
                    tempat_lahir:data && data.tempat_lahir,
                    tanggal_lahir:data && data.tanggal_lahir,
                    nomor_npwp:data && data.nomor_npwp,
                    status_perkawinan_id:data && data.status_perkawinan && data.status_perkawinan.name,
                    jumlah_anak:data && data.jumlah_anak,
                    nama_ibu:data && data.nama_ibu,
                    pendidikan_id:data && data.pendidikan && data.pendidikan.name,
                    nama_sekolah:data && data.nama_sekolah,
                    jurusan_sekolah:data && data.jurusan_sekolah,
                    tahun_lulus:data && data.tahun_lulus,
                    ipk:data && data.ipk,
                    nomor_bpjs_kesehatan:data && data.nomor_bpjs_kesehatan,
                    nomor_bpjs_ketenagakerjaan:data && data.nomor_bpjs_ketenagakerjaan,
                    contact_emergency_id:data && data.contact_emergency && data.contact_emergency.name,
                    emergency_number:data && data.emergency_number,
                    emergency_address:data && data.emergency_address,
                    nomor_sim:data && data.nomor_sim,
                    golongan_darah_id:data && data.golongan_darah && data.golongan_darah.name,
                    bank_id:data && data.bank_id,
                    nomor_rekening:data && data.nomor_rekening,
                    jam_operasional_group_id:data && data.jam_operasional_group && data.jam_operasional_group.name,
                    group_id:data && data.group && data.group.name,
                    // password:data && data.password,
                    quote:data && data.quote,
                    status_id:data && data.status && data.status.name,
                    is_atasan:data && data.is_atasan ? 'yes' : 'no'
                })
            })

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
    
            res.setHeader(
                "Content-Disposition",
                "attachment;filename="+"data_user.xlsx"
            );
    
            workbook.xlsx.write(res);
        }
    
        // return res.status(200).json({
        //     status:200,
        //     success: true,
        //     data:{
        //         message:"success",
        //         data:dataResult,
        //     }
        // });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            data:{
                message:error.message
            }
        })
    }

    
}

module.exports = {
    importData,
    exportData
}