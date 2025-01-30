import activityLog from '../models/activitylog.model.js';
import activitylog from '../models/activitylog.model.js';
import { errorHandler } from "../utils/error.js";


export const createActivityLog = async (req,res,next) => {
const { unit, action, target, target_type, icon, description, additionalData} = req.body;
console.log(req.body);
  try {
    const existingActivty = await activitylog.findOne({
        unit,
        action,
        target,
        target_type,
        icon,
        description,
        additionalData,

    })
    if(existingActivty){
        next(errorHandler(409, "This activity already exists!"));

    }
    const newLog = new activitylog({
        unit,
        action,
        target,
        target_type,
        icon,
        description,
        additionalData,
      });
    await newLog.save();

    // Respond with success
     res.status(201).json({ message: 'Log created successfully!' });

  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Fetch and list all activity
export const fetchAllActivityLog = async (req,res,next) => {
  try {
    const activityLogList = await activityLog.find({}).sort({ createdAt: -1 }); // Sort by 'createdAt' field in descending order
      if(!activityLogList){
          next(errorHandler(204, "No list of prs yet!"));
      }else{
          return res.status(200).json({
              count: activityLogList.length,
              data: activityLogList
          });
      }
  } catch (error) {
      console.log(error);
      //Send an error response if something goes wrong
      next(errorHandler(500, "Something went wrong while fetching the data from database!"));
  }
}

// Fetch and list all ActivityLog by unit
export const fetchActivityLog = async (req,res,next) => {
    
  try {
      const { unit } = req.params; // Extract the unit from route parameters
      if (!unit) {
          return next(errorHandler(400, "Unit is required"));
      }
      const activityLogList = await activityLog.find({ unit: unit }).sort({ createdAt: -1 });
      console.log(activityLogList)

      if(!activityLogList){
          next(errorHandler(204, "No list of papers yet!"));
      }else{
          return res.status(200).json({
              count: activityLogList.length,
              data: activityLogList
          });
      }
  } catch (error) {
      console.log(error);
      //Send an error response if something goes wrong
      next(errorHandler(500, "Something went wrong while fetching the data from database!"));
  }
}

export const deleteActivityLog  = async (req,res,next) => {
  try {
    //declare object id using req params
    const { id } = req.params;
    const result = await activityLog.findByIdAndDelete(id, req.body);

    // break the process and return error message if the user is not found
    if(!result){
        next(errorHandler(404, "Activity not found!"));
        return;
    }else{
        //return a (200) message if the update is successfull
        return res.status(200).json({message: "Activity has been deleted successfully!"});
    } 
} catch (error) {
    console.log(error);
    //Send an error response if something goes wrong
    next(errorHandler(500, "Something went wrong while deleting the data from database!"));
}
};
