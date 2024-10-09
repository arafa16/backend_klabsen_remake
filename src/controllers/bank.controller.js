const {
    bank:bankModel,
} = require('../models/index.js');
const {Op, where} = require('sequelize');

const getBankTable = async(req, res) => {
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
        const result = await bankModel.findAndCountAll({
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

const getBankById = async(req, res) => {
    try {
        const result = await bankModel.findOne({
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

const createBank = async(req, res) => {
    const {name, code, is_active} = req.body;

    try {
        await bankModel.create({
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

const updateBank = async(req, res) => {
    const {name, code, is_active} = req.body;

    const findBank = await bankModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findBank){
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                message: "bank is't found"
            }
        });
    }

    try {
        await findBank.update({
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

const deleteBank = async(req, res) => {

    const findBank = await bankModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findBank){
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                message: "bank is't found"
            }
        });
    }

    try {
        await findBank.destroy();

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
    getBankTable,
    getBankById,
    createBank,
    updateBank,
    deleteBank
}