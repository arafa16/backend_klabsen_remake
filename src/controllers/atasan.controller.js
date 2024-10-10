const {
    user:userModel
} = require('../models/index.js');

const getDatas = async(req, res) => {
    try {
        const result = await userModel.findAll({
            where:{
                is_atasan:true
            }
        });

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"success",
                data:result,
            }
        });

    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            datas:{
                message:error.message
            }
        })
    }
}

module.exports = {
    getDatas
}