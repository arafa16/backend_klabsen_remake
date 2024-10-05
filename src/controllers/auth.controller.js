const {user : userModel, status:statusModel } = require('../models');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(404).json({
            message:"email or password can't be null"
        });
    }

    const findUser = await userModel.findOne({
        where:{
            email
        },
        include:[
            {
                model:statusModel,
                attributes:['name']
            }
        ]
    });

    if(!findUser){
        return res.status(404).json({
            message:"user not found"
        })
    }

    if(findUser.status_user.name !== 'active' || findUser.is_delete){
        return res.status(401).json({
            message: `you don't have access, status account is ${findUser.status_user.name}, not active`
        })
    }

    const match = await argon.verify(findUser.password, password);

    if(!match){
        return res.status(403).json({
            message:"wrong password"
        });
    }

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

    console.log(req.headers, 'session');

    return res.status(200).json({
        success: true,
        message: "login success",
        data:{
            token
        }
    });
}

module.exports = {
    login
}