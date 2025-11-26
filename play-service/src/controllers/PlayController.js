const storyProgress = require('../services/StoryProgressService')

exports.saveProgress = async (req, res, next) => {
    try {
        console.log(req.user)
        const response = await storyProgress.saveProgress(req.user.id, req.body)
        return res.status(201).json(response)
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