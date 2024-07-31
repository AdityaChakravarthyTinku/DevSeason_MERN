const express = require('express');
const connectDB = require('./database/db');

const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
dotenv.config();
const cookieParser = require('cookie-parser');



const app = express();

connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    'https://dev-season-mern-9hyovefy6-adityas-projects-9aa86a3f.vercel.app',
    'https://gigglecode.online',
    'https://www.gigglecode.online',
    'https://backend.gigglecode.online',
    'https://backend.gigglecode.online',
    'https://dev-season-mern.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// app.use(cors());
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
