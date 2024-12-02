const router = require("express").Router();

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