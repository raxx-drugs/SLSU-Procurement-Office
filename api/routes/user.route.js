import express from "express";

import { createUser, deleteUser, fetchUser, listUsers, updateUser,fetchUserLogin } from "../controllers/user.controller.js";

const router = express.Router();

// Route for adding new user 
router.post("/", createUser);

// Route for fetching all users
router.get("/", listUsers);

// Route for fetching specific user using id
router.get("/:id", fetchUser);

// Route for updating a specific user
router.put("/:id", updateUser);

// // Route for updating a specific user's key
// router.put("/key/:email", updateKey);

// Route for deleting a specific user
router.delete("/:id", deleteUser);

// Route for fetching specific user using id
router.get("/login/:unit", fetchUserLogin);



export default router;