const express = require("express")
const app = express()
const { connectDB } = require("./config/database")
const User = require("./models/user")
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const userAuth = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)

        const { firstName, lastName, emailId, password, age, photoUrl, about, skills = [] } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ firstName, lastName, emailId, password: hashedPassword, age, photoUrl, about, skills })

        if (skills.length > 5) {
            throw new Error("Skill cannot be more than 5")
        }
        await user.save()
        res.send("User inserted successfully")
    } catch (err) {
        res.status(400).send("Not inserted " + err)
    }
})

app.post("/login", async (req, res) => {
    const { emailId, password } = req.body
    try {
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credential")
        }

        const passCompare = user.validatePassword(password)

        if (passCompare) {
            const token = await user.getJWT()
            res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            res.send("Login Successful")
        } else {
            throw new Error("Invalid Credential")
        }
    } catch (err) {
        res.send("Something went wrong: " + err)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send("Something went wrong: " + err)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user
    res.send(user.firstName + " sent friend request")
})

connectDB().then(() => {
    console.log("Database Connected Successfully")
    app.listen(7777, () => {
        console.log("Server is running at Port 7777")
    })
}).catch((err) => {
    console.log("Database Connection Unsuccessful")
})