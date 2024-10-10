const {user : userModel, status:statusModel, privilege:privilegeModel } = require('../models');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(404).json({
            status:404,
            success: false,
            datas:{
                message:"email or password can't be null"
            }
        });
    }

    const findUser = await userModel.findOne({
        where:{
            email
        },
        include:[
            {
                model:statusModel,
                attributes:['name','code']
            }
        ]
    });

    if(!findUser){
        return res.status(404).json({
            status:404,
            success: false,
            datas:{
                message:"user not found"
            }
        })
    }

    if(findUser.status.code !== 2){
        return res.status(401).json({
            status:401,
            success: false,
            datas:{
                message: `you don't have access, user is ${findUser.status.name}`
            }
        })
    }

    const match = await argon.verify(findUser.password, password);

    if(!match){
        return res.status(403).json({
            status:403,
            success: false,
            datas:{
                message:"wrong password"
            }
        });
    }

    try {

        const token = jwt.sign(
            {
                uuid:findUser.uuid,
                name:findUser.name,
                email:findUser.email,
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
    
        req.session.token = token;
    
        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message: "login success",
            }
        });
    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            datas:{
                message:error
            }
        })
    }
}

const registration = async(req, res) => {
    const {absen_id, name, email, password, nomor_hp, penempatan_id, gander_id} = req.body;

    if(!absen_id, !name || !email || !password || !nomor_hp || !penempatan_id || !gander_id){
        return res.status(404).json({
            status:404,
            success:false,
            datas: {
                message: "value cannot be null"
            }
        });
    }

    const findName = await userModel.findOne({
        where:{
            email:email
        }
    });

    if(findName !== null){
        return res.status(403).json({
            status:403,
            success:false,
            datas: {
                 message:"user registered"
            }
        });
    }

    try {
        const hasPassword = await argon.hash(password);

        const privilege = await privilegeModel.create({
            dashboard:true,
            absen:true,
            kalendar_sub:true,
            pengajuan_koreksi_sub:true,
        });

        const response = await userModel.create({
            absen_id,
            name:name,
            email,
            password:hasPassword,
            nomor_hp,
            penempatan_id,
            gander_id,
            status_id:2,
            privilege_id:privilege.id,
        });

        return res.status(201).json({
            status:200,
            success:true,
            datas: {
                data:response,
                message: "success"
            }
        });
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error
            }
        });
    }
}

const getMe = async(req, res) => {

    const user = req.user;

    try {
        const result = await userModel.findOne({
            where:{
                uuid:user.uuid
            },
            attributes:{
                exclude:['id','password']
            },
            include:[
                {
                    model:privilegeModel
                }
            ]
        })

        return res.status(201).json({
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
                message: error
            }
        });
    }
}

const logout = async(req, res) => {

    try {
        req.session.destroy((err)=>{
            if(err) return res.status(400).json({msg: err.message});
    
            return res.status(200).json({
                status:200,
                success:true,
                datas: {
                    message: "logout success"
                }
            });

        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            datas: {
                message: error
            }
        });
    }
}

module.exports = {
    login,
    registration,
    getMe,
    logout
}