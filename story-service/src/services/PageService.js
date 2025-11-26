const PageRepository = require("../repository/PageRepository");
const StoryRepository = require("../repository/StoryRepository")
const AppError = require ("../middlewares/AppError");

class PageService {

    // Retrouver la page par son id
    async getPageById(pageId){
        const page = await PageRepository.findById(pageId);

        if (!page) throw new AppError("Page non trouvée.", 404);

        return page;
    }

    // Créer une page
    async createPage(userId, storyId, data){
        if(!data || !data.content){
            throw new AppError("Le contenu de la page est obligatoire.", 400);
        }

        if(typeof data.isEnding !== "boolean"){
            throw new AppError("isEnding doit être vrai ou faux.", 400);
        }

        const storyService = require("./StoryService");
        if(! await storyService.getStoryById(storyId)){
            throw new AppError("L'histoire n'existe pas.", 404);
        }

        return await PageRepository.save(storyId, data);
    }

    // Modifier une page
    async editPage(userId, pageId, data) {

        if(!data) throw new AppError("Le contenu de la page ou 'isEnding' est obligatoire.", 400)

        const page = await this.getPageById(pageId);

        // Vérifier que l'auteur est bien le propriétaire de l'histoire
        const story = await StoryRepository.findById(page.storyId);
        if (story.authorId !== userId) {
            throw new AppError("Vous n'êtes pas l'auteur de cette page.", 403);
        }

        // Préparer les champs à mettre à jour
        const allowedFields = ["content", "isEnding"];
        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        return await PageRepository.update(pageId, updateData);
    }

    // Supprimer une page
    async deletePage(userId, pageId) {
        const page = await this.getPageById(pageId);

        const story = await StoryRepository.findById(page.storyId);
        if (story.authorId !== userId) {
            throw new AppError("Vous n'êtes pas l'auteur de cette page.", 403);
        }

        return await PageRepository.delete(pageId);
    }

    // Récupérer la première page d'une histoire
    async getFirstStoryPage(storyId) {
        const story = await StoryRepository.findById(storyId);
        if (!story) {
            throw new AppError("Histoire non trouvée.", 404);
        }
        if (!story.startPageId) {
            throw new AppError("Cette histoire n'a pas de page de départ assignée.", 404);
        }
        return await this.getPageById(story.startPageId);
    }

    // Récupérer toutes les pages d'une histoire
    async getStoryPages(storyId) {
        const story = await StoryRepository.findById(storyId);
        if (!story) {
            throw new AppError("Histoire non trouvée.", 404);
        }

        return PageRepository.findByStory(storyId);
    }

}

module.exports = new PageService();