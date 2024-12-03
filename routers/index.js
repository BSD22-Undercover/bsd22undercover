const multer = require("multer");
const Controller = require("../controllers/controller");
const router = require("express").Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
// landing page
router.get("/", Controller.landingPage)

// login & register
router.get("/register", Controller.registerForm)
router.post("/register", Controller.register)
router.get("/login", Controller.loginForm)
router.post("/login", Controller.login)

// home & post
router.get("/home") // ==> memampilkan semua post
router.post("/home") // ==> posting post

// profile
router.get("/profile/:UserId", Controller.showProfile)
router.get("/profile/:UserId/edit")
router.post("/profile/:UserId/edit")

// hashtag
router.get("/hashtag/:name")

module.exports = router