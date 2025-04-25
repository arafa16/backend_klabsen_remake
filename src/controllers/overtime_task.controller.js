const {
    overtime_task:overtimeTaskModel,
    overtime_report:overtimeReportModel,
    overtime_task_status:overtimeTaskStatusModel,
    user:userModel,
    group:groupModel,
    penempatan:penempatanModel,
    overtime_history:overtimeHistoryModel

} = require('../models/index.js');
const {Op} = require('sequelize');

const {createHistory} = require('./overtime_history.controller.js')

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='id';
    }

    try {
        const result = await overtimeTaskModel.findAll({
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
        querySearchObject.number = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.number = {[Op.like]:`%${''}%`}
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
        const result = await overtimeTaskModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel
                },
                {
                    model:overtimeTaskStatusModel
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

const getDataTableUser = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    console.log('user', req.user.id);

    if(req.user){
        queryObject.user_id = req.user.id
    }

    if(search){
        querySearchObject.number = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.number = {[Op.like]:`%${''}%`}
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
        const result = await overtimeTaskModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel
                },
                {
                    model:overtimeTaskStatusModel
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

const getDataTableAssignor = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(req.user){
        queryObject.assignor_id = req.user.id
    }

    if(search){
        querySearchObject.number = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.number = {[Op.like]:`%${''}%`}
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
        const result = await overtimeTaskModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel
                },
                {
                    model:overtimeTaskStatusModel
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
const getDataTableSuperior = async(req, res) => {
    const {search, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(req.user){
        queryObject.superior_id = req.user.id
    }

    if(search){
        querySearchObject.number = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.number = {[Op.like]:`%${''}%`}
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(page - 1) * limit;

    if(sort){
        sortList = sort;
    }else{
        sortList = 'id';
    }

    try {
        const result = await overtimeTaskModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel
                },
                {
                    model:overtimeTaskStatusModel
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

const getDataById = async(req, res) => {
    try {
        const result = await overtimeTaskModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:userModel,
                    attribute:['uuid', 'penempatan', 'group', 'nik'],
                    include:[
                        {
                            model:groupModel,
                            attribute:['uuid','name']
                        },
                        {
                            model:penempatanModel,
                            attribute:['uuid','name']
                        }
                    ]
                },
                {
                    model:overtimeTaskStatusModel,
                    attribute:['uuid','name']
                },
                {
                    model:userModel,
                    as:'assignor',
                    attribute:['uuid','name']
                },
                {
                    model:userModel,
                    as:'superior',
                    attribute:['uuid','name']
                },
                {
                    model:overtimeReportModel
                },
                {
                    model:overtimeHistoryModel,
                    include:[
                        {
                            model:userModel,
                            attribute:['uuid','name']
                        }
                    ]
                },
            ],
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
        assignor_id, 
        user_id, 
        number, 
        time_start_task, 
        time_finised_task, 
        note_task, 
        time_start_report, 
        time_finised_report, 
        note_report, 
        superior_id, 
        status_code,
        is_active
    } = req.body;

    const user = await userModel.findOne({
        where:{
            uuid:user_id
        }
    });

    const assignor = await userModel.findOne({
        where:{
            uuid:assignor_id
        }
    });

    const superior = await userModel.findOne({
        where:{
            uuid:superior_id
        }
    });

    const status = await overtimeTaskStatusModel.findOne({
        where:{
            code:status_code
        }
    });

    let formatNumber = null;

    const date = new Date();
    const year = date.getFullYear();
    const minDate = `${year}-01-01`;
    const maxDate = `${year}-12-31`;

    const findTask = await overtimeTaskModel.findAndCountAll({
        where:{
            created_at:{
                [Op.between]:[minDate, maxDate]
            }
        }
    });

    if(findTask !== null){
        const newNumber = Number(findTask.count)+1;
        formatNumber = "KLA/OVT/"+year+"/"+newNumber.toString().padStart(4,"0") ;
    }else{
        const newNumber = "1";
        formatNumber = "KLA/OVT/"+year+"/"+newNumber.toString().padStart(4,"0");
    }

    try {
        const task = await overtimeTaskModel.create({
            assignor_id:assignor.id,
            user_id:user.id,
            number:formatNumber,
            time_start:time_start_task,
            time_finised:time_finised_task,
            note:note_task,
            superior_id:superior.id,
            overtime_task_status_id:status.id,
            is_active:is_active
        });

        const report = await overtimeReportModel.create({
            overtime_task_id:task.id,
            assignor_id:assignor.id,
            user_id:user.id,
            number:formatNumber,
            time_start:time_start_report,
            time_finised:time_finised_report,
            note:note_report,
            superior_id:superior.id,
            overtime_task_report_id:status.id,
            is_active:is_active
        });

        await createHistory({
            user_id:user.id,
            overtime_task_id:task.id,
            description:`${user.name} create overtime task`
        });

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:{task, report},
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

    const findData = await overtimeTaskModel.findOne({
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

const updateStatusData = async(req, res) => {
    const {
        overtime_task_status_code,
    } = req.body;

    const findData = await overtimeTaskModel.findOne({
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

    const findStatus = await overtimeTaskStatusModel.findOne({
        where:{
            code:overtime_task_status_code
        }
    });

    if(!findStatus){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: "data not found"
            }
        });
    }

    try {
        await findData.update({
            overtime_task_status_id:findStatus.id
        });

        await createHistory({
            user_id:req.user.id,
            overtime_task_id:findData.id,
            description:`${req.user.name} did change status to ${findStatus.name}`
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

    const findData = await overtimeTaskModel.findOne({
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
    getDataTableUser,
    getDataTableAssignor,
    getDataTableSuperior,
    getDataById,
    createData,
    updateData,
    updateStatusData,
    deleteData
}