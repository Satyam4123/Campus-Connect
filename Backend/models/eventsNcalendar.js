const mongoose=require('mongoose')

const eventSchema=new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String
    },
    location:{
        type:String
    },
    markedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports=mongoose.model('Events',eventSchema);