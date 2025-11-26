const prisma = require("../prismaClient");

class StoryProgressRepository {

    async save(userId, storyId, pageId) {
        return prisma.storyProgress.create({
            data: { userId, storyId, pageId }
        });
    }

    async findByUserAndStory(userId, storyId) {
        return prisma.storyProgress.findMany({
            where: { userId, storyId },
            orderBy: { updatedAt: 'desc' }
        });
    }
}

module.exports = new StoryProgressRepository();