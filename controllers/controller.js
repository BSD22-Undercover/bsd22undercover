const { Op } = require('sequelize')
const { User, Profile, Tag, Post } = require('../models')

class Controller {
    
    static landingPage(req, res) {
        try {
            res.render("landingPage.ejs")
        } catch (error) {
            res.send(error)
        }
    }

    static async registerForm(req, res) {
        try {
            res.render("register.ejs")
        } catch (error) {
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            const { email, password } = req.body

            const newAccount = await User.create({
                email,
                password,
                role: "user",
            })
            res.redirect("/")
        } catch (error) {
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            
            res.render("login.ejs")
        } catch (error) {
            res.send(error)
        }
    }

    static async showProfile(req, res) {
        try {
            const profile = await Profile.findByPk(+req.params.UserId)
            res.render("profile.ejs", profile)
        } catch (error) {
            res.send(error)
        }
    }

    static async
}

module.exports = Controller