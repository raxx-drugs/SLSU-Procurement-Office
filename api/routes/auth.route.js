import express from "express";
import dotenv from 'dotenv';
import {signIn, getUserSettings, signOut, signInUsingOauth} from '../controllers/auth.controller.js'
dotenv.config();
const router = express.Router();


// Route for fetching specific user using id
router.post("/", signIn);
router.get("/:id", getUserSettings);
router.get("/", signOut);
router.post("/google-oauth", signInUsingOauth); 


export default router;