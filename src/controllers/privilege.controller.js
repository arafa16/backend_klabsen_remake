const {
    privilege:privilegeModel,
} = require('../models/index.js');
const {Op} = require('sequelize');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='id';
    }

    try {
        const result = await privilegeModel.findAll({
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

const getDataTable = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(search){
        querySearchObject.id = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.id = {[Op.like]:`%${''}%`}
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(page - 1) * limit;

    if(sort){
        sortList = sort;
    }else{
        sortList ='id';
    }

    try {
        const result = await privilegeModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
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

const getDataById = async(req, res) => {
    try {
        const result = await privilegeModel.findOne({
            where:{
                uuid:req.params.id
            }
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
        dashboard,
        edit_user_sub,
        absen,
        kalendar_sub,
        pengajuan_koreksi_sub,
        approval_koreksi_sub,
        approval_all_koreksi_sub,
        absen_modal,
        wfh_modal,
        shift_modal,
        absen_check,
        admin_event,
        perhitungan_absen,
        slip_gaji,
        pendapatan_sub,
        pendapatan_lain_sub,
        pendapatan_admin_sub,
        employees,
        data_employee,
        attribute,
        setting,
        is_active
    } = req.body;

    try {
        await privilegeModel.create({
            dashboard,
            edit_user_sub,
            absen,
            kalendar_sub,
            pengajuan_koreksi_sub,
            approval_koreksi_sub,
            approval_all_koreksi_sub,
            absen_modal,
            wfh_modal,
            shift_modal,
            absen_check,
            admin_event,
            perhitungan_absen,
            slip_gaji,
            pendapatan_sub,
            pendapatan_lain_sub,
            pendapatan_admin_sub,
            employees,
            data_employee,
            attribute,
            setting,
            is_active
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
    const {
        dashboard,
        edit_user_sub,
        absen,
        kalendar_sub,
        pengajuan_koreksi_sub,
        approval_koreksi_sub,
        approval_all_koreksi_sub,
        absen_modal,
        wfh_modal,
        shift_modal,
        absen_check,
        admin_event,
        perhitungan_absen,
        slip_gaji,
        pendapatan_sub,
        pendapatan_lain_sub,
        pendapatan_admin_sub,
        employees,
        data_employee,
        attribute,
        setting,
        is_active
    } = req.body;

    const findData = await privilegeModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findData){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: "data isn't found"
            }
        });
    }

    try {
        await findData.update({
            dashboard,
            edit_user_sub,
            absen,
            kalendar_sub,
            pengajuan_koreksi_sub,
            approval_koreksi_sub,
            approval_all_koreksi_sub,
            absen_modal,
            wfh_modal,
            shift_modal,
            absen_check,
            admin_event,
            perhitungan_absen,
            slip_gaji,
            pendapatan_sub,
            pendapatan_lain_sub,
            pendapatan_admin_sub,
            employees,
            data_employee,
            attribute,
            setting,
            is_active
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

const deleteData = async(req, res) => {

    const findData = await privilegeModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findData){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: "bank isn't found"
            }
        });
    }

    try {
        await findData.destroy();

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
    getDatas,
    getDataTable,
    getDataById,
    createData,
    updateData,
    deleteData
}