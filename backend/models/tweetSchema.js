import mongoose from "mongoose";
const tweetSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    like:{
        type:Array,
        default:[],
    },
    userDetails:{
        type: Object,
    },
    comments:{
        type: Array,
        default: [],
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'Tweet'
    }
},{timestamps:true})
export const Tweet = mongoose.model('Tweet',tweetSchema);