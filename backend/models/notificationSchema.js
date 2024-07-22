import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    actorName:{
        type:String,
        required:true,
    },
    actorProfilePhoto:{
        type:String,
        default:null,
    },
    actorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    targetTweetLink:{
        type:String,
        default:null,
    }
},{timestamps:true})
export const Notification = mongoose.model('Notification',notificationSchema)