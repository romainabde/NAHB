const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_CHANGE_ME";
const JWT_EXPIRES_IN = "24h";

function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization Header manquant" });
    }

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({ error: "Format d'Authorization invalide" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, email: true, roles: true }
        });
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "L'utilisateur n'est pas authentifié" });
        }
        const hasRole = req.user.roles.some(r => allowedRoles.includes(r.role));
        if (!hasRole) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
}

module.exports = {
    authMiddleware,
    generateToken,
    requireRole
};