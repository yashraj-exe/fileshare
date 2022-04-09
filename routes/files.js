const router = require('express').Router();
const path = require('path')
const multer = require('multer');
const fileModel = require('../models/file')
const {v4:uuid4} = require('uuid');

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename : (req,file,cb)=>{
        const unique = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,unique)
    }
})

const upload = multer({
    storage,
    limits : {fieldSize:100000 * 100} // data set in bytes 1mb = 100000 bytes 100000 * 100 = 100mb
}).single('file')

router.post('/',(req,res)=>{
    // Validate Data
    

    // Store File

    upload(req,res,async (err)=>{
        if(!req.file){
            return res.json({
                error : "All field are Required"
            })
        }
        if(err) return res.status(500).json({err:err.message})

        // Store in DB

        const file = new fileModel({
            filename : req.file.filename,
            path: req.file.path,
            size : req.file.size,
            uuid : uuid4()
        })

        const response = await file.save();
        
        // send Response -> Download Link
        return res.status(200).json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`})

    })

    
})

router.post('/send',async(req,res)=>{
    const {uuid,emailTo,emailFrom} = req.body;

    // Validate Data
    if(!uuid||!emailTo||!emailFrom){
        return res.status(422).json({Error : "All Fileds are Required"});
    }


    // Get Data from DataBase

    const file = await fileModel.findOne({uuid:uuid});
    
    if(file.sender){
        return res.status(422).json({Error:"Email Already Send "})
    }

    file.sender = emailFrom;
    file.receiver = emailTo;    
    const response = await file.save();
    console.log(response)

    // Send Mail
    const sendMail = require('../services/emailService');

    sendMail({
        from:emailFrom,
        to : emailTo,
        subject : "inShare File Sharing.",
        text : `${emailFrom} send you a File.`,
        html: require('../services/emailTemplate')({
            emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: `${parseInt(file.size/1000)} Kb`,
            expires : '24 hours'
        })
    })

    return res.send({msg:"Sucess"})

})

module.exports = router;