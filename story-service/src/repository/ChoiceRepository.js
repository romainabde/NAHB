const prisma = require("../prismaClient");

class ChoiceRepository {
    // CREATE
    async save(fromPageId, toPageId, text) {
        return prisma.choice.create({
            data: {
                fromPageId,
                toPageId,
                text
            },
        });
    }

    // READ
    async findById(choiceId) {
        return prisma.choice.findUnique({
            where: { id: choiceId },
            /*include: {
                fromPage: true,
                toPage: true
            }*/
        });
    }

    async findByFromPage(fromPageId) {
        return prisma.choice.findMany({
            where: { fromPageId },
            //include: { toPage: true }
        });
    }

    async findByToPage(toPageId) {
        return prisma.choice.findMany({
            where: { toPageId },
            //include: { fromPage: true }
        });
    }

    // UPDATE
    async update(choiceId, data) {
        return prisma.choice.update({
            where: { id: choiceId },
            data
        });
    }

    // DELETE
    async delete(choiceId) {
        return prisma.choice.delete({
            where: { id: choiceId }
        });
    }
}

module.exports = new ChoiceRepository();