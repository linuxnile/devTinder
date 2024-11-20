const express = require("express")
const app = express()
const { connectDB } = require("./config/database")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const userAuth = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser())

app.use("/", require("./routes/auth"))
app.use("/", require("./routes/profile"))
app.use("/", require("./routes/request"))


connectDB().then(() => {
    console.log("Database Connected Successfully")
    app.listen(7777, () => {
        console.log("Server is running at Port 7777")
    })
}).catch((err) => {
    console.log("Database Connection Unsuccessful")
})