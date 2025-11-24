const prisma = require("../prismaClient");

class UserRepository {

    // CREATE

    async save(username, email, passwordHash, roles) {
        return prisma.user.create({
            data: {
                email,
                username,
                password: passwordHash,
                roles: {
                    create: roles.map(role => ({role}))
                }
            },
            include: {roles: true}
        });
    }

    // READ

    async findById(id) {
        return prisma.user.findUnique({
            where: {id: id},
            include: {roles: true}
        });
    }

    async findByEmail(email) {
        return prisma.user.findUnique({
            where: {email: email},
            include: {roles: true}
        });
    }

    async findByUsername(username) {
        return prisma.user.findUnique({
            where: {username: username},
            include: {roles: true}
        });
    }

    // UPDATE

    async removeAuthorRole(userId) {
        await prisma.userRole.deleteMany({
            where: {
                userId,
                role: "AUTHOR"
            }
        });

        return await this.findById(userId)
    }
}

module.exports = new UserRepository();