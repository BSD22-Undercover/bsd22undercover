const { User } = require('../models')

function isAuthorized(req, res, next) {
    const { userId } = req.session
    const { id } = req.params

    const user = User.findByPk(userId)
}