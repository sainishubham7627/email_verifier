const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/noteify";

const connectToMongo = async () => {
    try {
        // Mongoose 6+ no longer requires `useNewUrlParser` or `useUnifiedTopology`
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

module.exports = connectToMongo;
