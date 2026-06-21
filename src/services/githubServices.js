import {GITHUB_TOKEN} from "../config/env.js"
 async function fetchGithubUser(username) {
    let url = 'https://api.github.com/users/' + username;
    const headers={};
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "null") {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`
      }


      const response = await  fetch(url,{headers})

      if(response.status===404){
        throw new Error("NOT_FOUND")
      }
      if(!response.ok){
        throw new Error("GITHUB_ERROR")
      }
      const data = await response.json()

      return{
        username: data.login,
        name: data.name,
        bio: data.bio,
        location: data.location,
        html_url: data.html_url,
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following,
        github_created_at: data.created_at,
      }
 }


export {fetchGithubUser}