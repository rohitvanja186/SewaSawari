const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()

// routes
const authRoute = require("./routes/authRoute")

// database connection
require("./model/index")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))


app.use("", authRoute);


// server listening
app.listen (3000, () => {
    console.log("the project started in 3000 port")
})