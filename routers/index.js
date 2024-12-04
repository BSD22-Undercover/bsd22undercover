const multer = require("multer");
const Controller = require("../controllers/controller");
const router = require("express").Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// landing page
router.get("/", Controller.landingPage)
router.get("/aboutUs", Controller.aboutUs)
// login & register
router.get("/register", Controller.registerForm)
router.post("/register", Controller.register)
router.get("/login", Controller.loginForm)
router.post("/login", Controller.login)

// set username
router.get('/set-username', Controller.setUsernameForm);
router.post('/set-username', Controller.setUsername);

// home & post
router.get("/home", Controller.home) // ==> memampilkan semua post
router.post("/home", upload.single("image"), Controller.createPost) // ==> posting post

// profile
router.get("/profile/:UserId", Controller.showProfile)
router.get("/profile/:UserId/edit")
router.post("/profile/:UserId/edit")

// hashtag
router.get("/hashtag/:name")

module.exports = router