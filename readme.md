# 🛡️ Safe-Routes

### 🚶 Find safer routes. Travel smarter. Stay protected.

**Safe-Routes** is a smart route-planning web application designed to help users find and compare routes based not only on distance and travel time, but also on **safety-related factors**.

Instead of simply asking _"What is the shortest route?"_, Safe-Routes aims to answer:

> **"What is the safer route to my destination?"**

The project combines a modern React frontend with a Node.js/Express backend and real-world routing data to provide users with useful route information.

---

## 🌟 Features

### 🗺️ Smart Route Search

Users can enter:

- Starting location
- Destination
- Travel preferences

The application retrieves real route information and displays available routes.

### 🛡️ Safety-Focused Routing

Safe-Routes is designed to consider safety-related information while comparing routes.

Routes can be evaluated using factors such as:

- Route distance
- Estimated travel time
- Road conditions/data availability
- Safety-related route information
- Overall route suitability

### 📍 Real-Time Route Data

The application uses a routing API to retrieve real-world route information instead of relying on static or dummy routes.

### 📊 Route Comparison

Multiple route options can be compared so users can make a more informed decision.

Example:

| Route   | Distance |   Time | Safety      |
| ------- | -------: | -----: | ----------- |
| Route A |   5.2 km | 14 min | 🟢 Safer    |
| Route B |   4.6 km | 11 min | 🟡 Moderate |
| Route C |   6.1 km | 16 min | 🟢 Safer    |

### 📱 Responsive UI

The application is designed to work across:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

### ⚡ Fast & Modern

Built using modern web technologies including React, Vite, Node.js and Express.

---

# 🎯 Problem Statement

Traditional navigation applications generally prioritize factors such as:

- Shortest distance
- Fastest travel time
- Traffic conditions

However, the **shortest route is not always the safest route**.

A route may pass through areas that users would prefer to avoid, especially when travelling:

- At night
- Alone
- In unfamiliar locations
- On foot
- During emergencies

Safe-Routes aims to provide an additional safety-focused layer to route planning.

---

# 💡 Proposed Solution

Safe-Routes provides a route-planning platform where users can enter their source and destination and receive real route options.

Instead of displaying only distance and duration, the application is designed to evaluate routes from a **safety perspective**.

The system can combine routing information with safety-related data to generate a safety-oriented recommendation.

The goal is not to replace existing navigation applications, but to provide an additional **safety-focused decision layer**.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    │   Web Browser       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                         REST API Request
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
          ┌─────────────────┐    ┌─────────────────┐
          │ Routing API     │    │ Safety Data     │
          │ / Route Engine  │    │ / Analysis      │
          └─────────────────┘    └─────────────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │ Route Processing &  │
          │ Safety Evaluation   │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Safe Route Results  │
          └─────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React.js     | Building the user interface     |
| Vite         | Frontend development/build tool |
| JavaScript   | Application logic               |
| Tailwind CSS | Styling and responsive UI       |
| Axios        | API communication               |
| React Router | Client-side navigation          |

---

## Backend

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Backend runtime                 |
| Express.js | REST API framework              |
| Axios      | External API requests           |
| CORS       | Cross-origin communication      |
| dotenv     | Environment variable management |

---

## APIs

Safe-Routes uses a routing service to retrieve real-world route information.

The backend communicates with the routing API and processes the returned route data before sending the required information to the frontend.

> **Important:** API keys are stored in environment variables and are never committed to GitHub.

---

# 📂 Project Structure

The project is organized into separate frontend and backend applications.

```text
safe-routes/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/
│   │
│   ├── controllers/
│   ├── routes/
│   │   └── routeRoutes.js
│   │
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# 🔄 How Safe-Routes Works

### Step 1 — User enters locations

The user provides:

```text
Start Location
        ↓
Destination
```

### Step 2 — Frontend sends request

The React application sends the information to the backend.

Example:

```http
POST /api/routes
```

### Step 3 — Backend processes request

The Express server receives the request and validates the required information.

### Step 4 — Routing API request

The backend communicates with the routing service to retrieve real route information.

### Step 5 — Route analysis

The backend processes the returned route information and evaluates available route options.

### Step 6 — Results returned

The backend sends the processed information back to the frontend.

### Step 7 — User sees route options

The frontend displays:

- Route distance
- Estimated duration
- Route options
- Safety-related information
- Recommended route

---

# 🔌 API Structure

## Get Safe Routes

### Endpoint

```http
POST /api/routes
```

### Request

```json
{
  "start": "Aligarh",
  "destination": "Delhi"
}
```

### Response

The backend returns route information retrieved and processed from the routing service.

Example structure:

```json
{
  "success": true,
  "routes": [
    {
      "distance": 135000,
      "duration": 10800,
      "safetyScore": 85
    }
  ]
}
```

> The exact response structure may change as the safety-analysis system is expanded.

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/safe-routes.git
```

