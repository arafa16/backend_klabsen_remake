const {
    in_out:inOutModel,
    user:userModel,
    tipe_absen:tipeAbsenModel,
    pelanggaran:pelanggaranModel,
    status_inout:statusInoutModel,
    jam_operasional:jamOperasionalModel,
    jam_operasional_group:jamOperasionalGroupModel,
} = require('../models/index.js');
const {Op} = require('sequelize');
const date = require('date-and-time');
const moment = require('moment')

const findUserById = async(datas) =>{

    const result = await userModel.findOne({
        where:{
            uuid:datas.uuid
        },
        include:[
            {
                model:jamOperasionalGroupModel,
                attributes:['id','code']
            }
        ],
        attributes:['id','absen_id', 'jam_operasional_group_id']
    });

    return result
}

const findUserByPin = async(datas) =>{

    const result = await userModel.findOne({
        where:{
            absen_id:datas.absen_id
        },
        include:[
            {
                model:jamOperasionalGroupModel,
                attributes:['id','code']
            }
        ],
        attributes:['id','absen_id']
    });

    return result
}

const findTipeAbsen = async(datas) =>{

    const result = await tipeAbsenModel.findOne({
        where:{
            code:datas.code
        }
    });

    return result
}

const findIn = async(datas) => {
    const result = await inOutModel.findOne({
        where:{
            user_id:datas.user_id,
            tanggal_mulai:{
                [Op.and]: {
                    [Op.gte]: datas.dateFormat + ' 00:00:00',
                    [Op.lte]: datas.dateFormat + ' 23:59:59',
                }
            }
        },
        include:[
            {
                model:tipeAbsenModel,
                where:{
                    code: { [Op.in]: datas.code }
                }
            },
            {
                model:jamOperasionalModel
            }
        ]
    })

    return result
}

const findInOut = async(datas) =>{

    const result = await inOutModel.findOne({
        where:{
            user_id:datas.user_id,
            tanggal_mulai:{
                [Op.and]: {
                    [Op.gte]: datas.date_format + ' 00:00:00',
                    [Op.lte]: datas.date_format + ' 23:59:59',
                }
            },
        },
        include:[
            {
                model:tipeAbsenModel,
                where:{
                    code: { [Op.in]: datas.code}
                }
            },
            {
                model:userModel,
                attributes:[
                    'id',
                    'uuid',
                    'name',
                    'email',
                    'jam_operasional_group_id',
                    'status_id',
                    'is_atasan'
                ]
            },
            {
                model:jamOperasionalModel,
            }
        ]
    })
    
    return result
}

const findJamOperasionals = async(datas) =>{

    const result = await jamOperasionalModel.findOne({
        where:{
            jam_masuk:{ [Op.gte]: datas.time_format },
            jam_operasional_group_id:datas.jam_operasional_group_id,
            is_active:1
        }
    })

    return result
}

const findJamOperasionalGroup = async(datas) => {

    const result = await jamOperasionalGroupModel.findOne({
        where:{
            code:datas.code
        }
    })

    return result;
}

const findJamOperasionalPulang = async(datas) => {

    const result = await jamOperasionalModel.findOne({
        where:{
            jam_pulang:{ 
                [Op.lte]: datas.timeFormat 
            },
            jam_operasional_group_id:datas.jamOperasionalGroupId
        }
    })

    return result;
}

const findJamOperasionalsTerakhir = async(datas) => {

    const result = await jamOperasionalModel.findAll({
        limit:1,
        where:{
            jam_operasional_group_id:datas.jam_operasional_group_id,
            is_active:1
        },
        order: [ [ 'code', 'DESC' ]]
    });

    return result
}

