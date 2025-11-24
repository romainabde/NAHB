const AuthRepository = require('../repository/UserRepository');
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/authMiddleware");
const AppError = require("../middlewares/AppError.js")
const SafeUserDto = require("../dto/SafeUser")

class AuthService {

    // Authentifier un utilisateur
    async login (data) {
        if (!data || !data.identifier || !data.password) {
            throw new AppError("L'identifiant et le mot de passe est obligatoire.", 400);
        }

        let user = await AuthRepository.findByEmail(data.identifier)
        if(!user){
            user = await AuthRepository.findByUsername(data.identifier)
        }
        if(!user){
            throw new AppError("Email ou nom d'utilisateur incorrect.", 401)
        }

        if(!await bcrypt.compare(data.password, user.password)){
            throw new AppError("Mot de passe incorrect.", 401)
        }

        const userDto = new SafeUserDto(user);
        const token = generateToken(userDto);

        return { user: userDto, token: token }
    }

    // Enregister un utilisateur
    async register(data){
        if (!data || !data.email || !data.username || !data.password) {
            throw new AppError("L'email, le nom d'utilisateur et le mot de passe est obligatoire.", 404);
        }

        await this.validateRoles(data.roles);

        if(await AuthRepository.findByUsername(data.username)){
            throw new AppError("Le nom d'utilisateur existe déjà.", 409)
        }

        if(await AuthRepository.findByEmail(data.email)){
            throw new AppError("L'adresse e-mail existe déjà.", 409)
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await AuthRepository.save(data.username, data.email, passwordHash, data.roles)

        if(!user){
            throw new AppError("Impossible d'enregistrer un utilisateur.", 500);
        }

        const userDto = new SafeUserDto(user);

        const token = generateToken(userDto);

        return { user: userDto, token: token }
    }

    // Vérifier les rôles
    async validateRoles(roles) {
        const validRoles = ["READER", "AUTHOR"];

        if (!Array.isArray(roles) || roles.length === 0) {
            throw new AppError("Au moins un rôle doit être fourni.", 400);
        }

        const invalidRoles = roles.filter(role => !validRoles.includes(role));
        if (invalidRoles.length > 0) {
            throw new AppError(
                `Rôle(s) incorrect(s) : ${invalidRoles.join(", ")}. Valeurs possibles : ${validRoles.join(", ")}`,
                400
            );
        }

        return roles;
    }
}

module.exports = new AuthService();