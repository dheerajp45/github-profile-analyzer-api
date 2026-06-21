import { fetchGithubUser } from "../services/githubServices.js";
import {
    saveProfile,
    fetchAllProfiles,
    fetchProfileByUsername,
} from "../services/profileService.js";

export async function analyzeAndSaveProfile(req, res) {
    const username = req.params.username;

    try {
        const data = await fetchGithubUser(username);
        const saved = await saveProfile(data);

        if (!saved?.row_data) {
            return res.status(500).json({
                message: "unable to save into table",
            });
        }

        return res.status(200).json({
            message: saved.message,
            data: saved.row_data,
        });
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ message: "GitHub user not found" });
        }

        return res.status(500).json({
            message: "server error",
        });
    }
}

export async function getAllProfiles(req, res) {
    try {
        const allProfilesData = await fetchAllProfiles();
        return res.status(200).json({
            message: allProfilesData.message,
            data: allProfilesData.data ?? [],
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error",
        });
    }
}

export async function getOneProfileByUsername(req, res) {
    const username = req.params.username;

    try {
        const data = await fetchProfileByUsername(username);

        if (!data) {
            return res.status(404).json({
                message: "profile not found",
            });
        }

        return res.status(200).json({
            message: data.message,
            profile: data.profileData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error",
        });
    }
}
