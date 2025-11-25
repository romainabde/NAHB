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
}

module.exports = new ChoiceService();