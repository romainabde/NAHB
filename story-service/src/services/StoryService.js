const StoryRepository = require("../repository/StoryRepository");
const pageService = require("./PageService")
const AppError = require ("../middlewares/AppError");

class StoryService {

    async createStory (authorId, data) {
        if(!data || !data.title || !data.description){
            throw new AppError("Le titre et la description est obligatoire.", 400);
        }

        if(!data.tags){
            data.tags = null;
        }

        return await StoryRepository.save(authorId, data);
    }

    // Modifier une histoire (titre, description, tags, statut)
    async editStory (authorId, storyId, data){
        // Validation des données
        if(!data){
            throw new AppError("Au moins un champ (titre, description, tags, statut) doit être fourni.", 400);
        }

        const allowedFields = ["title", "description", "tags", "status", "startPageId"];
        const updateData = {};

        // Vérifier chaque champ fourni
        Object.keys(data).forEach(field => {
            if (!allowedFields.includes(field)) {
                throw new AppError(`Champ invalide fourni : ${field}`, 400);
            }
            updateData[field] = data[field];
        });

        // Vérifier le statut
        if (updateData.status !== undefined && !["DRAFT", "PUBLISHED", "SUSPENDED"].includes(updateData.status)){
            throw new AppError("Le statut reçu est invalide (DRAFT, PUBLISHED, SUSPENDED).", 400);
        }

        // Vérifier si la page existe
        if(updateData.startPageId !== undefined && Number.isInteger(updateData.startPageId)){
            if(!await pageService.getPageById(updateData.startPageId)) throw new AppError("La page de départ n'existe pas.", 404);
        }

        // Vérifier si l'histoire existe
        const story= await this.getStoryById(storyId);
        if(!story) throw new AppError("L'histoire recherchée n'existe pas.", 404);

        // Autorisation
        if(!await this.isUserStory(authorId, story)) throw new AppError("Vous ne pouvez pas modifier l'histoire de quelqu'un d'autre.", 401)

        // Retourner l'histoire modifiée
        return await StoryRepository.update(storyId, data)
    }

    // Supprimer une histoire (titre, description, tags, statut)
    async deleteStory (authorId, storyId){

        // Vérifier si l'histoire existe
        const story = await this.getStoryById(storyId);
        if(!story) throw new AppError("L'histoire recherchée n'existe pas.", 404);

        // Autorisation
        if(!await this.isUserStory(authorId, story)) throw new AppError("Vous ne pouvez pas supprimer l'histoire de quelqu'un d'autre.", 401)

        // Retourner l'histoire modifiée
        return await StoryRepository.delete(storyId)
    }

    // Vérifier si l'histoire appartient à l'utilisateur
    async isUserStory(userId, story){
        return story.authorId === userId;
    }

    // Vérifier si une histoire existe
    async getStoryById(storyId){
        return await StoryRepository.findById(storyId);
    }

    // Récupérer toutes les stories d'un utilisateur
    async getUserStories(userId) {
        const stories = await StoryRepository.findByAuthor(userId);
        if (!stories || stories.length === 0) {
            throw new AppError("Aucune histoire trouvée pour cet utilisateur.", 404);
        }
        return stories;
    }

    // Récupérer une story par son ID
    async getStory(storyId) {
        const story = await StoryRepository.findById(parseInt(storyId));
        if (!story) {
            throw new AppError("Histoire non trouvée.", 404);
        }
        return story;
    }

    async getStories(query) {
        const { theme } = query;

        const filters = {};

        if (theme) {
            filters.theme = theme;
        }

        return StoryRepository.findStories(filters);
    }

}

module.exports = new StoryService();