# 🛡️ SafeRoutes — Safety-Weighted Navigation

> **Don't just find the shortest route. Find the safer route.**

SafeRoutes is a safety-focused pedestrian navigation platform designed to recommend routes based not only on distance and travel time, but also on **safety-related factors** such as lighting, crime risk, CCTV coverage, pedestrian activity, and isolation.

The project was developed as a Buildathon solution for the problem statement:

**"Safe Routes for Women — Safety-Weighted Navigation"**

---

## 🚨 Problem Statement

Traditional navigation systems generally optimize routes for:

- Shortest distance
- Fastest travel time
- Traffic conditions

However, for pedestrians—especially women traveling alone or at night—the shortest route may not always be the safest.

A route may be short but pass through:

- Poorly lit areas
- Isolated roads
- High-risk zones
- Areas with low pedestrian activity
- Roads with limited surveillance

SafeRoutes addresses this problem by treating **safety as a core routing factor**, rather than simply displaying safety information as a map overlay.

---

# 💡 Our Solution

SafeRoutes provides users with multiple route options and assigns each route a **Safety Score out of 100**.

Instead of asking:

> "Which route is fastest?"

SafeRoutes asks:

> "Which route provides the best balance between safety, distance, and travel time?"

The system evaluates different safety factors and recommends the route with the highest safety score.

---

# ✨ Key Features

## 🗺️ Safety-Focused Navigation

Users can enter:

- Starting location
- Destination

The system then calculates available pedestrian routes.

---

## 🛡️ Safety Score

Every route receives a safety score between **0 and 100**.

Example:

| Route             | Safety Score | Risk   |
| ----------------- | -----------: | ------ |
| 🟢 Safest Route   |       92/100 | Low    |
| 🟡 Balanced Route |       78/100 | Medium |
| 🔴 Fastest Route  |       61/100 | High   |

The score helps users understand the safety level of each route before choosing it.

---

# ⚖️ Safety-Weighted Routing

SafeRoutes evaluates multiple safety factors.

Current safety model:

````text
Lighting        → 30%
Crime Risk      → 25%
CCTV Coverage   → 15%
Activity        → 10%
Isolation       → 20%
Conceptually:

Safety Score =
    Lighting × 0.30
  + Crime Risk × 0.25
  + CCTV × 0.15
  + Activity × 0.10
  + Isolation × 0.20

The weights can be modified depending on user preferences and future safety datasets.

🎛️ Safety Preferences

Users can customize route evaluation using safety preferences.

Available preferences
💡 Avoid poorly lit areas
👥 Avoid isolated areas
📷 Prefer CCTV coverage
⚠️ Avoid high-risk zones

This allows the routing system to adapt to different user priorities.
🗺️ Interactive Map

SafeRoutes uses an interactive map to visualize routes.

Routes are represented using safety colors:

🟢 Green  → Safer route
🟡 Yellow → Medium-risk route
🔴 Red    → Higher-risk route

The map also highlights potentially unsafe areas such as:

Risk zones
Poor lighting areas
Other safety-related areas
🧠 Why SafeRoutes Is Different

Traditional navigation:
Start
  ↓
Distance / Time
  ↓
Shortest Route
SafeRoutes:
Start + Destination
        ↓
   Route Options
        ↓
Safety Analysis
        ↓
┌─────────────────────┐
│ Lighting            │
│ Crime Risk          │
│ CCTV Coverage       │
│ Pedestrian Activity │
│ Isolation           │
└─────────────────────┘
        ↓
 Safety Score
        ↓
Safer Route Recommendation
Safety is therefore part of the routing decision, not just a visual layer.

🏗️ System Architecture
                    ┌──────────────────┐
                    │      USER        │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ React Frontend   │
                    │                  │
                    │ • Home           │
                    │ • Map            │
                    │ • Route Cards    │
                    │ • Filters        │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │    API Service   │
                    │     Axios        │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Node.js +        │
                    │ Express Backend  │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ↓                         ↓
       ┌─────────────────┐       ┌─────────────────┐
       │ Routing Service │       │ Safety Engine   │
       │                 │       │                 │
       │ OpenRouteService│       │ Safety Score    │
       │ + fallback      │       │ Calculation     │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                └────────────┬────────────┘
                             ↓
                    ┌──────────────────┐
                    │ Route Results    │
                    │                  │
                    │ Score            │
                    │ Distance         │
                    │ Time             │
                    │ Risk             │
                    │ Factors          │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Map + Route      │
                    │ Comparison       │
                    └──────────────────┘
