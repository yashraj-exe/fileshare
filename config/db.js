require('dotenv').config()
const mongoose = require('mongoose');


const createConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = createConnection;