import pool from "../db/connection.js"

export async function saveProfile(profile){
    const date=new Date(profile.github_created_at).toISOString().slice(0,19).replace("T"," ")

    
const query = ` INSERT INTO analyzed_profiles (
      username,
      name,
      bio,
      location,
      html_url,
      public_repos,
      followers,
      following,
      github_created_at,
      analyzed_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      bio = VALUES(bio),
      location = VALUES(location),
      html_url = VALUES(html_url),
      public_repos = VALUES(public_repos),
      followers = VALUES(followers),
      following = VALUES(following),
      github_created_at = VALUES(github_created_at),
      analyzed_at = NOW()
  `
  await pool.query(query, [
    profile.username,
    profile.name,
    profile.bio,
    profile.location,
    profile.html_url,
    profile.public_repos,
    profile.followers,
    profile.following,
    date,
  ]);

const [rows] = await pool.query("SELECT * FROM analyzed_profiles WHERE username = ?",
    [profile.username]);


    return {message:"data saved successfully",
        row_data:rows[0]}
}


export async function fetchAllProfiles() {
    const [rows] = await pool.query("SELECT * FROM analyzed_profiles");
    return {
        message: "here is the all profiles data",
        data: rows,
    };
}

export async function fetchProfileByUsername(username) {
    const [rows] = await pool.query(
        "SELECT * FROM analyzed_profiles WHERE username = ?",
        [username]
    );
    if (!rows.length) {
        return null;
    }
    return {
        message: "fetched the profile by username",
        profileData: rows[0],
    };
}




