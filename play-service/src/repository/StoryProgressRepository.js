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

    async findAll(){
        return prisma.storyProgress.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id){
        return prisma.storyProgress.findUnique({
            where: { id }
        })
    }

    async update(id, pageId) {
        return prisma.storyProgress.update({
            where: { id },
            data: { pageId }
        });
    }

    async endParty(userId, storyId, pageId){
        return prisma.endingReach.create({
            data: {userId, storyId, pageId }
        })
    }

    async getFinishParty(){
        return prisma.endingReach.findMany();
    }
}

module.exports = new StoryProgressRepository();