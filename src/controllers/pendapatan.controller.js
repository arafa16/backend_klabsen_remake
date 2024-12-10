const {
    pendapatan:pendapatanModel,
    tipe_pendapatan:tipePendapatanModel,
    user:userModel,
    group:groupModel
} = require('../models/index.js');
const {Op} = require('sequelize');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='periode';
    }

    try {
        const result = await pendapatanModel.findAll({
            order:[sortList]
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

//table admin
const getDataTable = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(search){
        querySearchObject.pendapatan_atas = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.pendapatan_atas = {[Op.like]:`%${''}%`}
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(page - 1) * limit;

    if(sort){
        sortList = sort;
    }else{
        sortList ='periode';
    }

    try {
        const result = await pendapatanModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel,
                    include:[
                        {
                            model:groupModel
                        }
                    ]
                },
                {
                    model:tipePendapatanModel,
                }
            ],
            limit,
            offset,
            order:[sortList]
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

//table by user
const getDataTableByUser = async(req, res) => {
    const user = req.user;

    const {search, sort, type} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(user){
        queryObject.user_id = user.id
    }

    if(type){
        queryObject.tipe_pendapatan_id = type
    }

    if(search){
        querySearchObject.pendapatan_atas = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.pendapatan_atas = {[Op.like]:`%${''}%`}
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(page - 1) * limit;

    if(sort){
        sortList = sort;
    }else{
        sortList ='periode';
    }

    try {
        const result = await pendapatanModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            limit,
            offset,
            include:[
                {
                    model:userModel
                }
            ],
            order:[sortList]
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

const getDataById = async(req, res) => {
    const {id} = req.params;

    try {
        const result = await pendapatanModel.findOne({
            where:{
                uuid:id
            },
            include:[
                {
                    model:userModel,
                    include:[
                        {
                            model:groupModel
                        }
                    ]
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
    const {
        tipe_pendapatan_uuid,
        user_uuid,
        pendapatan_atas,
        periode,
        initial_periode,
        basic_salary,
        kjk,
        tunjangan_jabatan,
        incentive,
        rapel,
        adjustment,
        overtime_allowance,
        tax,
        overtime_fee_1,
        overtime_fee_2,
        tunjangan_jht,
        tunjangan_pensiun,
        tunjangan_jkk,
        tunjangan_jkm,
        tunjangan_bpjs,
        zakat,
        iuran_koperasi,
        angsuran_koperasi,
        pinalti,
        potongan_pinjaman,
        potongan_jht,
        potongan_bpjs,
        potongan_pensiun,
        adjustment_minus,
        potongan_anggota,
        thr,
        shu,
        bonus,
        kompensasi,
        pph21,
        potongan_pph21,
        total,
    } = req.body;

    const findTipePendapatan = await tipePendapatanModel.findOne({
        where:{
            uuid:tipe_pendapatan_uuid
        }
    })

    if(!findTipePendapatan){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe pendapatan not found"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    })

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }

    try {
        await pendapatanModel.create({
            tipe_pendapatan_id:findTipePendapatan.id,
            user_id:findUser.id,
            pendapatan_atas,
            periode,
            initial_periode,
            basic_salary,
            kjk,
            tunjangan_jabatan,
            incentive,
            rapel,
            adjustment,
            overtime_allowance,
            tax,
            overtime_fee_1,
            overtime_fee_2,
            tunjangan_jht,
            tunjangan_pensiun,
            tunjangan_jkk,
            tunjangan_jkm,
            tunjangan_bpjs,
            zakat,
            iuran_koperasi,
            angsuran_koperasi,
            pinalti,
            potongan_pinjaman,
            potongan_jht,
            potongan_bpjs,
            potongan_pensiun,
            adjustment_minus,
            potongan_anggota,
            thr,
            shu,
            bonus,
            kompensasi,
            pph21,
            potongan_pph21,
            total,
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

const updateData = async(req, res) => {
    const {id} = req.params;
    const {
        tipe_pendapatan_uuid,
        user_uuid,
        pendapatan_atas,
        periode,
        initial_periode,
        basic_salary,
        kjk,
        tunjangan_jabatan,
        incentive,
        rapel,
        adjustment,
        overtime_allowance,
        tax,
        overtime_fee_1,
        overtime_fee_2,
        tunjangan_jht,
        tunjangan_pensiun,
        tunjangan_jkk,
        tunjangan_jkm,
        tunjangan_bpjs,
        zakat,
        iuran_koperasi,
        angsuran_koperasi,
        pinalti,
        potongan_pinjaman,
        potongan_jht,
        potongan_bpjs,
        potongan_pensiun,
        adjustment_minus,
        potongan_anggota,
        thr,
        shu,
        bonus,
        kompensasi,
        pph21,
        potongan_pph21,
        total,
    } = req.body;

    const findPendapatan = await pendapatanModel.findOne({
        where:{
            uuid:id
        }
    })

    if(!findPendapatan){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "pendapatan not found"
            }
        });
    }

    const findTipePendapatan = await tipePendapatanModel.findOne({
        where:{
            uuid:tipe_pendapatan_uuid
        }
    })

    if(!findTipePendapatan){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe pendapatan not found"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    })

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }

    try {
        const result = await findPendapatan.update({
            tipe_pendapatan_id:findTipePendapatan.id,
            user_id:findUser.id,
            pendapatan_atas,
            periode,
            initial_periode,
            basic_salary,
            kjk,
            tunjangan_jabatan,
            incentive,
            rapel,
            adjustment,
            overtime_allowance,
            tax,
            overtime_fee_1,
            overtime_fee_2,
            tunjangan_jht,
            tunjangan_pensiun,
            tunjangan_jkk,
            tunjangan_jkm,
            tunjangan_bpjs,
            zakat,
            iuran_koperasi,
            angsuran_koperasi,
            pinalti,
            potongan_pinjaman,
            potongan_jht,
            potongan_bpjs,
            potongan_pensiun,
            adjustment_minus,
            potongan_anggota,
            thr,
            shu,
            bonus,
            kompensasi,
            pph21,
            potongan_pph21,
            total,
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

    const findPendapatan = await pendapatanModel.findOne({
        where:{
            uuid:id
        }
    })

    if(!findPendapatan){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "pendapatan not found"
            }
        });
    }

    try {
        const result = await findPendapatan.destroy();

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


module.exports = {
    getDatas,
    getDataTable,
    getDataTableByUser,
    getDataById,
    createData,
    updateData,
    deleteData
}
