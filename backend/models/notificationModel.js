import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    message:{
        type: String,
        require: true,
        trim: true
    },
    read:{
        type: Boolean,
        default: false
    }

},{timestamps:true});

export default mongoose.model('notification', notificationSchema);