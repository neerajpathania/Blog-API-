require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
const http = require('http')
const app = express()

const connectDB = require('./db/conn')
const registerRoutes = require('./routes/registerRoutes')

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use("/api/user", registerRoutes);

//connect to the databse and start the server
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb();
        };
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb();
        };
    }
    next();
})

const DB_URL = process.env.DB_URL

const start = async () => {
    console.log("Starting ", DB_URL);
    try {
        await connectDB(DB_URL);
        server.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
};

start(process.env.DATABASE)