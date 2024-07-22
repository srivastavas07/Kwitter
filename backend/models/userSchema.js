import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    following:{
        type:Array,
        default:[],
    },
    followers:{
        type:Array,
        default:[],
    },
    bookmark:{
        type:Array,
        default:[],
    },
    bio:{
        type:String,
        default:"I love Kwitter"
    },
    profilePhoto:{
        type:String,
        default:null
    },
    coverPhoto:{
        type:String,
        default:null,
    }

},{timestamps:true});
export const User = mongoose.model('User',userSchema);