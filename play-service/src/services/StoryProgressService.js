const StoryProgressRepository = require("../repository/StoryProgressRepository");
const AppError = require ("../middlewares/AppError");

const AuthClient = require("../clients/AuthClient");
const StoryClient = require("../clients/StoryClient")
const PageClient = require("../clients/PageClient")

class StoryProgressService {

    async saveProgress(userId, data) {
        // Validation des données
        if(!data || !data.storyId || !data.pageId){
            throw new AppError("L'id de l'histoire et de la page est obligatoire.", 400)
        }

        // Vérifications de l'exitance de l'histoire et de la page
        const tokenApi = await AuthClient.login(process.env.API_IDENTIFIER, process.env.API_PASSWORD);
        await StoryClient.getStoryById(data.storyId, tokenApi);
        await PageClient.getPageById(data.pageId, tokenApi);

        return StoryProgressRepository.save(userId, data.storyId, data.pageId);
    }

    async getUserProgress(userId, storyId) {
        const storyProgress = await StoryProgressRepository.findByUserAndStory(userId, storyId);
        if(!storyProgress || storyProgress.length === 0) throw new AppError("La partie recherchée n'existe pas.", 404);
        return storyProgress;
    }
}

module.exports = new StoryProgressService();