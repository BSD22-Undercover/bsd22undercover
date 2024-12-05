const { Op } = require('sequelize')
const { User, Profile, Tag, Post } = require('../models')
const bcrypt = require('bcrypt')
const ImageKit = require('imagekit')

const imagekit = new ImageKit({
    publicKey: 'public_rf2g5reFPnDVYH5DIGaSUPG2H9U=',
    privateKey: 'private_nmBguaFjKMKF0LWqch130aGINsY=',
    urlEndpoint: 'https://ik.imagekit.io/matguchi18/',
});

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
            if (!user) {
                return res.send(`Email not registered`)
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.send('Incorrect password');
            }

            req.session.userId = user.id;

            const profile = await Profile.findOne({ where: { UserId: user.id } });

            if (!profile) {
                return res.redirect('/set-username');
            }

            res.redirect("/home")
        } catch (error) {
            res.send(error)
        }
    }

    static async showProfile(req, res) {
        try {
            // Find the profile using the UserId from the URL parameter
            const profile = await Profile.findOne({
                where: {
                    UserId: req.params.UserId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email'],
                        include: [  // Nested includes
                            {
                                model: Profile,
                                attributes: ['username', 'bio']
                            }
                        ]
                    },
                    {
                        model: Post,
                        attributes: ['caption', 'image']
                    }
                ]
            });
    
            res.render("profile.ejs", { profile, posts: profile.Posts, userId: req.session.userId  });
        } catch (error) {
            res.send(error);
        }
    }

    static async home(req, res) {
        try {
            
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: Profile,
                                attributes: ['username', 'bio', 'profilePicture'] // Include profile information
                            }
                        ],
                        attributes: ['name', 'email'] // Ensure 'name' is included here
                    }
                ]
            });

            
            res.render("home.ejs", { posts, userId: req.session.userId });
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async setUsernameForm(req, res) {
        try {
            res.render("setUsername.ejs");
        } catch (error) {
            res.send(error);
        }
    }

    static async setUsername(req, res) {
        try {
            const { username, bio, profilePicture } = req.body;
            const userId = req.session.userId;

            await Profile.create({
                username,
                bio,
                profilePicture,
                UserId: userId
            });

            res.redirect("/home");
        } catch (error) {
            res.send(error);
        }
    }

    static async createPost(req, res) {
        try {
            const { caption } = req.body;
        const imageFile = req.file;

        if (!req.session.userId) {
            return res.redirect('/login');
        }

        // Upload the image to ImageKit
        const uploadImage = await imagekit.upload({
            file: imageFile.buffer.toString('base64'),
            fileName: imageFile.originalname,
            folder: '/posts', // Optional folder for the image
        });

        // Find the profile associated with the logged-in user
        const userProfile = await Profile.findOne({
            where: { UserId: req.session.userId }
        });

        // If profile doesn't exist, you may want to redirect to the set-username page
        if (!userProfile) {
            return res.redirect('/set-username');
        }

        // Create the post with ProfileId
        const newPost = await Post.create({
            caption,
            image: uploadImage.url,
            UserId: req.session.userId,
            ProfileId: userProfile.id // Set ProfileId explicitly
        });

        res.redirect("/home");
        } catch (error) {
            res.send(error)
        }
    }

    static async showEditProfile(req, res) { 
        try {
            const profile = await Profile.findOne({
                where: {
                    UserId: req.params.UserId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email'],
                        include: [  // Nested includes
                            {
                                model: Profile,
                                attributes: ['username', 'bio']
                            }
                        ]
                    },
                    {
                        model: Post,
                        attributes: ['caption', 'image']
                    }
                ]
            });
    
            res.render("profile.ejs", { profile, posts: profile.Posts });
        } catch (error) {
            res.send (error)
        }
    }






    static async aboutUs(req, res) {
        try {


        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = Controller