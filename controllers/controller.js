<<<<<<< HEAD
const { Op } = require('sequelize')
const { User, Profile, Tag, Post, TagPost } = require('../models')
const bcrypt = require('bcryptjs')
const ImageKit = require('imagekit')
=======
const { Op } = require("sequelize");
const { User, Profile, Tag, Post } = require("../models");
const bcrypt = require("bcryptjs");
const ImageKit = require("imagekit");
const addEmoji = require("../helpers/helper");
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1

const imagekit = new ImageKit({
  publicKey: "public_rf2g5reFPnDVYH5DIGaSUPG2H9U=",
  privateKey: "private_nmBguaFjKMKF0LWqch130aGINsY=",
  urlEndpoint: "https://ik.imagekit.io/matguchi18/",
});

class Controller {
  static landingPage(req, res) {
    try {
      res.render("landingPage.ejs");
    } catch (error) {
      res.send(error);
    }
  }

  static async registerForm(req, res) {
    try {
      res.render("register.ejs");
    } catch (error) {
      res.send(error);
    }
  }

  static async register(req, res) {
    try {
      const { email, password } = req.body;

      const newAccount = await User.create({
        email,
        password,
        role: "user",
      });
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async loginForm(req, res) {
    try {
      res.render("login.ejs");
    } catch (error) {
      res.send(error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return res.send(`Email not registered`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.send("Incorrect password");
      }

            req.session.userId = user.id;
            req.session.role = user.role
            console.log(req.session)
            const profile = await Profile.findOne({ where: { UserId: user.id } });

      if (!profile) {
        return res.redirect("/set-username");
      }

      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

<<<<<<< HEAD
    static async showProfile(req, res) {
        try {
            if (!req.session.userId) {
                return res.redirect('/login');
            }

            const profile = await Profile.findOne({
                where: {
                    UserId: req.params.UserId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email'],
                        include: [  
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
=======
  static async showProfile(req, res) {
    try {
      // Find the profile using the UserId from the URL parameter
      if (!req.session.userId) {
        return res.redirect("/login");
      }

      const profile = await Profile.findOne({
        where: {
          UserId: req.params.UserId,
        },
        include: [
          {
            model: User,
            attributes: ["id", "email"],
            include: [
              // Nested includes
              {
                model: Profile,
                attributes: ["username", "bio"],
              },
            ],
          },
          {
            model: Post,
            attributes: ["caption", "image"],
          },
        ],
      });
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1

      res.render("profile.ejs", {
        profile,
        posts: profile.Posts,
        userId: req.session.userId,
      });
    } catch (error) {
      res.send(error);
    }
  }

<<<<<<< HEAD
    static async home(req, res) {
        try {
            const { error } = req.query
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: Profile,
                                attributes: ['username', 'bio', 'profilePicture'] 
                            }
                        ],
                        attributes: ['name', 'email'] 
                    },
                    {
                        model: Tag,
                        
                    }
                ]
            });

            // console.log(posts[1].Tags.name);
            
            res.render("home.ejs", { posts, userId: req.session.userId, error });
        } catch (error) {
            console.log(error)
            res.send(error)
        }
=======
  static async home(req, res) {
    try {
      const { caption } = req.query;
      console.log(caption);

      let uname = await Profile.notificationBar(req.session.userId);
      console.log(uname);

      const posts = await Post.findAll({
        where: {
          caption: {
            [Op.iLike]: `%${caption}%`,
          },
        },
        include: [
          {
            model: User,
            include: [
              {
                model: Profile,
                attributes: ["bio", "profilePicture"], // Include profile information
              },
            ],
            attributes: ["name", "email"], // Ensure 'name' is included here
          },
        ],
      });

      res.render("home.ejs", {
        posts,
        userId: req.session.userId,
        uname,
        addEmoji,
        caption,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1
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
        UserId: userId,
        role: "The Newbie",
      });

      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

<<<<<<< HEAD
    static async createPost(req, res) {
        try {
            const { caption, name } = req.body;
            const imageFile = req.file;

            let uploadImage = ""
            if (imageFile && imageFile.buffer) {
                 uploadImage = await imagekit.upload({
                    file: imageFile.buffer.toString("base64"),
                    fileName: imageFile.originalname,
                    folder: '/posts', 
                });
            }
            
            const userProfile = await Profile.findOne({
                where: { UserId: req.session.userId }
            });

            if (!userProfile) {
                return res.redirect('/set-username');
            }

            const newPost = await Post.create({
                caption,
                image: uploadImage === "" ? "" : uploadImage.url,
                UserId: req.session.userId,
                ProfileId: userProfile.id 
            });

            let tags;
            if (name) {
                tags = name.split(",")
            }

            tags.forEach(async (tag) =>{
                const findTag = await Tag.findOne({
                    where: {
                        name: tag
                    }
                })
                if (findTag) {
                    const newTagPost = await TagPost.create({
                        TagId: findTag.id,
                        PostId: newPost.id
                    })
                } else {
                    const newTag = await Tag.create({
                        name: tag
                    })
                    const newTagPost = await TagPost.create({
                        TagId: newTag.id,
                        PostId: newPost.id
                    })

                }
            })

            res.redirect("/home");
        } catch (error) {
            console.log(error)
            res.send(error)
        }
=======
  static async createPost(req, res) {
    try {
      const { caption } = req.body;
      const imageFile = req.file;

            // Upload the image to ImageKit
            const uploadImage = await imagekit.upload({
                file: imageFile.buffer.toString('base64'),
                fileName: imageFile.originalname,
                folder: '/posts', // Optional folder for the image
            });

      // Find the profile associated with the logged-in user
      const userProfile = await Profile.findOne({
        where: { UserId: req.session.userId },
      });

      // If profile doesn't exist, you may want to redirect to the set-username page
      if (!userProfile) {
        return res.redirect("/set-username");
      }

      // Create the post with ProfileId
      const newPost = await Post.create({
        caption,
        image: uploadImage.url,
        UserId: req.session.userId,
        ProfileId: userProfile.id, // Set ProfileId explicitly
      });

      res.redirect("/home");
    } catch (error) {
      res.send(error);
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1
    }
  }

<<<<<<< HEAD
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
                        include: [  
                            {
                                model: Profile,
                                attributes: ['username', 'bio']
                            }
                        ]
                    }
                ]
            });
=======
  static async showEditProfile(req, res) {
    try {
      const profile = await Profile.findOne({
        where: {
          UserId: req.params.UserId,
        },
        include: [
          {
            model: User,
            attributes: ["id", "email"],
            include: [
              // Nested includes
              {
                model: Profile,
                attributes: ["username", "bio"],
              },
            ],
          },
        ],
      });
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1

      res.render("editProfile.ejs", { profile, userId: req.session.userId });
    } catch (error) {
      res.send(error);
    }
  }

<<<<<<< HEAD
    static async editProfile(req, res) {
        try {
            const { username, role, bio, existingProfilePicture } = req.body; 
            const imageFile = req.file;  
        
        let profilePicture = existingProfilePicture;  
        
        if (imageFile) {
            const uploadImage = await imagekit.upload({
                file: imageFile.buffer.toString('base64'),
                fileName: imageFile.originalname,
                folder: '/posts',  
            });
            profilePicture = uploadImage.url;  
=======
  static async editProfile(req, res) {
    try {
      const { username, role, bio, existingProfilePicture } = req.body; // Get the bio and existing profile picture from the form
      const imageFile = req.file; // The uploaded image (if any)

      let profilePicture = existingProfilePicture; // Default to the existing profile picture if no new file is uploaded

      // If a new image is uploaded, upload it to ImageKit and get the URL
      if (imageFile) {
        const uploadImage = await imagekit.upload({
          file: imageFile.buffer.toString("base64"),
          fileName: imageFile.originalname,
          folder: "/posts", // Optional folder for the image
        });
        profilePicture = uploadImage.url; // Use the new image URL
      }

      // Now update the user's profile with the new bio and (possibly) new profile picture
      const updatedProfile = await Profile.update(
        {
          username,
          role,
          bio: bio, // Update the bio
          profilePicture: profilePicture, // Update the profile picture (new or existing)
        },
        {
          where: { UserId: req.session.userId }, // Update the profile of the logged-in user
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1
        }
      );

<<<<<<< HEAD
        const updatedProfile = await Profile.update(
            {
                username,
                role,
                bio: bio,  
                profilePicture: profilePicture,  

            },
            {
                where: { UserId: req.session.userId },  
            }
        );

        res.redirect(`/profile/${req.session.userId}`);
        } catch (error) {
            console.log(error);
            res.send(error)
        }
=======
      // After the update, redirect the user to their updated profile page
      res.redirect(`/profile/${req.session.userId}`);
    } catch (error) {
      console.log(error);
      res.send(error);
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1
    }
  }

<<<<<<< HEAD
    static async deletePost(req, res) {
        try {

            const deletedPost = await Post.findOne({
                where: {
                    UserId: req.session.userId,
                    id: req.params.postId
                }
            })
            console.log(deletedPost);
            

            if (deletedPost) {
                await Post.destroy({
                    where: {
                        id: +req.params.postId,
                        UserId: +req.session.userId
                    }
                })
            } else {
                return res.redirect("/home?error=You can't delete this product")
            }
            
            console.log(`Successful`);
            
            res.redirect("/home")
        } catch (error) {
            res.send(error)
        }
    }


    static async aboutUs(req, res) {
        try {
            res.render("aboutUs.ejs")
        } catch (error) {
            res.send(error)
        }
=======
  static async aboutUs(req, res) {
    try {
      res.render("aboutUs.ejs");
    } catch (error) {
      res.send(error);
>>>>>>> 62346426446fbac33e5d3bf5077c06fabca2ffd1
    }
  }
}

module.exports = Controller;
