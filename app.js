const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const express = require('express')
const cors = require('cors')
const connectDb = require('./database/db')
const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoutes')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json("Hello");
})

// routes
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)

const port = process.env.PORT
connectDb().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is successfully running on port ${port}`);
    });
}).catch((error) => {
    console.error("Database connection failed: ", error);
});