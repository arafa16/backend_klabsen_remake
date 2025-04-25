const {
    overtime_report:overtimeReportModel,
} = require('../models/index.js');
const {Op} = require('sequelize');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='name';
    }

    try {
        const result = await overtimeReportModel.findAll({
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
        querySearchObject.name = {[Op.like]:`%${search}%`}
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
        const result = await overtimeReportModel.findAndCountAll({
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
        const result = await overtimeReportModel.findOne({
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
        overtime_task_id, 
        assignor_id, 
        user_id, 
        number, 
        time_start, 
        time_finised, 
        note, 
        superior_id, 
        overtime_report_status_id, 
        is_active
    } = req.body;

    try {
        await overtimeReportModel.create({
            overtime_task_id:overtime_task_id,
            assignor_id:assignor_id,
            user_id:user_id,
            number:number,
            time_start:time_start,
            time_finised:time_finised,
            note:note,
            superior_id:superior_id,
            overtime_report_status_id:overtime_report_status_id,
            is_active:is_active
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
        overtime_task_id, 
        assignor_id, 
        user_id, 
        number, 
        time_start, 
        time_finised, 
        note, 
        superior_id, 
        overtime_report_status_id, 
        is_active
    } = req.body;

    const findData = await overtimeReportModel.findOne({
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
            overtime_task_id,
            assignor_id,
            user_id,
            number,
            time_start,
            time_finised,
            note,
            superior_id,
            overtime_report_status_id,
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

    const findData = await overtimeReportModel.findOne({
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