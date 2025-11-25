const StoryRepository = require("../repository/StoryRepository");
const AppError = require ("../middlewares/AppError")
const SafeUserDto = require("../dto/SafeUser")

class AuthorService {

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

        const allowedFields = ["title", "description", "tags", "status"];
        const updateData = {};

        // Vérifier chaque champ fourni
        Object.keys(data).forEach(field => {
            if (!allowedFields.includes(field)) {
                throw new AppError(`Champ invalide fourni : ${field}`, 400);
            }
            updateData[field] = data[field];
        });

        // Vérifier si l'histoire existe
        const story= await StoryRepository.findById(storyId);
        if(!story) throw new AppError("L'histoire recherchée n'existe pas.", 404);

        // Autorisation
        if(!await this.isUserStory(authorId, story)) throw new AppError("Vous ne pouvez pas modifier l'histoire de quelqu'un d'autre.", 401)

        // Retourner l'histoire modifiée
        return await StoryRepository.update(storyId, data)
    }

    // Supprimer une histoire (titre, description, tags, statut)
    async deleteStory (authorId, storyId){

        // Vérifier si l'histoire existe
        const story= await StoryRepository.findById(storyId);
        if(!story) throw new AppError("L'histoire recherchée n'existe pas.", 404);

        // Autorisation
        if(!await this.isUserStory(authorId, story)) throw new AppError("Vous ne pouvez pas supprimer l'histoire de quelqu'un d'autre.", 401)

        // Retourner l'histoire modifiée
        return await StoryRepository.delete(storyId)
    }

    async isUserStory(userId, story){
        return story.authorId === userId;
    }

}

module.exports = new AuthorService();