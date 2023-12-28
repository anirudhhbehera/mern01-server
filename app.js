const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

dotenv.config({ path: './config.env' });

require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());
app.use(cors({
    origin: 'https://mern01-frontend.netlify.app', // Replace with your frontend domain
    credentials: true // Allow credentials (if required)
  }));

// we link the router files to make our route easy 
app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;


// Middelware 
// const middleware = (req,res, next) => {
//     console.log(`Hello my Middleware`);
//     next();
// }



// app.get('/about', (req, res) => {
//     console.log(`Hello my About`);
//     res.send(`Hello About world from the server`);
// });

// app.get('/contact', (req, res) => {
    
//     res.send(`Hello Contact world from the server`);
// });

// app.get('/signin', (req, res) => {
//     res.send(`Hello Login world from the server`);
// });

// app.get('/signup', (req, res) => {
//     res.send(`Hello Registration world from the server`);
// });

app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
})


