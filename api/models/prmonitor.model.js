import { mongoose } from "mongoose";

const prmonitorSchema = mongoose.Schema(
    {
        type:{
            type: String,
            required: false,
            default: "Purchase Request",
        },
        _pr_no:{
            type: String,
            required: false,
            default: "N/A",

        },
        _po_no:{
            type: String,
            required: false,
            default: "N/A",
        },
        _title:{
            type: String,
            required: false,
            
        },
        _abc:{
            type: Number,
            required: false,
        },
        _fund_source:{
            type: String,
            required: false,
        },
        _unit:{
            type: String,
            required: true,
        },
    
        _mode:{
            type: String,
            required: false,
        },
       
        _date_approved_pr:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_prepared_resolution:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_resolution_signed:{
            type: String,
            required: false,
            default: "N/A",
        },
        
        _date_posting:{
            type: String,
            required: false,
            default: "N/A",
        },
        
        _date_start_canvas:{
            type: String,
            required: false,
            default: "N/A",
        },
        
        _date_finished_canvas:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_prepare_abstract:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_completion_abstract:{
            type: String,
            required: false,
            default: "N/A",
        },
        _remarks:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_sworn_affidavit:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_prepared_po:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_approval_po:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_serving_po:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_conformed_supplier_po:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_posting_award:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_delivered:{
            type: String,
            required: false,
            default: "N/A",
        },
        _date_supply:{
            type: String,
            required: false,
            default: "N/A",
        },
        _status:{
            type: String,
            required: false,
            default: "N/A",
        },
        _remarks_action:{
            type: String,
            required: false,
            default: "N/A",
        },
        _fileData: {  // New field to store file data as binary
            type: Buffer, 
            required: false,
        },
        _image:{
            type: String,
            required: false,
            default: "example.com/image",
        }
    },
    {
        timestamps: true,
    }
)

const Pr_Monitor = mongoose.model('Pr Monitor', prmonitorSchema);
export default Pr_Monitor;