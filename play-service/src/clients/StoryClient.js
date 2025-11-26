const axios = require("axios");
const AppError = require("../middlewares/AppError");

class StoryClient {
    async getStoryById(storyId, token) {
        try {
            const res = await axios.get(
                `${process.env.STORY_SERVICE}/reader/stories/${storyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;

        } catch (err) {
            if (err.response?.data) {
                const apiError =
                    err.response.data.error ||
                    err.response.data.message ||
                    "Erreur de l'API.";

                throw new AppError(apiError, err.response.status);
            }

            // Erreurs internes ou réseau
            throw new AppError("Erreur réseau ou interne.", 500);
        }
    }
}

module.exports = new StoryClient();
