const storyProgress = require('../services/StoryProgressService')
const playService = require('../services/PlayService')

exports.saveProgress = async (req, res, next) => {
    try {
        const response = await storyProgress.saveProgress(req.user.id, req.body)
        return res.status(201).json(response)
    } catch (err) {
        next(err);
    }
};

exports.updateProgress = async (req, res, next) => {
    try {
        const response = await storyProgress.updateProgress(req.user.id, Number(req.params.id), req.body)
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
};

exports.getUserStoryProgress = async (req, res, next) => {
    try {
        const response = await storyProgress.getUserProgress(req.user.id, Number(req.params.id))
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
};

exports.getStoryProgress = async (req, res, next) => {
    try {
        const response = await storyProgress.getStoryProgress()
        return res.status(200).json(response)
    } catch (err) {
        next(err);
    }
};

exports.getStoryStats = async (req, res, next) => {
    try {
        const stats = await storyProgress.getStoryStats();
        return res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};