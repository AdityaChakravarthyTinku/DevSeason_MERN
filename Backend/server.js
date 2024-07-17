const express = require('express');
const connectDB = require('./database/db');

const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
dotenv.config();
const cookieParser = require('cookie-parser');

// Add cookie parser middleware before your routes

const app = express();

connectDB();
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // This allows cookies to be sent from the frontend
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);
app.get('/', (req, res) => {

    res.send('Backend is running...');
    console.log('Backend is running...');
    });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