const findDataTidakAbsenDouble = async(datas) => {

    const result = await inOutModel.findAll({
        where:{
            user_id:datas.user_id,
            tanggal_mulai:
            {
                [Op.and]: {
                    [Op.gte]: datas.date_format + ' 00:00:00',
                    [Op.lte]: datas.date_format + ' 23:59:59',
                }
            }
        },
        include:{
            model:tipeAbsenModel,
            where:{
                code: { [Op.in]: [11]}
            }
        }
    });

    if(result.length > 0){
        await result[0].destroy();
    }

    return result
}

const findDataOutDouble = async(datas) => {
    const result = await inOutModel.findAll({
        where:{
            user_id:datas.user_id,
            tanggal_mulai:
            {
                [Op.and]: {
                    [Op.gte]: datas.date_format + ' 00:00:00',
                    [Op.lte]: datas.date_format + ' 23:59:59',
                }
            }
        },
        include:{
            model:tipeAbsenModel,
            where:{
                code: { [Op.in]: datas.code_pulang}
            }
        }
    });

    if(result.length > 1){
        await result[1].destroy();
    }

    return result
}

const uploadAbsen = async(datas) =>{
    

    const result = await inOutModel.create({
        user_id:datas.user_id,
        tipe_absen_id:datas.tipe_absen_id,
        tanggal_mulai:datas.tanggal_mulai,
        tanggal_selesai:datas.tanggal_selesai,
        latitude:datas.latitude, 
        longitude:datas.longitude,
        pelanggaran_id:datas.pelanggaran_id,
        status_inout_id:datas.status_inout_id,
        jam_operasional_id:datas.jam_operasional_id,
    });

    return result
}


// absen masuk
const executionCodeMasuk = async(datas) => {
    let data_result = null;
    
    const tipeAbsen = await findTipeAbsen({code:datas.code_tipe_absen})

    if(!tipeAbsen){
        return data_result = {
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe absen not found"
            }
        }
    }

    const inOut = await findInOut({ 
        user_id:datas.user.id,
        tipe_absen_id:tipeAbsen.id,
        date_format:datas.date_format,
        code:datas.code_masuk
    });

    if(!inOut){
        //delete data tidak absen jika ada
        await findDataTidakAbsenDouble({
            user_id:datas.user.id,
            date_format:datas.date_format
        })

        const jamOperasional = await findJamOperasionals({
            time_format:datas.time_format, 
            jam_operasional_group_id:datas.user.jam_operasional_group.id
        });

        //jika telat
        if(!jamOperasional){
            const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                jam_operasional_group_id:datas.user.jam_operasional_group.id
            });

            const result = await uploadAbsen({
                user_id:datas.user.id,
                tipe_absen_id:tipeAbsen.id,
                tanggal_mulai:datas.date_time_format,
                tanggal_selesai:datas.date_time_format,
                latitude:datas.latitude, 
                longitude:datas.longitude,
                pelanggaran_id:2,
                status_inout_id:1,
                jam_operasional_id:jamOperasionalTerakhir[0].id,
            })

            return data_result = {
                status:201,
                success:true,
                datas: {
                    data: result,
                    message: "success",
                    note: "masuk telat"
                }
            }

        }

        //jika absen normal
        else{
            const result = await uploadAbsen({
                user_id:datas.user.id,
                tipe_absen_id:tipeAbsen.id,
                tanggal_mulai:datas.date_time_format,
                tanggal_selesai:datas.date_time_format,
                latitude:datas.latitude, 
                longitude:datas.longitude,
                pelanggaran_id:1,
                status_inout_id:1,
                jam_operasional_id:jamOperasional.id,
            })

            data_result = {
                status:201,
                success:true,
                datas: {
                    data: result,
                    message: "success",
                    note: "masuk normal"
                }
            }
        }
    }
    else{
        data_result = {
            status:200,
            success:true,
            datas: {
                data: inOut,
                message: "anda sudah absen",
                note: "sudah absen"
            }
        }

    }

    return data_result
}