Move into the project:

```bash
cd safe-routes
```

---

# 💻 Frontend Setup

Open a terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

For development, if your project uses nodemon:

```bash
npm run dev
```

The backend will normally run on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

ORS_API_KEY=your_api_key_here

CLIENT_URL=http://localhost:5173
```

If additional APIs or databases are added later, their credentials should also be stored in `.env`.

### ⚠️ Never commit `.env`

Make sure your `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
dist/
```

---

# 🔑 API Key Security

Never write your API key directly inside frontend code.

❌ Don't do this:

```javascript
const API_KEY = "your-secret-api-key";
```

Instead, store it in the backend `.env` file:

```env
ORS_API_KEY=your-secret-api-key
```

Then access it from Node.js:

```javascript
process.env.ORS_API_KEY;
```

This prevents exposing your secret API key to users through the browser.

---

# 🌐 Frontend API Configuration

The frontend communicates with the backend through Axios.

Example:

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export const getSafeRoutes = async (data) => {
  const response = await API.post("/routes", data);
  return response.data;
};
```

---

# 🚀 Deployment

Safe-Routes can be deployed using modern cloud platforms.

## Frontend

The React/Vite frontend can be deployed on:

```text
Vercel
```

Example production frontend:

```text
https://safe-routes-eight.vercel.app
```

## Backend

The Express backend can be deployed using platforms such as:

- Render
- Railway
- Fly.io
- AWS

After deployment, update the frontend API URL.

Example:

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

# 🌍 Production CORS

The backend should allow requests from your production frontend.

Example:

```javascript
cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://safe-routes-eight.vercel.app",
  ],
});
```

For production, environment variables are preferable to hardcoding URLs.

---

# 📸 Screenshots

Add screenshots of your project here after the UI is finalized.

Example:

```markdown
## 📸 Screenshots

### Home Page

![Safe-Routes Home](./screenshots/home.png)

### Route Search

![Route Search](./screenshots/routes.png)

### Route Results

![Route Results](./screenshots/results.png)
```

Recommended screenshots:

1. Home page
2. Route search page
3. Route results
4. Safe route recommendation
5. Mobile responsive view

---

# 🎯 Target Users

Safe-Routes can be useful for:

- 👩 Women travelling alone
- 🎓 Students
- 🚶 Pedestrians
- 🚴 Cyclists
- 🌙 People travelling at night
- 🧳 Travellers in unfamiliar areas
- 👨‍👩‍👧 Families
- 🚗 General commuters

---

# 🌟 Key Advantages

### Traditional Navigation

```text
Shortest Route
       ↓
Fastest Route
       ↓
Navigation
```

### Safe-Routes

```text
Available Routes
       ↓
Route Information
       ↓
Safety Analysis
       ↓
Route Comparison
       ↓
Safer Route Recommendation
```

This makes Safe-Routes more focused on **personal safety and informed route selection**.

---

# 🔮 Future Enhancements

The project can be expanded significantly.

### 🚨 Emergency Mode

Add an emergency mode that can:

- Share live location
- Contact emergency contacts
- Provide quick access to emergency services
- Automatically send the current route

### 👮 Safety Hotspots

Display areas with reported:

- Crime incidents
- Accidents
- Unsafe locations
- Other safety concerns

### 🌙 Night Safety

Allow users to select:

```text
Day Mode
Night Mode
```

and apply different safety considerations.

### 📍 Live Location

Track the user's current location using browser geolocation.

### 📊 Advanced Safety Score

Develop a more sophisticated scoring system.

Example:

```text
Safety Score =
    Lighting
  + Crime Data
  + Road Conditions
  + Traffic
  + Public Activity
  + Distance
  + Time of Day
```

### 🤖 AI Safety Assistant

An AI assistant could answer questions such as:

> "Which route should I take if I'm travelling alone at 10 PM?"

### 🗺️ Heatmap

Display safety information on a map:

