const multer = require("multer");

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
router.get("/")

// login & register
router.get("/login")
router.get("/register")
router.post("/register")

// home & post
router.get("/home") // ==> memampilkan semua post
router.post("/home") // ==> posting post

// profile
router.get("/profile/:userId")
router.get("/profile/:userId/edit")
router.post("/profile/:userId/edit")

// hashtag
router.get("/hashtag/:name")

module.exports = router