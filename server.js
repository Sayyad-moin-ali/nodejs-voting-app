const express = require('express')
const app = express();
const db = require('./db')
const bodyparser = require('body-parser');
require('dotenv').config();
// const passport=require('./Auth')


app.use(bodyparser.json())


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`listning on port ${port}`)
})

const userroute = require("./routes/userroute")
const candidateRoute=require('./routes/candidateRoute')

app.use('/user', userroute);
app.use('/candidate',candidateRoute);