// absen pulang
const executionCodePulang = async(datas) => {
    let data_result = null;

    const tipeAbsen = await findTipeAbsen({code:datas.code_tipe_absen})

    if(!tipeAbsen){
        return data_result = {
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe absen not found"
            }
        }
    }

    const inOut = await findInOut({ 
        user_id:datas.user.id,
        tipe_absen_id:tipeAbsen.id,
        date_format:datas.date_format,
        code:datas.code_pulang
    });

    const tidakAbsen = await findTipeAbsen({code:11})

    if(!inOut){
        const inCheck = await findInOut({
            user_id:datas.user.id,
            tipe_absen_id:tipeAbsen.id,
            date_format:datas.date_format,
            code:datas.code_masuk
        })

        if(!inCheck){
            const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                jam_operasional_group_id:datas.user.jam_operasional_group.id
            });

            if(jamOperasionalTerakhir[0].jam_pulang < datas.time_format){

                const uploadAbsenTidakMasuk = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tidakAbsen.id,
                    tanggal_mulai:datas.date_format+ ' 00:00:00',
                    tanggal_selesai:datas.date_format+ ' 00:00:00',
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                const uploadAbsenPulangNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    latitude:datas.latitude, 
                    longitude:datas.longitude,
                    pelanggaran_id:1,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenTidakMasuk,
                            uploadAbsenPulangNormal
                        },
                        message: "success",
                        note: "pulang normal, tapi tidak absen masuk"
                    }
                }
            }
            else{
                const uploadAbsenTidakMasuk = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tidakAbsen.id,
                    tanggal_mulai:datas.date_format+ ' 00:00:00',
                    tanggal_selesai:datas.date_format+ ' 00:00:00',
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                const uploadAbsenPulangNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    latitude:datas.latitude, 
                    longitude:datas.longitude,
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenTidakMasuk,
                            uploadAbsenPulangNormal
                        },
                        message: "success",
                        note: "pulang pelanggaran, tidak absen masuk "
                    }
                }
            }
        }
        else{
            if(inCheck.jam_operasional.jam_pulang < datas.time_format){
                const uploadAbsenNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    latitude:datas.latitude, 
                    longitude:datas.longitude,
                    pelanggaran_id:1,
                    status_inout_id:1,
                    jam_operasional_id:inCheck.jam_operasional_id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenNormal
                        },
                        message: "success",
                        note: "absen masuk ada, pulang normal"
                    }
                }
            }
            else{
                const uploadAbsenNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    latitude:datas.latitude, 
                    longitude:datas.longitude,
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:inCheck.jam_operasional_id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenNormal
                        },
                        message: "success",
                        note: "absen masuk ada, pulang pelanggaran"
                    }
                }
            }
        }
    }
    else{
        await findDataOutDouble({
            user_id:datas.user.id,
            date_format:datas.date_format,
            code_pulang:datas.code_pulang
        })
        
        return data_result = {
            status:201,
            success:true,
            datas: {
                data: inOut,
                message: "anda sudah absen",
                note: "sudah absen"
            }
        }
    }

}

// absen masuk shift 
const executionCodeShiftMasuk = async(datas) => {
    let data_result = null;
    
    const tipeAbsen = await findTipeAbsen({code:datas.code_tipe_absen})

    if(!tipeAbsen){
        return data_result = {
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe absen not found"
            }
        }
    }

    const inOut = await findInOut({ 
        user_id:datas.user.id,
        tipe_absen_id:tipeAbsen.id,
        date_format:datas.date_format,
        code:datas.code_masuk_shift
    });

    if(!inOut){
        const jamOperasionalGroup = await findJamOperasionalGroup({code:3});

        if(!jamOperasionalGroup){
            return data_result = {
                status:404,
                success:false,
                datas: {
                    data:null,
                    message: "jam operasional group not found"
                }
            }
        }

        const jamOperasional = await findJamOperasionals({
            time_format:datas.time_format, 
            jam_operasional_group_id:jamOperasionalGroup.id
        });


        if(!jamOperasional){
            const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                jam_operasional_group_id:jamOperasionalGroup.id
            });

            const uploadAbsenTelat = await uploadAbsen({
                user_id:datas.user.id,
                tipe_absen_id:tipeAbsen.id,
                tanggal_mulai:datas.date_time_format,
                tanggal_selesai:datas.date_time_format,
                pelanggaran_id:2,
                status_inout_id:1,
                jam_operasional_id:jamOperasionalTerakhir[0].id,
            });

            return data_result = {
                status:201,
                success:true,
                datas: {
                    data: {
                        uploadAbsenTelat
                    },
                    message: "success",
                    note: "masuk telat"
                }
            }
        }
        //jika absen normal
        else{
            const result = await uploadAbsen({
                user_id:datas.user.id,
                tipe_absen_id:tipeAbsen.id,
                tanggal_mulai:datas.date_time_format,
                tanggal_selesai:datas.date_time_format,
                pelanggaran_id:1,
                status_inout_id:1,
                jam_operasional_id:jamOperasional.id,
            })

            data_result = {
                status:201,
                success:true,
                datas: {
                    data: result,
                    message: "success",
                    note: "masuk normal"
                }
            }
        }
    }

    return data_result = {
        status:201,
        success:true,
        datas: {
            data: inOut,
            message: "success",
            note: "sudah absen"
        }
    }

}

// absen pulang shift
const executionCodeShiftPulang = async(datas) => {
    let data_result = null;

    const tipeAbsen = await findTipeAbsen({code:datas.code_tipe_absen})

    if(!tipeAbsen){
        return data_result = {
            status:404,
            success:false,
            datas: {
                data:null,
                message: "tipe absen not found"
            }
        }
    }

    const inOut = await findInOut({ 
        user_id:datas.user.id,
        tipe_absen_id:tipeAbsen.id,
        date_format:datas.date_format,
        code:datas.code_pulang_shift
    });

    if(!inOut){
        const jamOperasionalGroup = await findJamOperasionalGroup({code:3});

        if(!jamOperasionalGroup){
            return data_result = {
                status:404,
                success:false,
                datas: {
                    data:null,
                    message: "jam operasional group not found"
                }
            }
        }

        const inCheck = await findInOut({
            user_id:datas.user.id,
            tipe_absen_id:tipeAbsen.id,
            date_format:datas.date_format,
            code:datas.code_masuk_shift
        })

        if(!inCheck){
            const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                jam_operasional_group_id:jamOperasionalGroup.id
            });

            if(jamOperasionalTerakhir[0].jam_pulang < datas.time_format){
                
                const uploadAbsenTidakMasuk = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tidakAbsen.id,
                    tanggal_mulai:datas.date_format+ ' 00:00:00',
                    tanggal_selesai:datas.date_format+ ' 00:00:00',
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                const uploadAbsenPulangNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    pelanggaran_id:1,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenTidakMasuk,
                            uploadAbsenPulangNormal
                        },
                        message: "success",
                        note: "pulang normal, tapi tidak absen masuk"
                    }
                }


            }
            else{
                const uploadAbsenTidakMasuk = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tidakAbsen.id,
                    tanggal_mulai:datas.date_format+ ' 00:00:00',
                    tanggal_selesai:datas.date_format+ ' 00:00:00',
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                const uploadAbsenPulangNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:jamOperasionalTerakhir[0].id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenTidakMasuk,
                            uploadAbsenPulangNormal
                        },
                        message: "success",
                        note: "pulang pelanggaran, tidak absen masuk "
                    }
                }
            }
        }
        else{
            if(inCheck.jam_operasional.jam_pulang < datas.time_format){
                const uploadAbsenNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    pelanggaran_id:1,
                    status_inout_id:1,
                    jam_operasional_id:inCheck.jam_operasional_id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenNormal
                        },
                        message: "success",
                        note: "absen masuk ada, pulang normal"
                    }
                }
            }
            else{
                const uploadAbsenNormal = await uploadAbsen({
                    user_id:datas.user.id,
                    tipe_absen_id:tipeAbsen.id,
                    tanggal_mulai:datas.date_time_format,
                    tanggal_selesai:datas.date_time_format,
                    pelanggaran_id:2,
                    status_inout_id:1,
                    jam_operasional_id:inCheck.jam_operasional_id,
                });

                return data_result = {
                    status:201,
                    success:true,
                    datas: {
                        data: {
                            uploadAbsenNormal
                        },
                        message: "success",
                        note: "absen masuk ada, pulang pelanggaran"
                    }
                }
            }
        }
    }
    else{
        await findDataOutDouble({
            user_id:datas.user.id,
            date_format:datas.date_format,
            code_pulang:datas.code_pulang_shift
        })
    }
    
    return data_result = {
        status:201,
        success:true,
        datas: {
            data: inOut,
            message: "success",
            note: "sudah absen"
        }
    }
}

