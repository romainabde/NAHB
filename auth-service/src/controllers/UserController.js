const userService = require('../services/UserService');

exports.getUserInfo = async (req, res, next) => {
    try{
        return res.status(200).json({ user: req.user })
    } catch (err) {
        next(err)
    }
};

exports.banUser = async (req, res, next) => {
    try{
        const response = await userService.banUser(Number(req.params.id))
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}