const express = require("express")
const profileRouter = express.Router()
const userAuth = require("../middlewares/auth")
const { validateProfileEditData } = require("../utils/validation")
const bcryptjs = require("bcryptjs")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send("Something went wrong: " + err)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Update not allowed")
        }
        const loggedUser = req.user
        Object.keys(req.body).forEach((key) => {
            return loggedUser[key] = req.body[key]
        })
        await loggedUser.save()
        res.json({ message: `${loggedUser.firstName}, your data updated successfully!`, data: loggedUser })
    } catch (error) {
        res.status(500).send("Something went wrong: " + error)
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user
        const { oldPassword, newPassword } = req.body

        const verifyOldPassword = await bcryptjs.compare(oldPassword, loggedUser.password)
        if (!verifyOldPassword) {
            return res.status(403).send("Old password is incorrect")
        }

        const hashedNewPassword = await bcryptjs.hash(newPassword, 10)
        loggedUser.password = hashedNewPassword
        await loggedUser.save()

        res.send("Password changed successfully")
    } catch (error) {
        res.status(500).send("Something went wrong: " + error)
    }
})

module.exports = profileRouter