import { mongoose } from "mongoose";

const loginSchema = new mongoose.Schema(
    {
        id:{
            type: String,
            required: true,
        },
        unit:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        isAdmin:{
            type: Boolean,
            required: true,
            default: false,
        },   
    },
    {
        timestamps: true,
    }
)

const Login = mongoose.model('Login', loginSchema);
export default Login;