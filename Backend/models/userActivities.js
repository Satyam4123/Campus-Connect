const mongoose=require('mongoose')

const userActivities=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    action:{
        type:String,
        enum:['viewed','downloaded','marked'],
        required:true
    },
    resourceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'resources',
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('userActivity',userActivities)