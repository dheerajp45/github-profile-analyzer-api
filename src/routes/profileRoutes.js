import express from "express";
const profileRouter = express.Router();
import { analyzeAndSaveProfile,getAllProfiles,getOneProfileByUsername } from "../controllers/profileController.js";

profileRouter.post("/:username/analyze",analyzeAndSaveProfile)
profileRouter.get("/",getAllProfiles)
profileRouter.get("/:username",getOneProfileByUsername)


export default profileRouter