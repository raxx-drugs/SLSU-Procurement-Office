import express from "express";
import { createActivityLog, fetchAllActivityLog, fetchActivityLog, deleteActivityLog } from "../controllers/activitylog.controller.js";
const router = express.Router();

// Router for adding new Activity
router.post("/", createActivityLog);
// Router for fetching all Activity
router.get("/", fetchAllActivityLog);
// Router for fetching all Activity by unit
router.get("/unit/:unit",fetchActivityLog);
// Router for deleting Activity
router.delete("/:id", deleteActivityLog);

export default router;