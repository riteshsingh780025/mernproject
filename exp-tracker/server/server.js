const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: "./config.env" });

const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const con = require('./db/connection.js');

// Using routes
app.use(require('./routes/route'));

// Establish MongoDB connection and start the server
con.then(db => {
    if (!db) {
        console.error("MongoDB connection failed.");
        process.exit(1);
    }

    // Start the HTTP server
    const server = app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`);
    });

    server.on('error', err => {
        console.error(`Failed To Connect with HTTP Server: ${err}`);
    });

}).catch(error => {
    console.error(`Connection Failed...! ${error}`);
});
