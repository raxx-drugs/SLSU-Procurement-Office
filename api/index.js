import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js"
import http from 'http'
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

const app = express()
dotenv.config()
const BASE_PORT = parseInt(process.env.PORT, 10) || 5000; // The original static port
let TEMPORARY_PORT = parseInt(process.env.TEMPORARY_PORT, 10) || BASE_PORT; // Start from TEMPORARY_PORT or fallback to BASE_PORT


// Serve static files from the 'uploads' folder

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  `http://localhost:${TEMPORARY_PORT}`,
  'https://slsu-procurement-office.onrender.com'
];


app.use('/uploads', cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
}), express.static(path.join(__dirname, 'uploads')));


// Middlewares
app.use(express.json()); // middleware for parsing incoming json

// Routes

import  authRoute  from "./routes/auth.route.js";
import  userRoute  from "./routes/user.route.js";
import ppmpRoutes from './routes/ppmp.route.js'
import  paperRoute  from "./routes/paper.route.js";
import  activityRoute  from "./routes/activity.route.js";


//declaring API
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use('/api/ppmp', ppmpRoutes);
app.use("/api/paper", paperRoute);
app.use("/api/activity", activityRoute);


//middleware for handling error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Inter Server Error!";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })

})

// Helper function to update the .env file
const updateEnvFile = (key, value) => {
    const envFilePath = '.env';
    const envVars = fs.existsSync(envFilePath)
      ? fs.readFileSync(envFilePath, 'utf8').split('\n')
      : [];
  
    const updatedEnvVars = [];
    let found = false;
  
    envVars.forEach((line) => {
      if (line.startsWith(`${key}=`)) {
        updatedEnvVars.push(`${key}=${value}`);
        found = true;
      } else if (line.trim() !== '') {
        updatedEnvVars.push(line);
      }
    });
  
    if (!found) {
      updatedEnvVars.push(`${key}=${value}`);
    }
  
    fs.writeFileSync(envFilePath, updatedEnvVars.join('\n'), 'utf8');
  };

// Helper function to try the next available port
const tryPort = (port, callback) => {
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
        updateEnvFile('TEMPORARY_PORT', port); // Update TEMPORARY_PORT only
        TEMPORARY_PORT = port; // Keep TEMPORARY_PORT in sync
        callback(server);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying the next one...`);
            server.close(() => tryPort(port + 1, callback)); // Close the current server and try next port
        }
    });
};


// Attempt to bind the server to the port (with automatic switching)
tryPort(BASE_PORT || 5000, (server) => {
    connectDB();
    server.on('listening', () => {
        console.log(`Server is up and running!`);
    });
});



app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
const filePath = path.join(__dirname, 'client', 'dist', 'index.html');
  console.log(`Serving file: ${filePath}`);
   if (fs.existsSync(filePath)) {
     res.sendFile(filePath);
   } else {
     res.status(404).send('File not found.');
   }
 });
 console.log(__dirname);