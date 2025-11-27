const storyService = require('../services/StoryService');
const pageService = require('../services/PageService')
const choiceService = require('../services/ChoiceService')

exports.getUserStories = async (req, res, next) => {
    try {
        const stories = await storyService.getUserStories(req.user.id);
        return res.status(200).json(stories);
    } catch (err) {
        next(err);
    }
};

exports.getStoryList = async (req, res, next) => {
    try {
        const stories = await storyService.getStories(req.query);
        return res.status(200).json(stories);
    } catch (err) {
        next(err);
    }
};

exports.getStory = async (req, res, next) => {
    try {
        const story = await storyService.getStory(req.params.id);
        return res.status(200).json(story);
    } catch (err) {
        next(err);
    }
};

exports.getFirstStoryPage = async (req, res, next) => {
    try {
        const firstPage = await pageService.getFirstStoryPage(Number(req.params.id));
        return res.status(200).json(firstPage);
    } catch (err) {
        next(err);
    }
};

exports.getStoryPages = async (req, res, next) => {
    try {
        const pages = await pageService.getStoryPages(Number(req.params.id));
        return res.status(200).json(pages);
    } catch (err) {
        next(err);
    }
};

exports.getPage = async (req, res, next) => {
    try {
        const page = await pageService.getPageById(Number(req.params.id));
        return res.status(200).json(page);
    } catch (err) {
        next(err);
    }
};

exports.getPageChoices = async (req, res, next) => {
    try {
        const choices = await choiceService.getPageChoices(Number(req.params.id));
        return res.status(200).json(choices);
    } catch (err) {
        next(err);
    }
};

exports.getStoryChoices = async (req, res, next) => {
    try {
        const choices = await choiceService.getStoryChoices(Number(req.params.id));
        return res.status(200).json(choices);
    } catch (err) {
        next(err);
    }
};

exports.getChoice = async (req, res, next) => {
    try {
        const choice = await choiceService.getChoice(Number(req.params.id));
        return res.status(200).json(choice);
    } catch (err) {
        next(err);
    }
};