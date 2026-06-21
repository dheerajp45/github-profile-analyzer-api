# GitHub Profile Analyzer API

A REST API built with Node.js and Express that fetches public GitHub user profiles, extracts useful insights, and stores them in a MySQL database for later retrieval.

## Live Demo


**Live API:** `https://github-profile-analyzer-api-production-b8e2.up.railway.app/`

## Tech Stack

- **Node.js** + **Express.js** — backend server
- **MySQL** — persistent storage for analyzed profiles
- **mysql2** — MySQL driver with connection pooling
- **GitHub REST API** — third-party data source
- **dotenv** — environment variable management

## Features

### Required
- Fetch public GitHub profile data by username
- Store profile insights in MySQL (followers, repos, bio, location, etc.)
- `GET` all stored analyzed profiles
- `GET` a single stored profile by username

### Beyond Requirements
- Layered architecture (routes → controllers → services → database)
- Upsert logic — re-analyzing the same user updates existing data instead of duplicating
- GitHub Personal Access Token support for higher API rate limits
- Health check endpoint for deployment monitoring
- Direct GitHub fetch endpoint (without saving to DB) for testing
- Structured error handling with appropriate HTTP status codes (404, 500, 502)

## Project Structure

```
github-profile-analyzer-api/
├── src/
│   ├── index.js                 # App entry point
│   ├── config/env.js            # Environment variables
│   ├── db/connection.js         # MySQL connection pool
│   ├── routes/
│   │   ├── profileRoutes.js     # Profile analyze & read routes
│   │   └── githubRoute.js       # Direct GitHub fetch route
│   ├── controllers/
│   │   ├── profileController.js
│   │   └── githubController.js
│   └── services/
│       ├── profileService.js    # MySQL queries
│       └── githubServices.js    # GitHub API calls
├── schema.sql                   # Database schema
├── .env.example                 # Environment template
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (local or cloud instance)
- (Optional) [GitHub Personal Access Token](https://github.com/settings/tokens) for higher rate limits

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/dheerajp45/github-profile-analyzer-api.git
cd github-profile-analyzer-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `github_analyzer` |
| `GITHUB_TOKEN` | GitHub PAT (optional) | `ghp_xxxx` |

### 4. Set up the database

Open MySQL Workbench (or any MySQL client) and run:

```bash
# Or paste the contents of schema.sql into Workbench
mysql -u root -p < schema.sql
```

This creates the `github_analyzer` database and the `analyzed_profiles` table.

### 5. Start the server

```bash
npm start
```

You should see:

```
MySQL connected
server running on http://localhost:3000
```

## API Endpoints

Base URL: `http://localhost:3000` (local) or your deployed URL.

### Health Check

```
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

---

### Analyze & Save Profile

Fetches a GitHub user profile and saves insights to MySQL. Re-analyzing the same username updates the existing record.

```
POST /api/profiles/:username/analyze
```

**Example:**
```
POST /api/profiles/dheerajp45/analyze
```

**Response (200):**
```json
{
  "message": "data saved successfully",
  "data": {
    "id": 1,
    "username": "dheerajp45",
    "name": "Dheeraj Panyam",
    "bio": "Learning Full Stack",
    "location": "India",
    "html_url": "https://github.com/dheerajp45",
    "public_repos": 18,
    "followers": 19,
    "following": 34,
    "github_created_at": "2023-11-09 03:01:06",
    "analyzed_at": "2026-06-20 15:30:00"
  }
}
```

**Response (404)** — GitHub user not found:
```json
{
  "message": "GitHub user not found"
}
```

---

### Get All Analyzed Profiles

```
GET /api/profiles
```

**Response (200):**
```json
{
  "message": "here is the all profiles data",
  "data": [
    {
      "id": 1,
      "username": "dheerajp45",
      "followers": 19,
      "public_repos": 18
    }
  ]
}
```

Returns an empty array if no profiles have been analyzed yet.

---

### Get Single Analyzed Profile

```
GET /api/profiles/:username
```

**Example:**
```
GET /api/profiles/dheerajp45
```

**Response (200):**
```json
{
  "message": "fetched the profile by username",
  "profile": {
    "id": 1,
    "username": "dheerajp45",
    "name": "Dheeraj Panyam",
    "followers": 19
  }
}
```

**Response (404)** — profile not in database:
```json
{
  "message": "profile not found"
}
```

---

### Direct GitHub Fetch (Bonus)

Fetches profile directly from GitHub without saving to database.

```
GET /api/github/profile/:username
```

**Example:**
```
GET /api/github/profile/dheerajp45
```

## Database Schema

See [`schema.sql`](./schema.sql) for the full schema.

**Table: `analyzed_profiles`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-increment primary key |
| `username` | VARCHAR(100) | GitHub username (unique) |
| `name` | VARCHAR(255) | Display name |
| `bio` | TEXT | Profile bio |
| `location` | VARCHAR(255) | Location |
| `html_url` | VARCHAR(500) | GitHub profile URL |
| `public_repos` | INT | Public repository count |
| `followers` | INT | Follower count |
| `following` | INT | Following count |
| `github_created_at` | DATETIME | GitHub account creation date |
| `analyzed_at` | DATETIME | When profile was last analyzed |

## Deployment

### Recommended stack (free tier)

| Service | Platform |
|---------|----------|
| MySQL database | [Railway](https://railway.app) |
| Express API | [Render](https://render.com) |

### Steps

1. Deploy MySQL on Railway and copy connection credentials
2. Run `schema.sql` on the cloud database
3. Deploy the Express app on Render
4. Set all environment variables from `.env.example` in Render dashboard
5. Set **Start Command:** `node src/index.js`
6. Test `/health` on your live URL

## Author

**Dheeraj Panyam**

- GitHub: [@dheerajp45](https://github.com/dheerajp45)
- Email: dheeraj.panyam@gmail.com
