const {
    pendapatan:pendapatanModel,
    tipe_pendapatan:tipePendapatanModel,
    user:userModel,
} = require('../models/index.js');
const {Op} = require('sequelize');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const excelJs = require('exceljs');
const db = require('../models/index.js');

const findTipePendapatan = async(data) => {
    const result = await tipePendapatanModel.findOne({
        where:{
            name:data.name
        },
        attributes:['id','name']
    });

    return result
}

const findUser = async(data) => {
    const result = await userModel.findOne({
        where:{
            nik:data.nik
        },
        attributes:['id','name']
    });

    return result
}

const importPendapatans = async(req, res) => {

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

    // const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedType = ['.xlsx'];

    //filter file type
    if(!allowedType.includes(ext.toLowerCase())){
        return res.status(422).json({
            status:422,
            success:false,
            datas: {
                data: null,
                message: "Type file is not allowed"
            }
        });
    }

    const file_name = file.md5+ext;
    const file_path = `./public/assets/imports/${file_name}`;

    const t = await db.sequelize.transaction();

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

        try {
            let workbook = xlsx.readFile(`./public/assets/imports/${file_name}`);
            let sheetNames = workbook.SheetNames[0];
            let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames]);

            for(let i = 0; i < data.length; i++){
                let tipe_pendapatan_id = null;
                let user_id = null;

                if(!data[i].tipe_pendapatan){
                    await t.rollback()

                    return res.status(404).json({
                        status:404,
                        success:false,
                        datas: {
                            message: `${data[i].name} : tipe pendapatan not found`
                        }
                    });
                }

                if(data[i].tipe_pendapatan){
                    const result = await findTipePendapatan({name:data[i].tipe_pendapatan});
                    
                    tipe_pendapatan_id = result && result.id;
                }

                if(data[i].nik){
                    const result = await findUser({nik:data[i].nik});

                    if(!result){
                        await t.rollback()

                        return res.status(404).json({
                            status:404,
                            success:false,
                            datas: {
                                message: `${data[i].nik} : user not found`
                            }
                        });
                    }
                    
                    user_id = result && result.id;
                }

                await pendapatanModel.create(
                    {
                        tipe_pendapatan_id:tipe_pendapatan_id,
                        user_id:user_id,
                        pendapatan_atas:data[i].pendapatan_atas,
                        periode:data[i].periode,
                        initial_periode:data[i].initial_periode,
                        basic_salary:data[i].basic_salary,
                        kjk:data[i].kjk,
                        tunjangan_jabatan:data[i].tunjangan_jabatan,
                        incentive:data[i].incentive,
                        rapel:data[i].rapel,
                        adjustment:data[i].adjustment,
                        overtime_allowance:data[i].overtime_allowance,
                        tax:data[i].tax,
                        overtime_fee_1:data[i].overtime_fee_1,
                        overtime_fee_2:data[i].overtime_fee_2,
                        tunjangan_jht:data[i].tunjangan_jht,
                        tunjangan_pensiun:data[i].tunjangan_pensiun,
                        tunjangan_jkk:data[i].tunjangan_jkk,
                        tunjangan_jkm:data[i].tunjangan_jkm,
                        tunjangan_bpjs:data[i].tunjangan_bpjs,
                        zakat:data[i].zakat,
                        iuran_koperasi:data[i].iuran_koperasi,
                        angsuran_koperasi:data[i].angsuran_koperasi,
                        pinalti:data[i].pinalti,
                        potongan_pinjaman:data[i].potongan_pinjaman,
                        potongan_jht:data[i].potongan_jht,
                        potongan_bpjs:data[i].potongan_bpjs,
                        potongan_pensiun:data[i].potongan_pensiun,
                        adjustment_minus:data[i].adjustment_minus,
                        potongan_anggota:data[i].potongan_anggota,
                        thr:data[i].thr,
                        shu:data[i].shu,
                        bonus:data[i].bonus,
                        kompensasi:data[i].kompensasi,
                        pph21:data[i].pph21,
                        potongan_pph21:data[i].potongan_pph21,
                        total:data[i].total,
                    },
                    { transaction: t }
                )
            }

            const fileExist = fs.existsSync(file_path)

            if(fileExist){
                fs.unlinkSync(file_path);
            }

            await t.commit();

            return res.status(201).json({
                status:201,
                success:true,
                datas: {
                    data:null,
                    message: "success"
                }
            });

        } catch (error) {
            await t.rollback()

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

const exportPendapatans = async(req, res) => {
    try {
        let workbook = new excelJs.Workbook();

        const sheet = workbook.addWorksheet("pendapatan");

        const pendapatan = await pendapatanModel.findAll({
            include:[{
                model:userModel,
                attributes:['nik','name']
            },{
                model:tipePendapatanModel,
                attributes:['name']
            }]
        });

        sheet.columns= [
            {header : "Tipe Pendapatan", key:"tipe_pendapatan", width: 25},
            {header : "nik", key:"nik", width: 25},
            {header : "name", key:"name", width: 25},
            {header : "pendapatan_atas", key:"pendapatan_atas", width: 25},
            {header : "periode", key:"periode", width: 25},
            {header : "initial_periode", key:"initial_periode", width: 25},
            {header : "basic_salary", key:"basic_salary", width: 25},
            {header : "kjk", key:"kjk", width: 25},
            {header : "tunjangan_jabatan", key:"tunjangan_jabatan", width: 25},
            {header : "incentive", key:"incentive", width: 25},
            {header : "rapel", key:"rapel", width: 25},
            {header : "adjustment", key:"adjustment", width: 25},
            {header : "overtime_allowance", key:"overtime_allowance", width: 25},
            {header : "tax", key:"tax", width: 25},
            {header : "overtime_fee_1", key:"overtime_fee_1", width: 25},
            {header : "overtime_fee_2", key:"overtime_fee_2", width: 25},
            {header : "tunjangan_jht", key:"tunjangan_jht", width: 25},
            {header : "tunjangan_pensiun", key:"tunjangan_pensiun", width: 25},
            {header : "tunjangan_jkk", key:"tunjangan_jkk", width: 25},
            {header : "tunjangan_jkm", key:"tunjangan_jkm", width: 25},
            {header : "tunjangan_bpjs", key:"tunjangan_bpjs", width: 25},
            {header : "zakat", key:"zakat", width: 25},
            {header : "iuran_koperasi", key:"iuran_koperasi", width: 25},
            {header : "angsuran_koperasi", key:"angsuran_koperasi", width: 25},
            {header : "pinalti", key:"pinalti", width: 25},
            {header : "potongan_pinjaman", key:"potongan_pinjaman", width: 25},
            {header : "potongan_jht", key:"potongan_jht", width: 25},
            {header : "potongan_bpjs", key:"potongan_bpjs", width: 25},
            {header : "potongan_pensiun", key:"potongan_pensiun", width: 25},
            {header : "adjustment_minus", key:"adjustment_minus", width: 25},
            {header : "potongan_anggota", key:"potongan_anggota", width: 25},
            {header : "thr", key:"thr", width: 25},
            {header : "shu", key:"shu", width: 25},
            {header : "bonus", key:"bonus", width: 25},
            {header : "kompensasi", key:"kompensasi", width: 25},
            {header : "pph21", key:"pph21", width: 25},
            {header : "potongan_pph21", key:"potongan_pph21", width: 25},
            {header : "total", key:"total", width: 25}
        ];

        pendapatan.map((value, index)=>{
            sheet.addRow({
                tipe_pendapatan:value.tipe_pendapatan.name,
                nik:value.user.nik,
                name:value.user.name,
                pendapatan_atas:value.pendapatan_atas,
                periode:value.periode,
                initial_periode:value.initial_periode,
                basic_salary:value.basic_salary,
                kjk:value.kjk,
                tunjangan_jabatan:value.tunjangan_jabatan,
                incentive:value.incentive,
                rapel:value.rapel,
                adjustment:value.adjustment,
                overtime_allowance:value.overtime_allowance,
                tax:value.tax,
                overtime_fee_1:value.overtime_fee_1,
                overtime_fee_2:value.overtime_fee_2,
                tunjangan_jht:value.tunjangan_jht,
                tunjangan_pensiun:value.tunjangan_pensiun,
                tunjangan_jkk:value.tunjangan_jkk,
                tunjangan_jkm:value.tunjangan_jkm,
                tunjangan_bpjs:value.tunjangan_bpjs,
                zakat:value.zakat,
                iuran_koperasi:value.iuran_koperasi,
                angsuran_koperasi:value.angsuran_koperasi,
                pinalti:value.pinalti,
                potongan_pinjaman:value.potongan_pinjaman,
                potongan_jht:value.potongan_jht,
                potongan_bpjs:value.potongan_bpjs,
                potongan_pensiun:value.potongan_pensiun,
                adjustment_minus:value.adjustment_minus,
                potongan_anggota:value.potongan_anggota,
                thr:value.thr,
                shu:value.shu,
                bonus:value.bonus,
                kompensasi:value.kompensasi,
                pph21:value.pph21,
                potongan_pph21:value.potongan_pph21,
                total:value.total,
            })
        })

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment;filename="+"pendapatans.xlsx"
        );

        workbook.xlsx.write(res);

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
    importPendapatans,
    exportPendapatans
}