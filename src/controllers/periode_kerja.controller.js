const {
    periode_kerja:periodeKerjaModel,
    in_out:inOutModel,
    user:userModel,
    status_inout:statusInoutModel,
    pelanggaran:pelanggaranModel,
    tipe_absen:tipeAbsenModel,
    jam_operasional:jamOperasionalModel
} = require('../models/index.js');
const {Op} = require('sequelize');
const date = require('date-and-time');

const getDatas = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='code';
    }

    try {
        const result = await periodeKerjaModel.findAll({
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

const getDataSelect = async(req, res) => {
    const {sort} = req.query;

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='code';
    }

    try {
        const result = await periodeKerjaModel.findAll({
            where:{
                is_active:true
            },
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
    const {search, sort, is_active} = req.query;

    const queryObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(is_active){
        queryObject.is_active = is_active
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
        sortList =['code', 'DESC'];
    }

    try {
        const result = await periodeKerjaModel.findAndCountAll({
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
        const result = await periodeKerjaModel.findOne({
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

const getDataByIdForInOut = async(req, res) => {
    try {
        const findPeriodeKerja = await periodeKerjaModel.findOne({
            where:{
                uuid:req.params.id
            }
        });

        const findUser = await userModel.findOne({
            where:{
                uuid:req.params.userId
            }
        });

        let data_in = [];
        let data_out = [];

        const startDate = date.format(new Date(findPeriodeKerja.tanggal_mulai), 'YYYY-MM-DD HH:mm:ss');
        const endDate = date.format(new Date(findPeriodeKerja.tanggal_selesai), 'YYYY-MM-DD HH:mm:ss');

        const getDataInOut = await inOutModel.findAll({
            where:{
                user_id:findUser.id,
                tanggal_mulai:{
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                        }
                }
            },
            attributes:['tanggal_mulai', 'tanggal_selesai'],
            include:[  
                {
                    model:tipeAbsenModel,
                    attributes:['name','code']
                },
                {
                    model:statusInoutModel,
                    attributes:['name','code']
                },
                {
                    model:pelanggaranModel,
                    attributes:['name','code']
                },
                {
                    model:jamOperasionalModel,
                    attributes:['name','jam_masuk','jam_pulang','code']
                }
            ]
        })

        for(const data in getDataInOut){
            if(getDataInOut[data].tipe_absen.code === 0){
                const startDate = date.format(new Date(getDataInOut[data].tanggal_mulai), 'YYYY-MM-DD');

                let makeTimeStart = null;

                if(getDataInOut[data].jam_operasional !== null){
                    makeTimeStart = new Date(`${startDate}`+' '+`${getDataInOut[data].jam_operasional.jam_pulang}`);
                }
                
                // console.log(getDataInOut[data].jam_operasional.jam_pulang, 'jam pulang 1');
                // let makeTimeStart = new Date(`${startDate}`+' '+`${getDataInOut[data].jam_operasional.jam_pulang}`);
                // console.log(getDataInOut[data].jam_operasional.jam_pulang, 'jam pulang')
                // console.log(makeTimeStart, 'makeTimeStart')

                data_in.push(
                    // getDataInOut[data]
                    {
                        tanggal_mulai:getDataInOut[data].tanggal_mulai,
                        time_start:makeTimeStart
                    }
                )
            }
            else if(getDataInOut[data].tipe_absen.code === 1){
                data_out.push(
                    // getDataInOut[data]
                    {
                        tanggal_mulai:getDataInOut[data].tanggal_mulai
                    }
                )
            }
        }

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                data:{
                    data_in, data_out
                },
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
        jumlah_hari, 
        code, 
        is_active
    } = req.body;

    try {
        await periodeKerjaModel.create({
            name:name,
            bulan:bulan,
            tahun:tahun,
            tanggal_mulai:tanggal_mulai,
            tanggal_selesai:tanggal_selesai,
            jumlah_hari:jumlah_hari,
            code:code,
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
        name,
        bulan,
        tahun,
        tanggal_mulai,
        tanggal_selesai,
        jumlah_hari, 
        code, 
        is_active
    } = req.body;

    const findData = await periodeKerjaModel.findOne({
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
            name:name,
            bulan:bulan,
            tahun:tahun,
            tanggal_mulai:tanggal_mulai,
            tanggal_selesai:tanggal_selesai,
            jumlah_hari:jumlah_hari,
            code:code,
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

    const findData = await periodeKerjaModel.findOne({
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
    getDataSelect,
    getDataTable,
    getDataById,
    getDataByIdForInOut,
    createData,
    updateData,
    deleteData
}