# Hand Sign Detector

A full-stack web application that uses computer vision to detect hand signs in real-time. Built with React, Node.js, and MediaPipe.

## Features

- **Real-time Detection:** Uses MediaPipe Hands for accurate hand tracking and finger counting.
- **User Authentication:** Secure signup and login flow with JWT and bcrypt.
- **Dynamic Dashboard:** View live camera feed with overlayed detection results and statistics.
- **Responsive Design:** Modern UI with glassmorphism effects, fully responsive for different screen sizes.

## Tech Stack

- **Frontend:** React.js, Lucide React, CSS3 (backrop filters, gradients)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Detection:** MediaPipe Hands
- **Authentication:** JSON Web Tokens (JWT), Bcrypt

## Setup Instructions

### Backend

1. Navigate to the `backend` folder and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the following:
   ```env
   PORT=8080
   MONGO_CONN=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `frontend` folder and install dependencies:
   ```bash
   npm install
   ```
2. Start the application:
   ```bash
   npm start
   ```

## Project Structure

- `backend/`: Express server, controllers, and models.
- `frontend/`: React application, components, and pages.
- `src/controllers/Authcontroller.js`: Logic for registration and login.
- `src/pages/Home.js`: Main hand detection interface.
