const storyService = require('../services/StoryService');
const pageService = require('../services/PageService')
const choiceService = require('../services/ChoiceService')

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

exports.editPage = async (req, res, next) => {
    try {
        const response = await pageService.editPage(req.user.id, Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}

exports.editChoice = async (req, res, next) => {
    try {
        const response = await choiceService.editChoice(req.user.id, Number(req.params.id), req.body)
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

exports.deletePage = async (req, res, next) => {
    try {
        const response = await pageService.deletePage(req.user.id, Number(req.params.id))
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}

exports.deleteChoice = async (req, res, next) => {
    try {
        const response = await choiceService.deleteChoice(req.user.id, Number(req.params.id))
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

exports.createChoice = async (req, res, next) => {
    try {
        const response = await choiceService.createChoice(Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
}