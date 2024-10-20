const {
    user:userModel,
    group:groupModel,
    in_out:inOutModel,
    periode_kerja:periodeKerjaModel,
    status_inout:statusInoutModel,
    pelanggaran:pelanggaranModel,
    tipe_absen:tipeAbsenModel,
    status:statusModel
} = require('../models/index.js');
const {Op} = require('sequelize');
const date = require('date-and-time');

const getCountDatas = async(req, res) => {
    const {periode_uuid, group_uuid, status_uuid} = req.query;

    let data_perhitungan = [];

    let queryDataPeriode = {};
    let queryDataGroup = {};

    if(!periode_uuid){
        return res.status(401).json({
            status:401,
            success:false,
            datas: {
                data:null,
                message: "periode cann't null"
            }
        });
    }
    
    if(periode_uuid){
        const findPeriode = await periodeKerjaModel.findOne({
            where:{
                uuid:periode_uuid
            }
        });

        if(findPeriode !== null){
            const startDate = date.format(new Date(findPeriode.tanggal_mulai), 'YYYY-MM-DD HH:mm:ss');
            const endDate = date.format(new Date(findPeriode.tanggal_selesai), 'YYYY-MM-DD HH:mm:ss');

            queryDataPeriode.tanggal_mulai = {}
            queryDataPeriode.tanggal_mulai.start_date = startDate;
            queryDataPeriode.tanggal_mulai.end_date = endDate;
            queryDataPeriode.jumlah_hari = parseInt(findPeriode.jumlah_hari); ;
        }
    }

    if(group_uuid){
        const findGroup = await groupModel.findOne({
            where:{
                uuid:group_uuid
            }
        })

        if(findGroup !== null){
            queryDataGroup.group_id = findGroup.id
        }
    }

    if(status_uuid){
        const findStatus = await statusModel.findOne({
            where:{
                uuid:status_uuid
            }
        })

        if(findStatus !== null){
            queryDataGroup.status_id = findStatus.id
        }
    }

    try {
        const findUser = await userModel.findAll({
            where:queryDataGroup,
            attributes:['id','uuid','nik','name','group_id']
        });

        for(const data in findUser){
            data_perhitungan.push(
                {
                    name :findUser[data].uuid,
                    nik:findUser[data].nik,
                    name:findUser[data].name,
                    group_id:findUser[data].group_id,
                    is_active:findUser[data].is_active,
                    data_in:0,
                    data_in_pelanggaran:0,
                    data_in_normal:0,
                    data_out:0,
                    data_out_pelanggaran:0,
                    data_out_normal:0,
                    data_cuti:0,
                    data_sakit:0,
                    data_tidak_absen:0,
                    jumlah_hari:0,
                    total_point:0,
                    point_pelanggaran:0
                }
            );

            const getDataInOut = await inOutModel.findAll({
                where:{
                    user_id:findUser[data].id,
                    tanggal_mulai:{
                        [Op.and]: {
                            [Op.gte]: queryDataPeriode.tanggal_mulai.start_date,
                            [Op.lte]: queryDataPeriode.tanggal_mulai.end_date,
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
                    }
                ]
            })

            for(const dataInOut in getDataInOut){
                if(
                    getDataInOut[dataInOut].tipe_absen.code === 0 
                    || getDataInOut[dataInOut].tipe_absen.code === 4 
                    || getDataInOut[dataInOut].tipe_absen.code === 8
                    || getDataInOut[dataInOut].tipe_absen.code === 11
                ){
                    data_perhitungan[data].data_in = data_perhitungan[data].data_in + 1;
                    if(getDataInOut[dataInOut].pelanggaran.code === 2){
                        data_perhitungan[data].data_in_pelanggaran = data_perhitungan[data].data_in_pelanggaran + 1;
                    }
                    else{
                        data_perhitungan[data].data_in_normal = data_perhitungan[data].data_in_normal + 1;
                    }
                }
                else if(
                    getDataInOut[dataInOut].tipe_absen.code === 1
                    ||getDataInOut[dataInOut].tipe_absen.code === 5
                    ||getDataInOut[dataInOut].tipe_absen.code === 9
                    ||getDataInOut[dataInOut].tipe_absen.code === 12
                ){
                    data_perhitungan[data].data_out = data_perhitungan[data].data_out + 1;
                    if(getDataInOut[dataInOut].pelanggaran.code === 2){
                        data_perhitungan[data].data_out_pelanggaran = data_perhitungan[data].data_out_pelanggaran + 1;
                    }
                    else{
                        data_perhitungan[data].data_out_normal = data_perhitungan[data].data_out_normal + 1;
                    }
                }
                else if(
                    getDataInOut[dataInOut].tipe_absen.code === 13
                ){
                    data_perhitungan[data].data_cuti = data_perhitungan[data].data_cuti + 1;
                }
                else if(
                    getDataInOut[dataInOut].tipe_absen.code === 14
                ){
                    data_perhitungan[data].data_sakit = data_perhitungan[data].data_sakit + 1;
                }
                else{
                    data_perhitungan[data].data_tidak_absen = data_perhitungan[data].data_tidak_absen + 1;
                }
            }

            data_perhitungan[data].jumlah_hari = queryDataPeriode.jumlah_hari;

            const tidak_absen = queryDataPeriode.jumlah_hari - (((data_perhitungan[data].data_in + data_perhitungan[data].data_out)/2) + data_perhitungan[data].data_cuti + data_perhitungan[data].data_sakit);

            if(tidak_absen < 0){
                data_perhitungan[data].data_tidak_absen = data_perhitungan[data].data_tidak_absen + 0;
            }else{
                data_perhitungan[data].data_tidak_absen = data_perhitungan[data].data_tidak_absen + tidak_absen;
            }

            data_perhitungan[data].total_point = data_perhitungan[data].data_in_pelanggaran + data_perhitungan[data].data_out_pelanggaran + data_perhitungan[data].data_tidak_absen;
            
            data_perhitungan[data].point_pelanggaran = data_perhitungan[data].total_point * 0.005;
        }

        return res.status(200).json({
            status:200,
            success:true,
            datas: {
                data:{
                    queryDataPeriode,
                    queryDataGroup,
                    data_perhitungan
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

module.exports = {
    getCountDatas
}