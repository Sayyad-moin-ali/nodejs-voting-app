const mongoose = require ('mongoose');
require('dotenv').config();

const mongourl = process.env.MONGODB_URL_LOCAL
// const mongourl = process.env.MONGODB_URL

mongoose.connect(mongourl)

const db = mongoose.connection;

db.on('connected', () => {
    console.log("connected to  mongodb server");
})

db.on('error', (err) => {
    console.log("mongodb connection erroe ", err);
})

db.on('disconnected', () => {
    console.log("Mongo disconnected");
})

module.exports = db;