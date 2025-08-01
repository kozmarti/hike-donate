# 🥾 Hike & Donate

**Hike & Donate** is a long-term trekking tracker that displays real-time hiking stats, visualizes routes on a map, connected to Strava to update data automatically. Built for adventurers who want to log and share their journey — even in remote locations — and for those who want to trek with a purpose.


![image](https://github.com/user-attachments/assets/020df6bc-fe37-4c57-9723-2ae5141ad861)

---
## 🌄 Features

- **Live Hiking Stats**  
  Tracks and displays:  
  - Total distance covered  
  - Maximum & minimum altitude  
  - Total elevation gain & loss  
  - Elapsed time

- **Interactive Map View**  
  Visualize your route with an interactive map powered by **Leaflet**.

  ![image](https://github.com/user-attachments/assets/8a126634-0652-4b94-90e3-f5120e116525)


- **Strava Integration (Webhook)**  
  Automatically pulls real-time activity data from Strava via webhooks.

- **Offline / Manual Logging**  
  Encounter a dead battery or no signal? Manually log data directly into the system.
![image](https://github.com/user-attachments/assets/abdfe8fe-935b-4f7c-b2fa-01b00f073d8b)

- **Activity Photo Integration**   
Automatically import photos from Strava or upload them manually. All images are organized chronologically in a seamless photo album linked to your activities.
![image](https://github.com/user-attachments/assets/3a652585-6a4e-4213-93a6-29f3592c0324)

- **Automated Donation Tracking**
The app automatically fetches the current collected amount from the Leetchi donation pot daily and keeps it updated in the database — no manual work needed!

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) with TypeScript  
- **UI Framework:** [Material UI (MUI)](https://mui.com/) for modern and responsive components  
- **Mapping Library:** [Leaflet](https://leafletjs.com/) for dynamic map rendering  
- **File Upload (Manual Entry):** [Uploadthing](https://uploadthing.com/) for fast and secure image uploads — custom feature added: images are automatically resized for optimizing image quality, performance, and storage efficiency  
- **Backend:** API routes within [Next.js](https://nextjs.org/)  
- **Database:** [MongoDB](https://www.mongodb.com/)  
- **External Integration:** [Strava API](https://developers.strava.com/)  
- **Web Scraping & Automation** : scheduled **GitHub Actions** workflows to run the scraping script daily and update MongoDB automatically

---

## ⚙️ Setup

### Prerequisites

- Node.js  
- MongoDB  
- UploadThing account  
- Strava account (to create API credentials)  

### Installation

```bash
git clone https://github.com/kozmarti/hike-donate.git
cd hike-donate
npm install
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Strava API credentials
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_REFRESH_TOKEN=your_strava_refresh_token
STRAVA_USER_ID=your_strava_user_id
STRAVA_PROJECT_NAME=your_strava_project_name
SUBSCRIPTION_ID=your_strava_subscription_id

# Next.js public environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRAVA_USER_ID=your_strava_user_id
NEXT_PUBLIC_STRAVA_PROJECT_NAME=your_strava_project_name

# Uploadthing file upload token
UPLOADTHING_TOKEN=your_uploadthing_token

# Session and API secrets
SESSION_SECRET_KEY=your_session_secret_key
API_SECRET_TOKEN=your_api_secret_token
```

## Run Locally

Run the development server with:

```bash
npm run dev
```
---
## 🚨 Manual Data Entry

When trekking offline or facing technical issues, users can manually log key details of the day's hike:

- Starting date  
- Moving time (duration)  
- GPS coordinates (displayed as a clickable marker on the map)  
- Photo upload specific to that day  

🧠 The app will then automatically calculate:

- Distance  
- Altitude metrics (API used: [Open-Meteo](https://api.open-meteo.com))  
- Elevation gain & loss  

---

## 🌐 Live Updates via Webhook

When a new activity is recorded in Strava:

- The Strava webhook triggers the backend  
- Activity data (route, stats, and photos) is fetched  
- All metrics and visualizations update in real-time in the app  

---

## 📦 Future Enhancements

- Donation Integration: Link your hike to fundraising campaigns  
- Export Tools: PDF/CSV summaries of your trek  
- Media Gallery: Organize uploaded photos by day or location  
