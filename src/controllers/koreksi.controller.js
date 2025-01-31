const {
    koreksi:koreksiModel,
    user:userModel,
    status_koreksi:statusKoreksiModel,
    in_out:inOutModel,
    status_inout:statusInoutModel,
    tipe_absen:tipeAbsenModel,
    pelanggaran:pelanggaranModel,
    jam_operasional:jamOperasionalModel,
    data_email:dataEmailModel
} = require('../models/index.js');
const {Op} = require('sequelize');
const db = require('../models/index.js');
const date = require('date-and-time');

const getDatas = async(req, res) => {
    const {sort, user_id, atasan_id,} = req.query;

    const queryAtasanObject = {};

    if(user_id){
        const findUser = await userModel.findOne({
            where:{
                uuid:user_id
            }
        })

        if(!findUser){
            queryObject.user_id = findUser.id; 
        }
    }

    if(atasan_id){
        const findAtasan = await userModel.findOne({
            where:{
                uuid:atasan_id
            }
        })

        if(!findAtasan){
            queryAtasanObject.atasan_id = findAtasan.id; 
        }
    }

    let sortList = {};

    if(sort){
        sortList = sort;
    }else{
        sortList ='id';
    }

    try {
        const result = await koreksiModel.findAll({
            include:[
                {
                    model:userModel,
                    attributes:['uuid','name','absen_id'],
                    where:queryAtasanObject
                },
                {
                    model:statusKoreksiModel,
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

//bisa di gunakan untuk atasan page, user page atau admin page
const getDataTable = async(req, res) => {
    const {search, user_id, atasan_id, status_code, sort} = req.query;

    const queryObject = {};
    const queryAtasanObject = {};
    const queryStatusObject = {};
    const querySearchObject = {};
    let sortList = {};

    if(status_code){
        if(status_code !== '0'){
            queryStatusObject.code = status_code
        }
    }

    if(user_id){
        console.log('user id', user_id)
        const findUser = await userModel.findOne({
            where:{
                uuid:user_id
            }
        })

        if(findUser !== null){
            queryObject.user_id = findUser.id; 
        }
    }

    if(atasan_id){
        console.log('atasan id', atasan_id)
        const findAtasan = await userModel.findOne({
            where:{
                uuid:atasan_id
            }
        })

        console.log('atasan id', findAtasan)

        if(findAtasan !== null){
            queryAtasanObject.atasan_id = findAtasan.id; 
        }
    }

    

    if(search){
        querySearchObject.id = {[Op.like]:`%${search}%`}
    }else{
        querySearchObject.id = {[Op.like]:`%${''}%`}
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
        const result = await koreksiModel.findAndCountAll({
            where:[
                queryObject,
                {[Op.or]:querySearchObject}
            ],
            include:[
                {
                    model:userModel,
                    attributes:['uuid','name','absen_id','atasan_id'],
                    where:queryAtasanObject
                },
                {
                    model:inOutModel,
                    attributes:['uuid','tanggal_mulai','tanggal_selesai']
                },
                {
                    model:statusKoreksiModel,
                    attributes:['uuid','name','code'],
                    where:queryStatusObject
                }
            ],
            limit,
            offset,
            order:[sortList]
        });

        console.log('result', result);


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
    const {user_id, in_out_id, keterangan, code_status_koreksi, is_active, code_status_inout} = req.body;

    const findUser = await userModel.findOne({
        where:{
            uuid:user_id
        },
        include:[
            {
                model:userModel,
                as: 'atasan'
            },
        ]
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }

    const findStatusKoreksi = await statusKoreksiModel.findOne({
        where:{
            code:code_status_koreksi
        }
    });

    if(!findStatusKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "status koreksi not found"
            }
        });
    }

    const findInOut = await inOutModel.findOne({
        where:{
            uuid:in_out_id
        }
    });

    if(!findInOut){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "in out not found"
            }
        });
    }

    const findStatusInout = await statusInoutModel.findOne({
        where:{
            code:code_status_inout
        }
    })

    if(!findStatusInout){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "status inout not found"
            }
        });
    }

    const t = await db.sequelize.transaction();

    try {
        const result_koreksi = await koreksiModel.create(
            {
                user_id:findUser.id,
                in_out_id:findInOut.id,
                keterangan:keterangan,
                status_koreksi_id:findStatusKoreksi.id,
                is_active:is_active
            },
            { transaction: t }
        );

        const result_inout = await findInOut.update(
            {
                status_inout_id:findStatusInout.id
            },
            { transaction: t }
        );

        const result_data_email = await dataEmailModel.create(
            {
                name:`koreksi ${findUser.name} - ${date.format(findInOut.tanggal_mulai, 'YYYY-MM-DD HH:mm:ss')}`,
                from:`<no-replay@kopkarla.co.id>`,
                to:`${findUser.atasan.email}`,
                subject:`koreksi ${findUser.name} - ${date.format(findInOut.tanggal_mulai, 'YYYY-MM-DD HH:mm:ss')}`,
                text_email:`Dear ${findUser.atasan.name}
                
                ${process.env.LINK_FRONTEND}/koreksi/view?uuid=${result_koreksi.uuid}&code=0
                
                Terima kasih.
                `,
                status_email_id:2,
                code:1,
                is_active:true
            },
            { transaction: t }
        )

        await t.commit()

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:{
                    result_koreksi,
                    result_inout,
                    result_data_email
                },
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

const getCountDatas = async(req, res) => {
    const {user_id, atasan_id} = req.query;

    let result = {};

    try {
        if(user_id){
            const user = await userModel.findOne({
                where:{
                    uuid:user_id
                }
            });
    
            if(user !== null){
    
                const pengajuan = await koreksiModel.count({
                    where:{
                        user_id:user.id
                    },
                    include:[
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:1
                            }
                        }
                    ]
                });
    
                result.pengajuan = pengajuan
    
                const approved = await koreksiModel.count({
                    where:{
                        user_id:user.id
                    },
                    include:[
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:2
                            }
                        }
                    ]
                });
    
                result.approved = approved
    
                const not_approved = await koreksiModel.count({
                    where:{
                        user_id:user.id
                    },
                    include:[
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:3
                            }
                        }
                    ]
                });
    
                result.not_approved = not_approved

                const all = await koreksiModel.count({
                    where:{
                        user_id:user.id
                    }
                });
    
                result.all = all
            }
        }
    
        if(atasan_id){
            const findAtasan = await userModel.findOne({
                where:{
                    uuid:atasan_id
                }
            });
    
            if(findAtasan !== null){
    
                const pengajuan = await koreksiModel.count({
                    include:[
                        {
                            model:userModel,
                            where:{
                                atasan_id:findAtasan.id
                            }
                        },
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:1
                            }
                        }
                    ]
                });
    
                result.pengajuan = pengajuan
    
                const approved = await koreksiModel.count({
                    include:[
                        {
                            model:userModel,
                            where:{
                                atasan_id:findAtasan.id
                            }
                        },
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:2
                            }
                        }
                    ]
                });
    
                result.approved = approved
    
                const not_approved = await koreksiModel.count({
                    include:[
                        {
                            model:userModel,
                            where:{
                                atasan_id:findAtasan.id
                            }
                        },
                        {
                            model:statusKoreksiModel,
                            where:{
                                code:3
                            }
                        }
                    ]
                });
    
                result.not_approved = not_approved

                const all = await koreksiModel.count({
                    include:[
                        {
                            model:userModel,
                            where:{
                                atasan_id:findAtasan.id
                            }
                        }
                    ]
                });
    
                result.all = all
            }
        }
    
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

