const prisma = require("../prismaClient");

class PageRepository {

    // CREATE
    async save(storyId, data) {
        return prisma.page.create({
            data: {
                storyId,
                content: data.content,
                isEnding: data.isEnding ?? false
            }
        });
    }

    // READ
    async findById(pageId) {
        return prisma.page.findUnique({
            where: { id: pageId },
            /*include: {
                choicesFrom: true,
                choicesTo: true,
                story: true
            }*/
        });
    }

    async findByStory(storyId) {
        return prisma.page.findMany({
            where: { storyId },
            orderBy: { createdAt: "asc" }
        });
    }

    // UPDATE
    async update(pageId, data) {
        return prisma.page.update({
            where: { id: pageId },
            data
        });
    }

    async setEnding(pageId, isEnding) {
        return prisma.page.update({
            where: { id: pageId },
            data: { isEnding }
        });
    }

    // DELETE
    async delete(pageId) {
        return prisma.page.delete({
            where: { id: pageId }
        });
    }

    // CHOICES MANAGEMENT
    async createChoice(fromPageId, toPageId, text) {
        return prisma.choice.create({
            data: {
                fromPageId,
                toPageId,
                text
            }
        });
    }

    async deleteChoice(choiceId) {
        return prisma.choice.delete({
            where: { id: choiceId }
        });
    }

    async findChoicesFromPage(pageId) {
        return prisma.choice.findMany({
            where: { fromPageId: pageId }
        });
    }

    async findChoicesToPage(pageId) {
        return prisma.choice.findMany({
            where: { toPageId: pageId }
        });
    }
}

module.exports = new PageRepository();