```text
🟢 Low Risk
🟡 Medium Risk
🔴 High Risk
```

### 👥 Community Reports

Allow users to report:

- Unsafe streets
- Harassment-prone areas
- Road damage
- Poor lighting
- Accidents
- Suspicious activity

---

# 🧠 Future AI Integration

An AI-based recommendation layer could eventually analyze multiple factors.

For example:

```text
User:
Travelling alone
↓
Time:
10:30 PM
↓
Routes:
A, B, C
↓
Safety Data
↓
AI Analysis
↓
Recommended Route
```

The AI could explain the recommendation in simple language:

> **Recommended Route:** Route B
> It is slightly longer but has a better safety score and avoids higher-risk areas.

---

# 📈 Future Roadmap

## Phase 1 — Foundation

- [x] React frontend
- [x] Node.js backend
- [x] Express API
- [x] Route API integration
- [x] Basic route search

## Phase 2 — Route Intelligence

- [ ] Route comparison
- [ ] Safety scoring
- [ ] Safety indicators
- [ ] Better route recommendations

## Phase 3 — Safety Features

- [ ] Safety hotspots
- [ ] Community reports
- [ ] Night travel mode
- [ ] Emergency contacts
- [ ] Live location

## Phase 4 — AI

- [ ] AI safety assistant
- [ ] Personalized route recommendations
- [ ] Risk prediction
- [ ] Natural-language route explanations

## Phase 5 — Production

- [ ] Authentication
- [ ] Database
- [ ] Analytics
- [ ] Performance optimization
- [ ] Security improvements
- [ ] Mobile optimization
- [ ] Full production deployment

---

# 🔒 Security Considerations

Safe-Routes should follow good security practices:

- API keys stored in environment variables
- `.env` excluded from Git
- Input validation
- CORS configuration
- HTTPS in production
- Secure API endpoints
- Rate limiting
- Error handling
- Protection against malicious input

---

# 🧪 Testing

Before deployment, test:

### Frontend

```text
✓ Location input
✓ Destination input
✓ Form validation
✓ API requests
✓ Loading states
✓ Error states
✓ Route rendering
✓ Responsive design
```

### Backend

```text
✓ API endpoint
✓ Request validation
✓ External API communication
✓ Error handling
✓ Invalid locations
✓ Missing API key
✓ API failures
✓ CORS
```

---

# 🐛 Troubleshooting

## Backend not connecting

Check:

```text
Backend → http://localhost:5000
Frontend → http://localhost:5173
```

Make sure both servers are running.

---

## CORS Error

Check the backend CORS configuration and ensure the frontend URL is included.

Example:

```javascript
origin: ["http://localhost:5173", "http://127.0.0.1:5173"];
```

---

## API Key Error

Check that `.env` contains:

```env
ORS_API_KEY=your_api_key
```

Then restart the backend.

Environment changes normally require restarting the Node.js server.

---

## Route API Not Working

Check:

1. API key is valid
2. API service is enabled
3. Backend is running
4. Internet connection is available
5. Request coordinates are valid
6. API quota has not been exceeded

---

# 🤝 Contributing

Contributions are welcome!

### 1. Fork the repository

```bash
git fork
```

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/safe-routes.git
```

### 3. Create a branch

```bash
git checkout -b feature/new-feature
```

### 4. Make your changes

### 5. Commit

```bash
git add .
git commit -m "feat: add new safety feature"
```

### 6. Push

```bash
git push origin feature/new-feature
```

### 7. Create a Pull Request

---

# 📜 License

This project is currently intended for **educational, portfolio, and development purposes**.

A formal open-source license can be added later, such as the MIT License.

---

# ⚠️ Disclaimer

Safe-Routes is intended to provide **safety-oriented route information**, not a guarantee that a particular route is completely safe.

Safety conditions can change due to:

- Time
- Weather
- Traffic
- Local events
- Road conditions
- Crime/activity changes
- Data availability

Users should always use their own judgment and follow local safety guidance.

---

# 👨‍💻 Developer

**Lovesh Semwal**

B.Tech Computer Science Student

Interested in:

- Full-Stack Development
- React.js
- Node.js
- Backend Development
- APIs
- AI-powered applications
- Problem Solving
- Software Development

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 💬 Project Vision

> **Safe-Routes is built with a simple idea: navigation should not only help people reach their destination — it should help them make safer decisions along the way.**

**Built with ❤️ using React, Node.js, Express and real-world routing data.**
