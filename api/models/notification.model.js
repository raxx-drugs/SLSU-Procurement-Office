import { mongoose } from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        unit:{
            type: String,
            required: true,
        },
        message:{
            type: String,
            required: true,
        },
        read:{
            type: Boolean,
            default: false,
        },   
        additionalInfo:{
            type: Array,
            required: false,
        },   
    },
    {
        timestamps: true,
    }
)

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;