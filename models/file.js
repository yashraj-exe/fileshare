const mongoose = require('mongoose');


const fileSchema = mongoose.Schema({
    filename : {type:String,required:true},
    path :{type:String,required:true},
    size :{type:Number,required:true},
    uuid :{type:String,required:true},
    // These two are not cumpolsory if user user wants to send file in email then these filed is required thats why initials is false
    sender :{type:String,required:false},
    receiver :{type:String,required:false},
},{timestamps:true});

const fileModel = mongoose.model('file',fileSchema);


module.exports = fileModel;