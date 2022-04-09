const router = require('express').Router();
const fileModel = require('../models/file')

router.get('/:uuid',async(req,res)=>{
    const file = await fileModel.findOne({uuid:req.params.uuid});
    if(!file){
        res.render('download',{error:"Link has Been Expired"})
    }

    const filePath = `${__dirname}/../${file.path}`
    // console.log(filePath)
    res.download(filePath)
})



module.exports = router;