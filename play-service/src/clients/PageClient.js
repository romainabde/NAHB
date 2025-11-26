const axios = require("axios");
const AppError = require("../middlewares/AppError");

class PageClient {
    async getPageById(pageId, token) {
        try {
            const res = await axios.get(
                `${process.env.STORY_SERVICE}/reader/stories/pages/${pageId}`,
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

            throw new AppError("Erreur réseau ou interne.", 500);
        }
    }
}

module.exports = new PageClient();
