const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_CHANGE_ME";

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Authorization Header manquant" });

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) return res.status(401).json({ error: "Format d'Authorization invalide" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            roles: decoded.roles
        };

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
        const hasRole = req.user.roles.some(r => allowedRoles.includes(r));
        if (!hasRole) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
}

module.exports = {
    authMiddleware,
    requireRole
};