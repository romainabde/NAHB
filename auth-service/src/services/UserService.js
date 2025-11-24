const UserRepository = require("../repository/UserRepository");
const AppError = require ("../middlewares/AppError")
const SafeUserDto = require("../dto/SafeUser")

class UserService {

    async banUser(userId) {

        let user = await UserRepository.findById(userId);
        if (!user) {
            throw new AppError("L'utilisateur recherché n'existe pas.", 404);
        }

        const isAuthor = user.roles.some(r => r.role === "AUTHOR");
        if (!isAuthor) {
            throw new AppError("L'utilisateur n'est pas un auteur.", 400);
        }

        user = await UserRepository.removeAuthorRole(userId);

        return new SafeUserDto(user);
    }
}

module.exports = new UserService();