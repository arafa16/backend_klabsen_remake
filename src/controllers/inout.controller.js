const {
    in_out:inOutModel,
    user:userModel,
    tipe_absen:tipeAbsenModel,
    pelanggaran:pelanggaranModel,
    status_inout:statusInoutModel,
    jam_operasional:jamOperasionalModel,
    koreksi:koreksiModel
} = require('../models/index.js');
const {Op} = require('sequelize');
const sequelize = require('sequelize');
const date = require('date-and-time');
const moment = require('moment')
const db = require('../models/index.js');

const getDataById = async(req, res) => {
    const {id} = req.params;
    try {
        const result = await inOutModel.findOne({
            where:{
                uuid:id
            },
            include:[
                {
                    model:tipeAbsenModel,
                    attributes:{
                        exclude:['id']
                    }
                },
                {
                    model:pelanggaranModel,
                    attributes:{
                        exclude:['id']
                    }
                },
                {
                    model:statusInoutModel,
                    attributes:{
                        exclude:['id']
                    }
                },
                {
                    model:jamOperasionalModel,
                    attributes:{
                        exclude:['id']
                    }
                },
                {
                    model:koreksiModel,
                    attributes:{
                        exclude:['inOutId']
                    }
                },
                {
                    model:userModel,
                    attributes:[
                        'uuid','name','email'
                    ]
                }
            ],
            attributes:{
                exclude:['id']
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

const getDataByUser = async(req, res) => {
    const {id} = req.params;
    const {tahun} = req.query;
    let year = null;


    let queryObjectYear = null;

    const findUser = await userModel.findOne({
        where:{
            uuid:id
        },
        attributes:['id', 'uuid', 'name', 'email']
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "datas not found"
            }
        });
    }

    if(tahun){
        queryObjectYear = sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal_mulai')), tahun)
        
        year = tahun;
    }else{
        const getYear = date.format(new Date(),'YYYY');
        queryObjectYear = sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal_mulai')), getYear)
        year = getYear;
    }

    try {
        const result = await inOutModel.findAll({
            where:{
                user_id:findUser.id,
                [Op.or]:[
                    queryObjectYear
                ]
            },
            attributes:['uuid','tanggal_mulai','tanggal_selesai','is_active'],
            include:[
                {
                    model:tipeAbsenModel,
                    attributes:['uuid','name','code']
                },
                {
                    model:pelanggaranModel,
                    attributes:['uuid','name','code']
                },
                {
                    model:statusInoutModel,
                    attributes:['uuid','name','code']
                },
                {
                    model:userModel,
                    attributes:['uuid','name']
                }
            ]
        });

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                data:result,
                year:year,
                user:findUser,
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

const getDataCount = async(req, res) => {
    const {uuid, tanggal_mulai, tanggal_selesai} = req.query;

    if(!uuid || !tanggal_mulai || !tanggal_selesai){
        return res.status(404).json({
            status:404,
            success: false,
            datas:{
                message:"uuid or tanggal mulai or tanggal selesai are not set",
                data:null,
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:uuid
        }
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "datas not found"
            }
        });
    }

    const start_date = date.format(new Date(tanggal_mulai), 'YYYY-MM-DD HH:mm:ss');
    const end_date = date.format(new Date(tanggal_selesai), 'YYYY-MM-DD HH:mm:ss');

    try {
        const result = await inOutModel.findAll({
            where:{
                user_id:findUser.id,
                tanggal_mulai:{
                    [Op.and]: {
                        [Op.gte]: start_date,
                        [Op.lte]: end_date,
                        }
                }
            },
            include:[
                {
                    model:tipeAbsenModel,
                    attributes:['uuid','name','code']
                },
                {
                    model:pelanggaranModel,
                    attributes:['uuid','name','code']
                }
            ]
        })

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
        user_uuid,
        tanggal_mulai,
        tanggal_selesai,
        tipe_absen_uuid,
        pelanggaran_uuid,
        status_inout_uuid,
        jam_operasional_uuid,
        is_absen_web,
        is_active   
    } = req.body;

    if(
        !user_uuid || 
        !tanggal_mulai || 
        !tanggal_selesai || 
        !tipe_absen_uuid || 
        !pelanggaran_uuid ||
        !status_inout_uuid ||
        !jam_operasional_uuid
    ){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "field can't be null"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    });

    const findTipeAbsen = await tipeAbsenModel.findOne({
        where:{
            uuid:tipe_absen_uuid
        }
    });

    const findPelanggaran = await pelanggaranModel.findOne({
        where:{
            uuid:pelanggaran_uuid
        }
    });

    const findStatusInout = await statusInoutModel.findOne({
        where:{
            uuid:status_inout_uuid
        }
    })

    const findJamOperasional = await jamOperasionalModel.findOne({
        where:{
            uuid:jam_operasional_uuid
        }
    })

    //moment
    const tanggal_mulai_moment = moment(tanggal_mulai).format('YYYY-MM-DD HH:mm:ss');
    const tanggal_selesai_moment = moment(tanggal_selesai).format('YYYY-MM-DD HH:mm:ss');

    try {
        const result = await inOutModel.create({
            user_id:findUser && findUser.id,
            tanggal_mulai:tanggal_mulai_moment,
            tanggal_selesai:tanggal_selesai_moment,
            tipe_absen_id:findTipeAbsen && findTipeAbsen.id,
            pelanggaran_id:findPelanggaran && findPelanggaran.id,
            status_inout_id:findStatusInout && findStatusInout.id,
            jam_operasional_id:findJamOperasional && findJamOperasional.id,
            is_absen_web,
            is_active
        });

        return res.status(201).json({
            status:201,
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
    const {id} = req.params;

    const {
        user_uuid,
        tanggal_mulai,
        tanggal_selesai,
        tipe_absen_uuid,
        pelanggaran_uuid,
        status_inout_uuid,
        jam_operasional_uuid,
        is_absen_web,
        is_active   
    } = req.body;

    if(
        !user_uuid || 
        !tanggal_mulai || 
        !tanggal_selesai || 
        !tipe_absen_uuid || 
        !pelanggaran_uuid ||
        !status_inout_uuid ||
        !jam_operasional_uuid
    ){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "field can't be null"
            }
        });
    }

    const findInout = await inOutModel.findOne({
        where:{
            uuid:id
        }
    })

    if(!findInout){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "user not found"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:user_uuid
        }
    });

    const findTipeAbsen = await tipeAbsenModel.findOne({
        where:{
            uuid:tipe_absen_uuid
        }
    });

    const findPelanggaran = await pelanggaranModel.findOne({
        where:{
            uuid:pelanggaran_uuid
        }
    });

    const findStatusInout = await statusInoutModel.findOne({
        where:{
            uuid:status_inout_uuid
        }
    })

    const findJamOperasional = await jamOperasionalModel.findOne({
        where:{
            uuid:jam_operasional_uuid
        }
    })

    //moment
    const tanggal_mulai_moment = moment(tanggal_mulai).format('YYYY-MM-DD HH:mm:ss');
    const tanggal_selesai_moment = moment(tanggal_selesai).format('YYYY-MM-DD HH:mm:ss');

    try {
        const result = await findInout.update({
            user_id:findUser && findUser.id,
            tanggal_mulai:tanggal_mulai_moment,
            tanggal_selesai:tanggal_selesai_moment,
            tipe_absen_id:findTipeAbsen && findTipeAbsen.id,
            pelanggaran_id:findPelanggaran && findPelanggaran.id,
            status_inout_id:findStatusInout && findStatusInout.id,
            jam_operasional_id:findJamOperasional && findJamOperasional.id,
            is_absen_web,
            is_active
        });

        return res.status(201).json({
            status:201,
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

const deleteData = async(req, res) => {
    const {id} = req.params;
    const findInout = await inOutModel.findOne({
        where:{
            uuid:id
        }
    })

    if(!findInout){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data: null,
                message: "data not found"
            }
        });
    }

    const findKoreksi = await koreksiModel.findAll({
        where:{
            in_out_id:findInout.id
        }
    })

    const t = await db.sequelize.transaction();

    try {
        await koreksiModel.destroy(
            {
                where:{
                    in_out_id:findInout.id
                }
            },
            { transaction: t }   
        )

        await findInout.destroy({ transaction: t });

        await t.commit()

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:null,
                message: "success"
            }
        });
    } catch (error) {

        await t.rollback();

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
    getDataById,
    getDataByUser,
    getDataCount,
    createData,
    updateData,
    deleteData
}