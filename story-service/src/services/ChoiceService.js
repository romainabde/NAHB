const ChoiceRepository = require("../repository/ChoiceRepository");
const PageRepository = require("../repository/PageRepository");
const StoryRepository = require("../repository/StoryRepository");
const pageService = require("./PageService")
const AppError = require ("../middlewares/AppError");

class ChoiceService {

    // Créer un choix
    async createChoice (fromPageId, data) {
        // Validation des données
        if(!data || !data.toPageId || !data.text){
            throw new AppError("La page de d'arrivée et le contenu du choix est obligatoire.", 400);
        }

        // Vérifier si la page de départ et d'arrivée existe
        if(!await pageService.getPageById(fromPageId) || !await pageService.getPageById(data.toPageId)){
            throw new AppError("La page de départ ou celle d'arrivée n'existe pas.", 404);
        }

        return await ChoiceRepository.save(fromPageId, data.toPageId, data.text);
    }

    // Modifier un choix
    async editChoice(userId, choiceId, data) {

        if(!data) throw new AppError("Le text du choix ou la page d'arrivée est obligatoire.", 400)

        const choice = await ChoiceRepository.findById(choiceId);
        if (!choice) throw new AppError("Choix non trouvé.", 404);

        const page = await PageRepository.findById(choice.fromPageId);
        const story = await StoryRepository.findById(page.storyId);

        if (story.authorId !== userId) {
            throw new AppError("Vous n'êtes pas l'auteur de ce choix.", 403);
        }

        const allowedFields = ["text", "toPageId"];
        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        if(!updateData.toPageId !== undefined && !await PageRepository.findById(updateData.toPageId)){
            throw new AppError("La page d'arrivée n'existe pas.", 404)
        }

        return await ChoiceRepository.update(choiceId, updateData);
    }

    // Supprimer un choix
    async deleteChoice(userId, choiceId) {
        const choice = await ChoiceRepository.findById(choiceId);
        if (!choice) throw new AppError("Choix non trouvé.", 404);

        const page = await PageRepository.findById(choice.fromPageId);
        const story = await StoryRepository.findById(page.storyId);

        if (story.authorId !== userId) {
            throw new AppError("Vous n'êtes pas l'auteur de ce choix.", 403);
        }

        return await ChoiceRepository.delete(choiceId);
    }

    // Récupérer les choix d'une page
    async getPageChoices(pageId) {
        const page = await PageRepository.findById(pageId);
        if (!page) {
            throw new AppError("Page introuvable.", 404);
        }

        const choice = await ChoiceRepository.findByFromPage(pageId);
        if(!choice){
            throw new AppError("Cette page ne comporte aucun choix.", 404);
        }

        return choice;
    }

    // Récupérer tous les choix d'une histoire
    async getStoryChoices(storyId) {
        if (!Number.isInteger(storyId)) {
            throw new AppError("L'ID d'histoire doit être un entier.", 400);
        }

        const story = await StoryRepository.findById(storyId);
        if (!story) {
            throw new AppError("Histoire introuvable.", 404);
        }

        // Récupérer toutes les pages de l'histoire
        const pages = await PageRepository.findByStory(storyId);
        const pageIds = pages.map(p => p.id);

        // Tous les choix dont fromPageId appartient aux pages de l’histoire
        const choices = [];
        for (const pageId of pageIds) {
            const pageChoices = await ChoiceRepository.findByFromPage(pageId);
            choices.push(...pageChoices);
        }

        return choices;
    }

    // Récupérer un choix par son ID
    async getChoice(choiceId) {
        const choice = await ChoiceRepository.findById(choiceId);
        if (!choice) {
            throw new AppError("Choix introuvable.", 404);
        }

        return choice;
    }

}

module.exports = new ChoiceService();