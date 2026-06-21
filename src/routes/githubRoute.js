import express from "express";
const githubRouter = express.Router();
import { getProfileFromGithub } from "../controllers/githubController.js";

githubRouter.get("/profile/:username", getProfileFromGithub);

export default githubRouter