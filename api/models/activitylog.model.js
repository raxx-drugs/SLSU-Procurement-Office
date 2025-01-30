import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  { 
    unit:{
        type: String,
        required: true,
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: false,
    },
    target_type: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    additionalData: {
      type: Object, // Can store any extra details related to the log
      required: false,
    },
  },
  {
      timestamps: true,
  }
)

const activityLog = mongoose.model('Activity Log', activityLogSchema);
export default activityLog;
