const authorService = require('../services/AuthorService');

exports.createStory = async (req, res, next) => {
    try {
        const response = await authorService.createStory(req.user.id, req.body)
        return res.status(201).json(response)
    } catch (err) {
        next(err);
    }
};

exports.editStory = async (req, res, next) => {
    try {
        const response = await authorService.editStory(req.user.id, Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}

exports.deleteStory = async (req, res, next) => {
    try {
        const response = await authorService.deleteStory(Number(req.params.id))
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}