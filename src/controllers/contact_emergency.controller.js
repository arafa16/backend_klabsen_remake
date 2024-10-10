const {
    contact_emergency:contactEmergencyModel,
} = require('../models/index.js');
const {Op} = require('sequelize');

const getContactEmergencyTable = async(req, res) => {
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
        const result = await contactEmergencyModel.findAndCountAll({
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
            data: {
                data:result,
                message: "success"
            }
        });
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error.message
            }
        });
    }
}

const getContactEmergencyById = async(req, res) => {
    try {
        const result = await contactEmergencyModel.findOne({
            where:{
                uuid:req.params.id
            }
        });

        return res.status(200).json({
            status:200,
            success:true,
            data: {
                data:result,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error.message
            }
        });
    }
}

const createContactEmergencyById = async(req, res) => {
    const {name, code, is_active} = req.body;

    try {
        await contactEmergencyModel.create({
            name:name,
            code:code,
            is_active:is_active
        });

        return res.status(201).json({
            status:201,
            success:true,
            data: {
                data:null,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error.message
            }
        });
    }
}

const updateContactEmergency = async(req, res) => {
    const {name, code, is_active} = req.body;

    const findData = await contactEmergencyModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findData){
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                message: "bank is't found"
            }
        });
    }

    try {
        await findData.update({
            name:name,
            code:code,
            is_active:is_active
        });

        return res.status(201).json({
            status:201,
            success:true,
            data: {
                data:null,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error.message
            }
        });
    }
}

const deleteContactEmergency = async(req, res) => {

    const findData = await contactEmergencyModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findData){
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                message: "bank is't found"
            }
        });
    }

    try {
        await findData.destroy();

        return res.status(201).json({
            status:201,
            success:true,
            data: {
                data:null,
                message: "success"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            data: {
                message: error.message
            }
        });
    }
}

module.exports = {
    getContactEmergencyTable,
    getContactEmergencyById,
    createContactEmergencyById,
    updateContactEmergency,
    deleteContactEmergency
}