const createDataByDate = async(req, res) => {
    const {
        user_id, 
        tanggal_mulai, 
        tanggal_selesai, 
        tipe_absen_id, 
        code_pelanggaran, 
        keterangan, 
        code_status_koreksi, 
        is_active, 
        code_status_inout, 
        jam_operasional_id, 
        is_absen_web
    } = req.body;
    
    const findUser = await userModel.findOne({
        where:{
            uuid:user_id
        },
        include:[
            {
                model:userModel,
                as: 'atasan'
            },
        ]
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }
    const findStatusKoreksi = await statusKoreksiModel.findOne({
        where:{
            code:code_status_koreksi
        }
    });

    if(!findStatusKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "status koreksi not found"
            }
        });
    }

    const findTipeAbsen = await tipeAbsenModel.findOne({
        where:{
            uuid:tipe_absen_id
        }
    });

    if(!findTipeAbsen){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "tipe absen not found"
            }
        });
    }

    const findPelanggaran = await pelanggaranModel.findOne({
        where:{
            code:code_pelanggaran
        }
    });

    if(!findPelanggaran){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "pelanggaran not found"
            }
        });
    }

    const findStatusInout = await statusInoutModel.findOne({
        where:{
            code:code_status_inout
        }
    })

    if(!findStatusInout){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "status inout not found"
            }
        });
    }

    const findJamOperasional = await jamOperasionalModel.findOne({
        where:{
            uuid:jam_operasional_id
        }
    });

    if(!findJamOperasional){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "jam operasional not found"
            }
        });
    }

    // const msg = {
    //     from: '"Support IT Kopkarla" <no-replay@kopkarla.co.id>',
    //     to: user.atasan.email,
    //     subject: "Koreksi Absen",
    //     text: 
    //     `${user.name} membuat koreksi absen approver atas nama anda, please check in aplikasi`
    // };

    const t = await db.sequelize.transaction();

    try {
        const result_create_inout = await inOutModel.create(
            {
                user_id:findUser && findUser.id,
                tanggal_mulai:tanggal_mulai,
                tanggal_selesai:tanggal_selesai,
                tipe_absen_id:findTipeAbsen && findTipeAbsen.id,
                pelanggaran_id: findPelanggaran && findPelanggaran.id,
                status_inout_id:findStatusInout && findStatusInout.id,
                jam_operasional_id:findJamOperasional && findJamOperasional.id,
                is_absen_web:is_absen_web
            },
            { transaction: t }
        );

        // await Koreksi.create({
        //     userId:user && user.id,
        //     inOutId:createInOut.id,
        //     keterangan:keterangan,
        //     statusKoreksiId:statusKoreksi && statusKoreksi.id,
        //     isActive:isActive
        // });

        const result_koreksi = await koreksiModel.create(
            {
                user_id:findUser && findUser.id,
                in_out_id:result_create_inout.id,
                keterangan:keterangan,
                status_koreksi_id:findStatusKoreksi && findStatusKoreksi.id,
                is_active:is_active
            },
            { transaction: t }
        );

        const result_data_email = await dataEmailModel.create(
            {
                name:`Koreksi Absen ${findUser.name} - ${date.format(result_create_inout.tanggal_mulai, 'YYYY-MM-DD HH:mm:ss')}`,
                from:`<no-replay@kopkarla.co.id>`,
                to:`${findUser.atasan.email}`,
                subject:`Koreksi Absen ${findUser.name} - ${date.format(result_create_inout.tanggal_mulai, 'YYYY-MM-DD HH:mm:ss')}`,
                text_email:`Dear ${findUser.atasan.name} ${process.env.LINK_FRONTEND}/koreksi/view?uuid=${result_koreksi.uuid}&code=0`,
                status_email_id:2,
                code:1,
                is_active:true
            },
            { transaction: t }
        )

        await t.commit()

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:{
                    result_koreksi,
                    result_create_inout,
                    result_data_email
                },
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

const getDataById = async(req, res) => {
    try {
        const result = await koreksiModel.findOne({
            where:{
                uuid:req.params.id
            },
            include:[
                {
                    model:userModel,
                    attributes:['uuid','name'],
                    include:[
                        {
                            model:userModel,
                            as:'atasan',
                            attributes:['uuid','name']
                        }
                    ]
                },
                {
                    model:inOutModel,
                    attributes:['uuid','tanggal_mulai','tanggal_selesai'],
                    includes:[
                        {
                            model:tipeAbsenModel,
                            attributes:['uuid','name','code']
                        },{
                            model:pelanggaranModel,
                            attributes:['uuid','name','code']
                        },
                        {
                            model:statusInoutModel,
                            attributes:['uuid','name','code']
                        }
                    ]
                },
                {
                    model:statusKoreksiModel,
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

const updateData = async(req, res) => {
    const {user_id, in_out_id, keterangan, status_koreksi_id, is_active} = req.body;
    
    const findKoreksi = await koreksiModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "koreksi not found"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            uuid:user_id
        }
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }

    const findStatusKoreksi = await statusKoreksiModel.findOne({
        where:{
            uuid:status_koreksi_id
        }
    });

    if(!findStatusKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "status koreksi not found"
            }
        });
    }

    const findInOut = await inOutModel.findOne({
        where:{
            uuid:in_out_id
        }
    });

    if(!findInOut){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "in out not found"
            }
        });
    }

    try {
        const result = findKoreksi.update({
            user_id:findUser && findUser.id,
            in_out_id:findInOut && findInOut.id,
            keterangan:keterangan,
            status_koreksi_id:findStatusKoreksi && findStatusKoreksi.id,
            is_active:is_active
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

const approvalData = async(req, res) => {
    const {code} = req.body;
    
    const findKoreksi = await koreksiModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "koreksi not found"
            }
        });
    }

    const findStatusKoreksi = await statusKoreksiModel.findOne({
        where:{
            code:code
        }
    });

    if(!findStatusKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "status koreksi not found"
            }
        });
    }

    try {
        const result = findKoreksi.update({
            status_koreksi_id:findStatusKoreksi.id
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
    const findKoreksi = await koreksiModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findKoreksi){
        return res.status(404).json({
            status:404,
            success:true,
            datas: {
                data:null,
                message: "koreksi not found"
            }
        });
    }
    
    try {
        const result = findKoreksi.destroy();

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

module.exports = {
    getDatas,
    getDataTable,
    getCountDatas,
    getDataById,
    createData,
    createDataByDate,
    updateData,
    deleteData,
    approvalData
}