class SafeUser {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.roles = user.roles.map(r => r.role);
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

module.exports = SafeUser;