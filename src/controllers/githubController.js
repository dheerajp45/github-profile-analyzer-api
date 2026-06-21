import { fetchGithubUser } from "../services/githubServices.js"

async function getProfileFromGithub(req,res) {
      const username = req.params.username;
      
    try {
        const profile = await fetchGithubUser(username);
        return res.status(200).json(profile);
      } catch (error) {
        if(error.message==="NOT_FOUND"){
            // console.log(error);
            return res.status(404).json({ error: "GitHub user not found" })
        }
        else{
            return res.status(502).json({ error: "Failed to fetch from GitHub" })
        }
      }
    
}

export {getProfileFromGithub}