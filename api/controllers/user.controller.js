import User from "../models/user.model.js";
import Login from "../models/login.model.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { errorHandler } from "../utils/error.js";
dotenv.config();

// create new user
export const createUser = async (req,res,next) => {

    const {fname, lname, email, password, isAdmin} = req.body;
    
    try {
        if(
            !fname || 
            !lname || 
            !email || 
            !password ||
            typeof isAdmin !== "boolean"
        ){
            next(errorHandler(400, "Something is missing, fill up all required fields!"));
        }else{

            // Check if email is already taken
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                // If email already exists, return a response indicating it
                next(errorHandler(409, "Email is already in use!"));
            }else{

                //generate new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                // create new user
                const user = await new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: req.body.isAdmin,
                })

                // Save the user to the database
                await user.save();

                // Send response after saving the paper
                res.status(201).json(user);
            }

        }
    } catch (error) {
        next(errorHandler(500, "Something went wrong while adding new user!"));
    }


};

// Fetch and List all user
export const listUsers = async (req,res,next) => {

    try {
        const userList = await User.find({});
        if(!userList || userList.length === 0){
            next(errorHandler(204, "No list of users yet!"));
        }else{
            // Extract all unique units from the user list
            const unitList = [...new Set(userList.map(user => user.fname))]; // Get unique units
            return res.status(200).json({
                count: userList.length,
                data: userList,
                unitList:unitList //select all the list of units from user (unit)
            });
        }    
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));
    }
};

// Fetch specific user using id
export const fetchUser = async (req,res,next) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            next(errorHandler(400, "ID is not a valid MongoDB _id, Please Check ID"));
            return;
        }else{
            const user = await User.findById(id);
            if(!user){
                next(errorHandler(404 , "User not found!"));
            }
            return res.status(200).json(user);
        }

        
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));

    }
}

// Update existing user
export const updateUser = async (req,res,next) => {

    const {fname, lname, email, password, isAdmin} = req.body;
    try {

        if(
            !fname ||
            !lname ||
            !email ||
            !password ||
            typeof isAdmin !== "boolean"

        ){
            next(errorHandler(400, "Something is missing, fill up all required fields!"));
            return;
        }
        //declare object id using req params
        const { id } = req.params;
        const result = await User.findByIdAndUpdate(id, req.body);

        // break the process and return error message if the user is not found
        if(!result){
            next(errorHandler(404, "User not found!"));
            return;
        }
        
        //return a (200) message if the update is successfull
        return res.status(200).json({message: "User has been updated successfully!"});
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while updating the data from database!"));

    }
}

// // Update Key
// export const updateKey = async (req,res,next) => {

//     const {currentKey} = req.body;
//     try {

//         //declare object id using req params
//         const { email } = req.params;
//         const result = await User.findOneAndUpdate( { email: email }, { currentKey });

//         // break the process and return error message if the user is not found
//         if(!result){
//             next(errorHandler(404, "User not found!"));
//             return;
//         }
        
//         //return a (200) message if the update is successfull
//         return res.status(200).json({message: "User has been updated successfully!"});
//     } catch (error) {
//         console.log(error);
//         //Send an error response if something goes wrong
//         next(errorHandler(500, "Something went wrong while updating the data from database!"));

//     }
// }

// Delete existing user
export const deleteUser = async (req,res,next) => {

    try {

        //declare object id using req params
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id, req.body);

        // break the process and return error message if the user is not found
        if(!result){
            next(errorHandler(404, "User not found!"));
            return;
        }else{
            //return a (200) message if the update is successfull
            return res.status(204).json({message: "User has been deleted successfully!"}); 
        }
        
        
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while deleting the data from database!"));
    
    }
}


// Fetch specific user using id
export const fetchUserLogin = async (req,res,next) => {
    try {
        const { unit } = req.params;
        if (!unit) {
            next(errorHandler(400, "Unit is missing!"));
            return;
        }else{
            // Find the latest login for the given unit
            const user = await Login.findOne({ unit: unit }).sort({ createdAt: -1 })
  
            if(!user){
                next(errorHandler(404 , "User not found!"));
            }
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));

    }
}