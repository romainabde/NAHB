const prisma = require("../prismaClient");

class StoryRepository {

    // CREATE

    async save(authorId, data) {
        return prisma.story.create({
            data: {
                authorId,
                title: data.title,
                description: data.description,
                tags: data.tags
            },
        });
    }

    // READ

    async findById(storyId) {
        return prisma.story.findUnique({
            where: { id: storyId },
            include: {
                pages: true,
                startPage: true,
            },
        });
    }

    async findByAuthor(authorId) {
        return prisma.story.findMany({
            where: { authorId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findPublished() {
        return prisma.story.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { createdAt: "desc" },
        });
    }

    async findStories(filters) {
        return prisma.story.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' }
        });
    }

    // UPDATE

    async update(storyId, data) {
        return prisma.story.update({
            where: { id: storyId },
            data,
        });
    }

    async updateStatus(storyId, status) {
        return prisma.story.update({
            where: { id: storyId },
            data: { status },
        });
    }

    async setStartPage(storyId, startPageId) {
        return prisma.story.update({
            where: { id: storyId },
            data: { startPageId },
        });
    }

    // DELETE

    async delete(storyId) {
        return prisma.story.delete({
            where: { id: storyId },
        });
    }
}

module.exports = new StoryRepository();