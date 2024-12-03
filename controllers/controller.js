const { Op } = require('sequelize')
const { User, Profile, Tag, Post } = require('../models')
const bcrypt = require('bcrypt')

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
            const hashedPassword = await bcrypt.hash(password, 10)

            const newAccount = await User.create({
                email,
                password: hashedPassword,
                role: "user",
            })
            res.redirect("/")
        } catch (error) {
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            
            res.render("login.ejs")
        } catch (error) {
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body; 
            const user = await User.findOne({
                where: {
                    email
                }
            })
            if(!user) {
                return res.send(`Email not registered`)
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.send('Incorrect password'); 
            }
            res.redirect("/home")
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