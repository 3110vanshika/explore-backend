const mongoose = require('mongoose')

const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Successfully connected to database ${conn.connection.host}`)
    } catch (error) {
        console.log(error?.message)
    }
}

module.exports = connectDb;