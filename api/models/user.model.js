import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fname:{
            type: String,
            required: true,
        },
        lname:{
            type: String,
            required: true,
            unique:true,
        },
        email:{
            type: String,
            required: true,
            unique:true,
        },
        password:{
            type: String,
            required: true,
        },
        currentKey:{
            type: String,
            required: false,
            default: "tangina",
        },
        isAdmin:{
            type: Boolean,
            required: true,
            default: false,
        },
        tags: {
            title: {
                type: [String], // Array of quantities
                required: false,
            },
            description: {
                type: [String], // Array of strings
                required: false,
            },
        },
        status:{
            type: String,
            required: false,
        },
        image:{
            type: String,
            required: false,
        }
         
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema);
export default User;