📁 Project Structure

SafeRoutes/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx
│   │   │   ├── RouteCard.jsx
│   │   │   ├── SafetyScore.jsx
│   │   │   └── SafetyFilters.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── data/
│   │   └── safetyData.json
│   │
│   ├── routes/
│   │   └── routeRoutes.js
│   │
│   ├── services/
│   │   ├── routing.js
│   │   └── safetyScore.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md

🛠️ Technology Stack
Frontend
React
Vite
JavaScript
Tailwind CSS
React Leaflet
Leaflet
Axios
Lucide React
Backend
Node.js
Express.js
Axios
dotenv
CORS
Maps & Routing
OpenStreetMap
Leaflet
OpenRouteService
Algorithm
Weighted Safety Scoring
Route Comparison
Safety Preference Weighting

🔄 Application Flow
1. User enters starting location
              ↓
2. User enters destination
              ↓
3. User selects safety preferences
              ↓
4. Frontend sends request to backend
              ↓
5. Backend geocodes locations
              ↓
6. Routing service calculates routes
              ↓
7. Safety engine evaluates routes
              ↓
8. Safety score is generated
              ↓
9. Routes are ranked
              ↓
10. Safest route is recommended
              ↓
11. Routes are displayed on map
              ↓
12. User compares and selects a route
🚀 Getting Started
Prerequisites

Make sure you have installed:

Node.js
npm
Git

Check your versions:

node --version
npm --version
git --version
📥 Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/SafeRoutes.git

Move into the project:

cd SafeRoutes
🎨 Frontend Setup
cd frontend
npm install
Create:

frontend/.env

Add:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

The frontend will normally run at:

http://localhost:5173
⚙️ Backend Setup

Open another terminal.

cd backend
npm install

Create:

backend/.env
Add:

PORT=5000
ORS_API_KEY=your_openrouteservice_api_key

Start the backend:

npm run dev

The backend will run at:

http://localhost:5000
🔑 OpenRouteService API

SafeRoutes uses OpenRouteService for pedestrian routing and geocoding.

Create an OpenRouteService account and generate an API key.

Then add it to:

backend/.env
ORS_API_KEY=your_api_key_here
Important

Never commit your API key to GitHub.

Your .gitignore should contain:

node_modules/
.env
.env.*
!.env.example
🧪 Demo/Fallback Mode

SafeRoutes also includes a fallback mode for development and demonstrations.

If no OpenRouteService API key is available:

ORS_API_KEY
     ↓
Not available
     ↓
Demo routing data
     ↓
Safety engine
     ↓
Route comparison

This allows the application to continue running during development.
🔌 API
Get Safe Routes
Endpoint
POST /api/routes
Request

{
  "start": "Meerut",
  "destination": "Delhi",
  "preferences": {
    "lighting": true,
    "isolated": true,
    "cameras": true,
    "risk": true
  }
}

Response
{
  "success": true,
  "start": "Meerut",
  "destination": "Delhi",
  "routes": [
    {
      "id": 1,
      "name": "Safest Route",
      "safety": 92,
      "risk": "Low",
      "distance": "4.8 km",
      "time": "18 min"
    }
  ]
}
🧮 Safety Scoring Example

Suppose a route has:

Lighting       = 90
Crime Safety   = 85
CCTV           = 80
Activity       = 75
Isolation      = 90

The system calculates:

90 × 0.30
85 × 0.25
80 × 0.15
75 × 0.10
90 × 0.20

Result:

Safety Score ≈ 86/100

The route can then be classified as:

80–100 → Low Risk
60–79  → Medium Risk
0–59   → High Risk
📊 Route Comparison

SafeRoutes allows users to compare multiple route characteristics.

Factor	Safest	Balanced	Fastest
Safety	🟢 High	🟡 Medium	🔴 Lower
Distance	Medium	Medium	Short
Travel Time	Medium	Medium	Fast
Lighting	High	Medium	Low
Isolation	Low	Medium	Higher
CCTV	High	Medium	Lower

This demonstrates the core concept:

The fastest route isn't always the safest route.

👩 Why This Matters for Women

