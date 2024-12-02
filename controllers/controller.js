class Controller {
    static landingPage(req, res) {
        try {
            res.render("landingPage.ejs")
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller