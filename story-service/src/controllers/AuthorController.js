const storyService = require('../services/StoryService');
const pageService = require('../services/PageService')

exports.createStory = async (req, res, next) => {
    try {
        const response = await storyService.createStory(req.user.id, req.body)
        return res.status(201).json(response)
    } catch (err) {
        next(err);
    }
};

exports.editStory = async (req, res, next) => {
    try {
        const response = await storyService.editStory(req.user.id, Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}

exports.deleteStory = async (req, res, next) => {
    try {
        const response = await storyService.deleteStory(req.user.id, Number(req.params.id))
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}

exports.createPage = async (req, res, next) => {
    try {
        const response = await pageService.createPage(req.user.id, Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}