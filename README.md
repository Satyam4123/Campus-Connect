# Campus-Connect
A campus platform connecting students, faculty, and staff with essential resources and activities at MNNIT for streamlined communication and collaboration.



# MERN Stack Project

This project is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. The project structure is divided into two main folders:

- `backend`: Contains the Node.js and Express backend code.
- `frontend`: Contains the React frontend code.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install All Dependencies](#2-install-all-dependencies)
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)
  - [4. Run the Application](#4-run-the-application)
- [Accessing the Application](#accessing-the-application)


## Prerequisites

Ensure the following software is installed on your system:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or available as a cloud instance)
- [Git](https://git-scm.com/)


Also, ensure that you have google API for authentication using OAuth set up by going in the google console.

## Installation

### 1. Clone the Repository
First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-name>
```
### 2. Install All Dependencies
To install all dependencies for both the backend and frontend folders simultaneously, you can use the following commands:

From the project root directory, run:

```bash
cd Backend
npm install
```

```bash
cd ..
cd Frontend
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the backend directory to store configuration for environment variables. Add the following keys:

```bash
PORT=3000 
MONGO_URL=<your-mongodb-connection-string>/mnnit
JWT_SECRET=<your-jwt-secret-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
SESSION_SECRET=<your-session-secret>
```

### 4. Run the Application
Start both the backend and frontend servers in separate terminals.

Start the Backend Server
In the backend folder, start the server by running:

```bash
cd backend
npm start
```
This will start the backend server at http://localhost:5000 (or your specified port).


Start the Frontend Development Server
In the frontend folder, start the React development server by running:

```bash
cd Frontend
npm run dev
```
## Accessing the application
This will start the frontend server at http://localhost:5173 by default.

Accessing the Application
Once both servers are running, open your browser and navigate to http://localhost:5173 to access the application.

Frontend: Served on http://localhost:5173
Backend: Served on http://localhost:3000
