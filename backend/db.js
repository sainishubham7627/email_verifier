require('dotenv').config();  // Load environment variables
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;  // Use MongoDB Atlas URI from .env

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((e) => console.log("MongoDB connection error:", e.message));
};

module.exports = connectToMongo;