const createDataByAbsenWeb = async(req, res) => {
    const {user_uuid, tanggal_mulai, tanggal_selesai, latitude, longitude, code_tipe_absen} = req.body;
    
    const get_date = new Date(tanggal_mulai);
    const time_format = date.format(get_date, 'HH:mm:ss');
    const date_format = date.format(get_date, 'YYYY-MM-DD');
    const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

    const user = await findUserById({uuid:user_uuid});

    if(!user){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "user not found"
            }
        });
    }

    if(user.jam_operasional_group_id === null){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                data:null,
                message: "jam operasional group belum di setting"
            }
        });
    }

    //absen masuk by web
    const code_masuk = [0, 8];

    if(code_masuk.includes(code_tipe_absen)){
        try {
            const result = await executionCodeMasuk({
                user:user,
                code_tipe_absen:code_tipe_absen,
                date_format:date_format,
                latitude, 
                longitude,
                code_masuk:code_masuk,
                time_format:time_format,
                date_time_format:date_time_format
            })
    
            return res.status(result && result.status).json({
                status:result && result.status,
                success:result && result.success,
                datas:result && result.datas
            })
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

    //absen pulang by web
    const code_pulang = [1, 9];

    if(code_pulang.includes(code_tipe_absen)){
        try {
            const result = await executionCodePulang({
                user:user,
                code_tipe_absen:code_tipe_absen,
                date_format:date_format,
                latitude, 
                longitude,
                code_masuk:code_masuk,
                code_pulang:code_pulang,
                time_format:time_format,
                date_time_format:date_time_format
            })
    
            return res.status(result && result.status).json({
                status:result && result.status,
                success:result && result.success,
                datas:result && result.datas
            })
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

    //absen masuk shift by web
    const code_masuk_shift = [4];

    if(code_masuk_shift.includes(code_tipe_absen)){
        try {
            const result = await executionCodeShiftMasuk({
                user:user,
                code_tipe_absen:code_tipe_absen,
                date_format:date_format,
                code_masuk_shift:code_masuk_shift,
                time_format:time_format,
                date_time_format:date_time_format
            })
    
            return res.status(result && result.status).json({
                status:result && result.status,
                success:result && result.success,
                datas:result && result.datas
            })
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

    //absen masuk shift by web
    const code_pulang_shift = [5];

    if(code_pulang_shift.includes(code_tipe_absen)){
        try {
            const result = await executionCodeShiftPulang({
                user:user,
                code_tipe_absen:code_tipe_absen,
                date_format:date_format,
                code_masuk_shift:code_masuk_shift,
                code_pulang_shift:code_pulang_shift,
                time_format:time_format,
                date_time_format:date_time_format
            })
    
            return res.status(result && result.status).json({
                status:result && result.status,
                success:result && result.success,
                datas:result && result.datas
            })
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

}

module.exports = {
    createDataByAbsenWeb
}