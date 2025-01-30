import { mongoose } from "mongoose";

const ppmpSchema = mongoose.Schema(
    { 
        type: {
            type: String,
            required: true,
        },
        unit:{
            type: String,
            required: true,
        },
        title:{
            type: String,
            required: true,
        },
        fundingSource: {
            type: String,
            required: true,
        },
        ppmpData: {
            description: {
                type: [String], // Array of strings
                required: true,
            },
            qnty: {
                type: [String], // Array of quantities
                required: true,
            },
            mode: {
                type: [String], // Array of modes
                required: true,
            },
            estimatedBudget: {
                type: [Number], // Array of numbers
                required: true,
            },
            dateStart: {
                type: [String], // Array of start dates
                required: true,
            },
            dateEnd: {
                type: [String], // Array of end dates
                required: true,
            },
            prUsed:{
                type: [Boolean],
                default: false,
            },
        },
        status: {
            type: String, // Array of statuses
            required: false,
            default: "Pending",
        },
        totalEstimatedBudget: {
            type: Number, // Single total budget
            required: true,
        },
        remarks: {
            type: String, // Single remark
            required: false,
            default: "",
        },
        fileData: {
            type: String, // Single file URL or path
            required: false,
        },
         
    },
    {
        timestamps: true,
    }
)

const PPMP = mongoose.model('PPMP', ppmpSchema);
export default PPMP;