const {
    user_relate:userRelateModel,
    user:userModel,
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
        const result = await userRelateModel.findAll({
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
    const {search, user_uuid, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(user_uuid){
        const findUser = await userModel.findOne({
            where:{
                uuid:user_uuid
            }
        })

        if(findUser !== null){
            queryObject.user_id = findUser.id
        }
    }

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
        const result = await userRelateModel.findAndCountAll({
            where:[
                queryObject
            ],
            include:[
                {
                    model:userModel,
                    as: 'user',
                    attributes:['uuid','name', 'email', 'url_image', 'image', 'status_id']
                },
                {
                    model:userModel,
                    as: 'user_relates',
                    attributes:['uuid','name', 'email', 'url_image', 'image', 'status_id'],
                    where:[
                        querySearchObject
                    ]
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
        const result = await userRelateModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:userModel,
                    as: 'user',
                    attributes:['uuid','name', 'email', 'url_image', 'image', 'status_id']
                },
                {
                    model:userModel,
                    as: 'user_relates',
                    attributes:['uuid','name', 'email', 'url_image', 'image', 'status_id']
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
    const {user_uuid, user_relate_uuid, is_active} = req.body;

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    });

    const findUserRelate = await userModel.findOne({
        where:{
            uuid:user_relate_uuid
        }
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'user not found'
            }
        });
    }

    if(!findUserRelate){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'user relate not found'
            }
        });
    }

    try {
        await userRelateModel.create({
            user_id:findUser.id,
            user_relate_id:findUserRelate.id,
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
    const {user_uuid, user_relate_uuid, is_active} = req.body;

    const findData = await userRelateModel.findOne({
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

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    });

    const findUserRelate = await userModel.findOne({
        where:{
            uuid:user_relate_uuid
        }
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'user not found'
            }
        });
    }

    if(!findUserRelate){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'user relate not found'
            }
        });
    }

    try {
        await findData.update({
            user_id:findUser.id,
            user_relate_id:findUserRelate.id,
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

const deleteData = async(req, res) => {

    const findData = await userRelateModel.findOne({
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