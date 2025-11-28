const StoryProgressRepository = require("../repository/StoryProgressRepository");
const AppError = require ("../middlewares/AppError");

const AuthClient = require("../clients/AuthClient");
const StoryClient = require("../clients/StoryClient")
const PageClient = require("../clients/PageClient")

class PlayService {
    async end(userId, storyId, pageId){
        return StoryProgressRepository.endParty(userId, storyId, pageId);
    }

    async getFinishParty(){
        return await StoryProgressRepository.getFinishParty();
    }
}

module.exports = new PlayService();