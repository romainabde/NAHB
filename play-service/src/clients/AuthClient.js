const axios = require("axios");

class AuthClient {
    async login(identifier, password) {
        const res = await axios.post(`${process.env.AUTH_SERVICE}/auth/login`, {
            identifier,
            password
        });

        return res.data.token;
    }
}

module.exports = new AuthClient();