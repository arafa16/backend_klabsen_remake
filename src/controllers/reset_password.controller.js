const {user : userModel, status:statusModel} = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const argon = require('argon2');

const sendEmailReset = async(req, res)=>{
    const {email} = req.body;

    const result = await userModel.findOne({
        where:{
            email
        }
    })

    if(!result){
        return res.status(404).json({
            status:404,
            success: false,
            datas:{
               message: "user not found"
            }
        });
    }

    try {
        const token = jwt.sign({uuid:result.uuid},process.env.JWT_SECRET,{
            expiresIn: "60m"
        });
    
        const link = `${process.env.LINK_FRONTEND}/reset/${token}`;
    
         // create reusable transporter object using the default SMTP transport
         const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    
        const emailMessage = {
            from: '"KLABSEN" <no-replay@kopkarla.co.id>',
            to: email,
            subject: "Reset Password",
            text: 
            `click this link for reset your password ${link}`
        };
    
        await transporter.sendMail(emailMessage);
        

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message: "success, check your email for reset password"
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

const getTokenReset = async(req, res) => {
    const {token} = req.params;

    if(!token){
        return res.status(404).json({
            message: "token not found"
        })
    }

    try {
        //validation token
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            where:{
                uuid:verify.uuid
            },
            attributes:['uuid','name','email']
        });

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"success",
                data:user
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

const resetPassword = async(req, res) => {
    
    const {token} = req.params;
    const {password, confPassword} = req.body;
    
    if(!token || token === null){
        return res.status(404).json({
            message:"token not found"
        });
    }

    if(password !== confPassword){
        return res.status(401).json({
            message:"password not match, please check again"
        })
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            where:{
                uuid:verify.uuid
            }
        });

        const hasPassword = await argon.hash(password);

        await user.update({
            password:hasPassword
        })

        return res.status(201).json({
            status:201,
            success: true,
            datas:{
                message:"reset password success"
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

module.exports = {
    sendEmailReset,
    getTokenReset,
    resetPassword
}