Women may face additional safety concerns while walking, particularly:

At night
In poorly lit areas
In isolated locations
In areas with low pedestrian activity
In locations with limited surveillance

SafeRoutes aims to provide users with additional information so they can make more informed route choices.

The system is designed to assist users, not guarantee their safety.

🎯 Buildathon MVP

The current MVP focuses on the core problem:

Implemented
 Start and destination input
 Interactive map
 Pedestrian route calculation
 Route comparison
 Safety score
 Risk classification
 Safety preferences
 Lighting consideration
 Isolation consideration
 CCTV consideration
 Crime-risk factor
 Safety-based recommendation
 Route visualization
 OpenRouteService integration
 Demo fallback routing
🔮 Future Improvements
1. Real Safety Datasets

Integrate public datasets containing:

Crime statistics
Street lighting
CCTV locations
Police stations
Emergency facilities
Pedestrian density

This would make safety scores location-specific rather than relying on demo/default data.

2. Time-Based Safety

Safety can vary throughout the day.

Future scoring could consider:

Morning
   ↓
Afternoon
   ↓
Evening
   ↓
Night

For example, an isolated road may have a different safety score at 2 PM compared with 11 PM.

3. Real-Time Data

Future versions could incorporate:

Traffic
Crowds
Road closures
Public alerts
Local incidents
Weather conditions
4. AI Safety Explanation

An AI assistant could explain:

"Route A is recommended because it has better lighting coverage, higher pedestrian activity, and lower exposure to high-risk areas."

This makes the safety score easier to understand.

5. Emergency Features

Potential future features:

SOS button
Trusted contacts
Live location sharing
Emergency services
Nearby police stations
Nearby hospitals
Safe-zone navigation
6. Personalized Safety Profiles

Users could define preferences such as:

Safety Priority
      ↓
Low ───── Balanced ───── High

The routing algorithm could dynamically adjust its weights.

🔐 Privacy & Security

SafeRoutes should follow privacy-first principles.

Future versions should:

Avoid unnecessary collection of location history
Protect user location data
Secure API keys
Use HTTPS in production
Avoid storing sensitive location information unnecessarily
Follow applicable data protection requirements

API keys should always be stored in environment variables.

⚠️ Safety Disclaimer

SafeRoutes provides safety-oriented route recommendations, not guarantees of personal safety.

Safety scores are estimates based on available data and assumptions. Real-world conditions can change rapidly.

Users should always exercise their own judgment and follow local safety guidance.

🌍 Impact

SafeRoutes aims to make navigation more safety-aware, transparent, and user-centered.

Instead of forcing users to choose between:

Fastest

and

Safest

SafeRoutes presents the trade-off clearly:

              SAFETY
                 ↑
                 │
          🟢 Safest
                 │
                 │
          🟡 Balanced
                 │
                 │
          🔴 Fastest
                 │
                 └────────────→ TIME

The goal is not simply to find a path.

The goal is to help users choose a path that better matches their safety needs.

🏆 Buildathon Vision

Our vision is to evolve SafeRoutes into a city-scale safety-aware navigation platform.

Today's MVP
     ↓
Safety-Weighted Routing
     ↓
Real Safety Datasets
     ↓
Real-Time Safety Signals
     ↓
Personalized Navigation
     ↓
AI Safety Assistant
     ↓
Safer Urban Mobility
👨‍💻 Team

Built for:

DevCrest Buildathon '26

Project

SafeRoutes — Safety-Weighted Navigation

Problem Category

Women's Safety / Smart Mobility / Navigation

📜 License

This project is created for educational and hackathon purposes.

You may adapt and extend the project according to the requirements of your competition and the licenses of the third-party technologies and datasets used.

⭐ If you like the idea

Give the project a star ⭐ and consider contributing improvements to make navigation more safety-aware.


### One thing I'd change before committing it

Because your current ORS implementation can sometimes return only **one genuinely routed alternative**, I intentionally described the fallback carefully rather than claiming that all three displayed routes are always independently real routes. That's important during judging—don't claim something the implementation doesn't actually guarantee.

For GitHub, your root should ultimately be:

```text
SafeRoutes/
├── frontend/
├── backend/
├── .gitignore
└── README.md

And your first commit can be:

git add .
git commit -m "feat: build SafeRoutes safety-weighted navigation MVP"
git push origin main
````
