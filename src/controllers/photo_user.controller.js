const {
    user:userModel,
} = require('../models/index.js');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const uploadPhoto = async(req, res) => {

    const findUser = await userModel.findOne({
        where:{
            uuid:req.params.id
        }
    });

    if(!findUser) {
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                data:null,
                message: "user not found"
            }
        });
    }

    if(!req.files) {
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const {photo} = req.files;

    if(!photo) {
        return res.status(404).json({
            status:404,
            success:false,
            data: {
                data: null,
                message: "No file Upload"
            }
        });
    }

    const file = req.files.photo;
    // const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const file_name = crypto.randomUUID()+ext;
    const link = `/public/assets/photos/${file_name}`;
    const allowed_type = ['.png','.jpg','.jpeg'];

    //filter file type
    if(!allowed_type.includes(ext.toLowerCase())){
        return res.status(401).json({
            status:401,
            success:false,
            data: {
                data: null,
                message: "type file not allowed"
            }
        });
    }

    //delete foto
    if(findUser.image !== null){
        const filePath = `./public/assets/photos/${findUser.image}`;
        
        const fileExist = fs.existsSync(filePath)

        if(fileExist){
            fs.unlinkSync(filePath);
        }
    }

    file.mv(`./public/assets/photos/${file_name}`, async(err)=>{
        if(err){
            return res.status(500).json({
                status:500,
                success:false,
                data: {
                    message: err.message
                }
            });
        }

        try {
            await findUser.update({
                image:file_name,
                url_image:link
            });

            return res.status(201).json({
                status:201,
                success:true,
                data: {
                    data:null,
                    message: "success"
                }
            });
        } catch (error) {
            return res.status(500).json({
                status:500,
                success:false,
                data: {
                    message: error.message
                }
            });
        }
    });
}

module.exports = {
    uploadPhoto
}