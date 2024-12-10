const {
    slider:sliderModel,
} = require('../models/index.js');
const {Op} = require('sequelize');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');


const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='sequence';
    }

    try {
        const result = await sliderModel.findAll({
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
        sortList ='sequence';
    }

    try {
        const result = await sliderModel.findAndCountAll({
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
        const result = await sliderModel.findOne({
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
        name,
        sequence,
        is_active,
        is_delete
    } = req.body;

    if(!req.files) {
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const {file} = req.files;

    if(!file) {
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    // const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const file_name = crypto.randomUUID()+ext;
    const link = `/assets/slider/${file_name}`;
    const allowed_type = ['.png','.jpg','.jpeg'];

    //filter file type
    if(!allowed_type.includes(ext.toLowerCase())){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                data: null,
                message: "type file not allowed"
            }
        });
    }

    file.mv(`./public/assets/slider/${file_name}`, async(err)=>{
        if(err){
            return res.status(500).json({
                status:500,
                success:false,
                datas: {
                    message: err.message
                }
            });
        }

        try {
            await sliderModel.create({
                name,
                file_name,
                file_link:link,
                sequence,
                is_active,
                is_delete
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
    });
}

const updateData = async(req, res) => {
    const {
        name,
        file_name,
        file_link,
        sequence,
        is_active,
        is_delete
    } = req.body;

    const findData = await sliderModel.findOne({
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
            file_name,
            file_link,
            sequence,
            is_active,
            is_delete
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

    const findData = await sliderModel.findOne({
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
        //delete foto
        if(findData.file_name !== null){
            const filePath = `./public/assets/slider/${findData.file_name}`;
            
            const fileExist = fs.existsSync(filePath)

            if(fileExist){
                fs.unlinkSync(filePath);
            }
        }

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