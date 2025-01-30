import { mongoose } from "mongoose";

const timelineSchema = mongoose.Schema(
  {
    currentStep: {
      type: String,
      required: false,
    }, 
    prNo:{
        type: String,
        required: false,
    },
    status: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: String,
      required: false,
    }
  },
  {
      timestamps: true,
  }
)


const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;