const {
    jam_operasional:jamOperasionalModel,
    jam_operasional_group:jamOperasionalGroupModel
} = require('../models/index.js');
const {Op, where} = require('sequelize');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='name';
    }

    try {
        const result = await jamOperasionalModel.findAll({
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
        const result = await jamOperasionalModel.findAndCountAll({
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
        const result = await jamOperasionalModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:jamOperasionalGroupModel
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
        jam_operasional_group_id,
        name,
        jam_masuk,
        jam_pulang,
        keterangan,
        code,
        is_active
    } = req.body;

    const find_jam_operasional_group = await jamOperasionalGroupModel.findOne({
        where:{
            uuid:jam_operasional_group_id
        }
    });

    if(!find_jam_operasional_group){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "jam operasional not found"
            }
        });
    }

    try {
        await jamOperasionalModel.create({
            jam_operasional_group_id:find_jam_operasional_group.id,
            name,
            jam_masuk,
            jam_pulang,
            keterangan,
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
        jam_operasional_group_id,
        name,
        jam_masuk,
        jam_pulang,
        keterangan,
        code,
        is_active
    } = req.body;

    const findData = await jamOperasionalModel.findOne({
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

    const find_jam_operasional_group = await jamOperasionalGroupModel.findOne({
        where:{
            uuid:jam_operasional_group_id
        }
    });

    if(!find_jam_operasional_group){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "jam operasional not found"
            }
        });
    }

    try {
        await findData.update({
            jam_operasional_group_id:find_jam_operasional_group.id,
            name,
            jam_masuk,
            jam_pulang,
            keterangan,
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

    const findData = await jamOperasionalModel.findOne({
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