const authService = require('../services/AuthService');

exports.login = async (req, res, next) => {
    try {
        const response = await authService.login(req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const response = await authService.register(req.body)
        return res.status(201).json(response)
    } catch (err) {
        next(err);
    }
};