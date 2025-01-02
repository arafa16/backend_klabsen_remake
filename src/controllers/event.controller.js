const {
    event:eventModel,
    tipe_event:tipeEventModel
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
        const result = await eventModel.findAll({
            include:[
                {model:tipeEventModel}
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
    const {search, bulan, tahun, sort} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(bulan){
        queryObject.bulan = bulan
    }

    if(tahun){
        queryObject.tahun = tahun
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
        sortList =['tanggal_mulai', 'DESC'];
    }

    try {
        const result = await eventModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {model:tipeEventModel}
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

const createData = async(req, res) => {
    const {
        name,
        bulan, 
        tahun,
        tanggal_mulai,
        tanggal_selesai,
        tipe_event_id,
        note,
        code,
        is_active
    } = req.body;

    const findTipeEvent = await tipeEventModel.findOne({
        where:{
            uuid:tipe_event_id
        }
    })

    if(!findTipeEvent){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'tipe event not found'
            }
        });
    }

    try {
        await eventModel.create({
            name,  
            bulan, 
            tahun, 
            tanggal_mulai, 
            tanggal_selesai, 
            tipe_event_id:findTipeEvent.id, 
            note,
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

const getDataById = async(req, res) => {
    try {
        const result = await eventModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:tipeEventModel
                }
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

const updateData = async(req, res) => {
    const {
        name,
        bulan, 
        tahun,
        tanggal_mulai,
        tanggal_selesai,
        tipe_event_id,
        note,
        code,
        is_active
    } = req.body;

    const findData = await eventModel.findOne({
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

    const findTipeEvent = await tipeEventModel.findOne({
        where:{
            uuid:tipe_event_id
        }
    })

    if(!findTipeEvent){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: 'tipe event not found'
            }
        });
    }

    try {
        await findData.update({
            name,
            bulan, 
            tahun,
            tanggal_mulai,
            tanggal_selesai,
            tipe_event_id:findTipeEvent.id,
            note,
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

    const findData = await eventModel.findOne({
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
    createData,
    getDataById,
    updateData,
    deleteData
}