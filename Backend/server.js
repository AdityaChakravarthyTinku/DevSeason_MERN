const express = require('express');
const connectDB = require('./database/db');

const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.get('/', (req, res) => {

    res.send('Backend is running...');
    console.log('Backend is running...');
    });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
