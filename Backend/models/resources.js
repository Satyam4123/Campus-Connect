const mongoose=require('mongoose')
const resources=new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    filename: {
        type: String,
        required: true,
    },
    uploader: {
        type: String,
        required:true
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
})

module.exports=mongoose.model('resources',resources)