const {
    in_out:inOutModel,
    user:userModel,
    tipe_absen:tipeAbsenModel
} = require('../models/index.js');
const path = require('path');
const date = require('date-and-time');
const xlsx = require('xlsx');
const crypto = require('crypto');
const fs = require('fs');

const importInOut = async(req, res) => {
    const uuid = req.params.id;

    if(!req.files) {
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
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
            datas: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const ext = path.extname(file.name);
    const file_name = crypto.randomUUID()+ext;
    const file_path = `./public/assets/imports/${file_name}`;
    const allowed_type = ['.xlsx'];

    //filter file type
    if(!allowed_type.includes(ext.toLowerCase())){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                data: null,
                message: "type file not allowed"
            }
        });
    }

    file.mv(file_path, async(err)=>{
        if(err){
            return res.status(500).json({
                status:500,
                success:false,
                datas: {
                    message: err.message
                }
            });
        }


        let workbook = xlsx.readFile(file_path);
        let sheetNames = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames]);

        const dataSubmit = [];

        try {
            for(let i = 0; i < data.length; i++){
                const tanggal_mulai = date.format(new Date(data[i].tanggal_mulai), 'YYYY-MM-DD HH:mm:ss');
                const tanggal_selesai = date.format(new Date(data[i].tanggal_selesai), 'YYYY-MM-DD HH:mm:ss');

                const findUser = await userModel.findOne({
                    where:{
                        uuid:uuid
                    },
                    attributes:['id']
                });

                const findTipeAbsen = await tipeAbsenModel.findOne({
                    where:{
                        code:data[i].tipe_absen_id
                    },
                    attributes:['id']
                })

                const response = await inOutModel.create({
                    user_id:findUser.id,
                    tanggal_mulai:tanggal_mulai,
                    tanggal_selesai:tanggal_selesai,
                    tipe_absen_id:findTipeAbsen.id,
                    pelanggaran_id:data[i].pelanggaran_id,
                    status_inout_id:data[i].status_inout_id,
                    jam_operasional_id:data[i].jam_operasional_id,
                });

                dataSubmit.push(response);
            }
            
            const fileExist = fs.existsSync(file_path)

            if(fileExist){
                fs.unlinkSync(file_path);
            }

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
    })
}

const importInOutDatabase = async(req, res) => {

    if(!req.files) {
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
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
            datas: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const ext = path.extname(file.name);
    const file_name = crypto.randomUUID()+ext;
    const file_path = `./public/assets/imports/${file_name}`;
    const allowed_type = ['.xlsx'];

    //filter file type
    if(!allowed_type.includes(ext.toLowerCase())){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                data: null,
                message: "type file not allowed"
            }
        });
    }

    file.mv(file_path, async(err)=>{

        if(err){
            return res.status(500).json({
                status:500,
                success:false,
                datas: {
                    message: err.message
                }
            });
        }


        let workbook = xlsx.readFile(file_path);
        let sheetNames = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames]);

        const dataSubmit = [];

        try {
            for(let i = 0; i < data.length; i++){

                const response = await inOutModel.create({
                    id:data[i].id,
                    uuid:data[i].uuid,
                    user_id:data[i].user_id,
                    tanggal_mulai:data[i].tanggal_mulai,
                    tanggal_selesai:data[i].tanggal_selesai,
                    tipe_absen_id:data[i].tipe_absen_id,
                    pelanggaran_id:data[i].pelanggaran_id,
                    status_inout_id:data[i].status_inout_id,
                    jam_operasional_id:data[i].jam_operasional_id,
                });

                dataSubmit.push(response);
            }
            
            const fileExist = fs.existsSync(file_path)

            if(fileExist){
                fs.unlinkSync(file_path);
            }

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
    })
}

module.exports = {
    importInOut,
    importInOutDatabase
}