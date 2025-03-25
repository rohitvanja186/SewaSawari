const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()

// routes
const authRoute = require("./routes/authRoute")
const adminRoute = require("./routes/adminRoute")
const ownerRoute = require("./routes/ownerRoute")

// database connection
require("./model/index")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))

app.use(express.static('uploads/'))

app.use("", authRoute);
app.use("/admin", adminRoute);
app.use("/owner", ownerRoute);


// server listening
app.listen (5000, () => {
    console.log("the project started in 5000 port")
})