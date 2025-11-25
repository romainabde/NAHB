const PageRepository = require("../repository/PageRepository");
const storyService = require("./StoryService")
const AppError = require ("../middlewares/AppError");

class PageService {

    // Retrouver la page par son id
    async getPageById(pageId){
        return await PageRepository.findById(pageId);
    }

    // Créer une page
    async createPage(userId, storyId, data){
        if(!data || !data.content){
            throw new AppError("Le contenu de la page est obligatoire.", 400);
        }

        if(typeof data.isEnding === "boolean"){
            throw new AppError("isEnding doit être vrai ou faux.", 400);
        }

        if(! await storyService.getStoryById(storyId)){
            throw new AppError("L'histoire n'existe pas.", 404);
        }

        return await PageRepository.save(storyId, data);
    }

}

module.exports = new PageService();