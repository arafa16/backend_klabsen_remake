const {data_email : dataEmailModel, status_email:statusEmailModel} = require('../models');
const {Op} =require('sequelize');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='name';
    }

    try {
        const result = await dataEmailModel.findAll({
            include:[
                {
                    model:statusEmailModel,
                    attributes:['uuid','name','code']
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
        sortList ='id';
    }

    try {
        const result = await dataEmailModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:statusEmailModel,
                    attributes:['uuid','name','code']
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
        const result = await dataEmailModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:statusEmailModel,
                    attributes:['uuid','name','code']
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
        name,
        from,
        to,
        subject,
        text_email,
        status_email_id,
        code,
        is_active
    } = req.body;

    try {
        await dataEmailModel.create({
            name,
            from,
            to,
            subject,
            text_email,
            status_email_id,
            code,
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
        name,
        from,
        to,
        subject,
        text_email,
        status_email_id,
        code,
        is_active
    } = req.body;

    const findData = await dataEmailModel.findOne({
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
            name,
            from,
            to,
            subject,
            text_email,
            status_email_id,
            code,
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

    const findData = await dataEmailModel.findOne({
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