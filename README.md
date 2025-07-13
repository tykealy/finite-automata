# Finite Automata

A web application for working with finite automata, including DFA and NFA operations.

## Getting Started

## Prerequisites

### 1. Firebase Project Setup

Before running this application, you need to set up a Firebase project:

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Give your project a name (e.g., "finite-automata")

2. **Register your web app:**
   - In your Firebase project console, click the web icon (</>) to add a web app
   - Give your app a nickname (e.g., "finite-automata-web")
   - You can optionally enable Firebase Hosting
   - Click "Register app"

3. **Get your Firebase configuration:**
   - After registering, Firebase will show you a configuration object
   - It will look something like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDummyApiKey123456789abcdefghijklmnop",
     authDomain: "dummy-project-12345.firebaseapp.com",
     databaseURL: "https://dummy-project-12345-default-rtdb.firebaseio.com",
     projectId: "dummy-project-1234b5",
     storageBucket: "dummy-project-12345.firebasestorage.app",
     messagingSenderId: "987654321098",
     appId: "1:987654321098:web:zyxwvu9876543210",
     measurementId: "G-DUMMY123456"
   };
   ```

4. **Set up environment variables:**
   - Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Fill in your Firebase configuration values in the `.env` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Enable Firebase services (optional):**
   - If you plan to use Firestore Database, go to Firestore Database in the Firebase console and create a database
   - If you plan to use Realtime Database, go to Realtime Database in the Firebase console and create a database

### 2. Node.js and npm

Make sure you have Node.js (version 14 or higher) and npm installed on your system.

## With docker

Build docker image

```bash
docker build -t fa-image .
```

Make container

```bash
docker run --name fa-container -v  Your/path/to/the/project:/usr/src/app -p 3000:3000 fa-image
```

To stop the container

```bash
docker stop fa-container
```

To start the container

```bash
docker start fa-container
```

After starting container you can access the app at http://localhost:3000

## Or you can run the app locally

Install all the dependencies:

```bash
npm install
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

This project uses the following environment variables (defined in `.env`):

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`: Your Firebase database URL
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
