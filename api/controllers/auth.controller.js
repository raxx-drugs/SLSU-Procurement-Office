import User from "../models/user.model.js";
import Login from '../models/login.model.js'
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import UserSettings from "../models/userSettings.model.js";



export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // Find the user by email
        const validUser = await User.findOne({ email });
       
        
        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }

        // Validate the user's password
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong Email or Password!"));
        }
        
        //console.log(validUser)
        const newLogin = new Login({
            id:validUser._id,
            unit:validUser.fname,
            email:validUser.email,
            isAdmin:validUser.isAdmin
        });
        
        // Save login information in the database
        await newLogin.save();
       
   
        // Generate a JWT token
        const token = jwt.sign(
            { id: validUser._id }, 
            process.env.TOKEN_SECRET_KEY, 
            { expiresIn: "1h" } // Optional: token expiry
        );

        // Exclude sensitive fields from the response
        const { password: hashedPassword, createdAt, updatedAt, ...rest } = validUser._doc;

        // Set the token in an HTTP-only cookie with a 1-hour expiry
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                expires: expiryDate 
            })
            .status(200)
            .json(rest);
    } catch (error) {
        // Handle unexpected errors
        return next(errorHandler(500, "Something went wrong while signing-in!"));
    }
};


export const getUserSettings = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const settings = await UserSettings.findOne({ userId });
  
      if (!settings) {
        return res.status(404).json({ message: "Settings not found!" });
      }
  
      return res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      next(errorHandler(500, "Error fetching user settings"));
    }
  };
  
export const signOut = async (req,res,next) => {
    res.clearCookie('access_token').status(200).json('Signout Sucess!');
}

export const signInUsingOauth = async (req,res,next) => {
   
    const {email} = req.body;
    console.log(email)
    try {
        const user = await User.findOne({email: email});
        if(!user){
            return next(errorHandler(403, "User not found!")); 
        }
        //console.log(validUser)
        const newLogin = new Login({
            id:user._id,
            unit:user.fname,
            email:user.email,
            isAdmin:user.isAdmin
        });
        // Save login information in the database
        await newLogin.save();
        res.status(200).json({ verified: true, user });
    } catch (error) {
        //Send an error response if something goes wrong
        return next(errorHandler(500, "Something went wrong while signing-in!"));
    
    }

}
