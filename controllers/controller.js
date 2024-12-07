const { Op } = require("sequelize");
const { User, Profile, Tag, Post, TagPost } = require("../models");
const bcrypt = require("bcryptjs");
const ImageKit = require("imagekit");
const addEmoji = require("../helpers/helper");

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
      req.session.role = user.role;
      console.log(req.session);
      const profile = await Profile.findOne({ where: { UserId: user.id } });

      if (!profile) {
        return res.redirect("/set-username");
      }

      res.redirect("/home?caption=");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showProfile(req, res) {
    try {
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

      res.render("profile.ejs", {
        profile,
        posts: profile.Posts,
        userId: req.session.userId,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async home(req, res) {
    try {
      const { error, caption } = req.query;

      let uname = "User";
      const profile = await Profile.findOne({
        where: { UserId: req.session.userId },
      });

      if (profile) {
        uname = profile.username;
      }

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
                attributes: ["username", "bio", "profilePicture"],
              },
            ],
            attributes: ["name", "email"],
          },
          {
            model: Tag,
          },
        ],
      });

      res.render("home.ejs", {
        posts,
        userId: req.session.userId,
        uname,
        addEmoji,
        caption,
        error,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/home?errors=${errors}`);
      } else {
        res.send(error);
      }
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

      res.redirect("/home?caption=");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async createPost(req, res) {
    try {
      const { caption, name } = req.body;
      const imageFile = req.file;

      let uploadImage = "";
      if (imageFile && imageFile.buffer) {
        uploadImage = await imagekit.upload({
          file: imageFile.buffer.toString("base64"),
          fileName: imageFile.originalname,
          folder: "/posts",
        });
      }

      const userProfile = await Profile.findOne({
        where: { UserId: req.session.userId },
      });

      if (!userProfile) {
        return res.redirect("/set-username");
      }

      const newPost = await Post.create({
        caption,
        image: uploadImage === "" ? "" : uploadImage.url,
        UserId: req.session.userId,
        ProfileId: userProfile.id,
      });

      let tags = "";
      if (name) {
        tags = name.split(",");
      }

      tags.forEach(async (tag) => {
        const findTag = await Tag.findOne({
          where: {
            name: tag,
          },
        });
        if (findTag) {
          const newTagPost = await TagPost.create({
            TagId: findTag.id,
            PostId: newPost.id,
          });
        } else {
          const newTag = await Tag.create({
            name: tag,
          });
          const newTagPost = await TagPost.create({
            TagId: newTag.id,
            PostId: newPost.id,
          });
        }
      });

      res.redirect("/home?caption=");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/home?error=${errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

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
              {
                model: Profile,
                attributes: ["username", "bio"],
              },
            ],
          },
        ],
      });

      res.render("editProfile.ejs", { profile, userId: req.session.userId });
    } catch (error) {
      res.send(error);
    }
  }

  static async editProfile(req, res) {
    try {
      const { username, role, bio, existingProfilePicture } = req.body;
      const imageFile = req.file;

      let profilePicture = existingProfilePicture;

      if (imageFile) {
        const uploadImage = await imagekit.upload({
          file: imageFile.buffer.toString("base64"),
          fileName: imageFile.originalname,
          folder: "/posts",
        });
        profilePicture = uploadImage.url;
      }

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
      res.send(error);
    }
  }

  static async deletePost(req, res) {
    try {
      const deletedPost = await Post.findOne({
        where: {
          UserId: req.session.userId,
          id: req.params.postId,
        },
      });
      console.log(deletedPost);

      if (deletedPost) {
        await Post.destroy({
          where: {
            id: +req.params.postId,
            UserId: +req.session.userId,
          },
        });
        console.log(deletedPost);
      } else {
        return res.redirect("/home?error=You can't delete this Post");
      }

      res.redirect("/home?caption=");
    } catch (error) {
      res.send(error);
    }
  }

  static async showPostByTag(req, res) {
    try {
      const tag = await Tag.findOne({
        where: {
          id: +req.params.id,
        },
      });

      const tagPosts = await TagPost.findAll({
        where: {
          TagId: +req.params.id,
        },
        attributes: ["PostId"],
      });

      const postIds = tagPosts.map((tagPost) => tagPost.PostId);

      const posts = await Post.findAll({
        where: {
          id: postIds,
        },
        include: [
          {
            model: User,
            include: [
              {
                model: Profile,
                attributes: ["username", "bio", "profilePicture"],
              },
            ],
            attributes: ["name", "email"],
          },
        ],
      });
      res.render("postsByTag.ejs", {
        posts,
        userId: req.session.userId,
        addEmoji,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async aboutUs(req, res) {
    try {
      res.render("aboutUs.ejs");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
