# MERN To-Do App

This repository contains a MERN to-do application with separate frontend and backend codebases.

## About the Project

This project is a full-stack to-do app built with MongoDB, Express, React, and Node.js.
Users can manage daily tasks through the frontend interface, while the backend handles API requests, data storage, and application logic.

With this project, you can:

- create new tasks
- view saved tasks
- update existing tasks
- delete tasks
- work with a separate frontend and backend during development

## Project Structure

- `frontend/`: React + Vite client
- `backend/`: Node.js + Express API

## Getting Started

Make sure Node.js and npm are installed on your system.

Install dependencies:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Run the Frontend

Start the frontend development server:

```bash
cd frontend
npm run dev
```

This runs the Vite dev server for the React app.

## Run the Backend

Start the backend server with nodemon:

```bash
cd backend
npm run dev
```

This project uses the script `nodemon index.js`, so you can also run:

```bash
nodemon index.js
```

## Extra Notes

- Keep the frontend and backend running in separate terminals during development.
- Copy the backend environment example if needed and update your values before starting the server.
- The frontend is used for the user interface, while the backend handles API routes and database logic.

## Branches

- `main`: base repository setup
- `frontend`: frontend application
- `backend`: backend application
