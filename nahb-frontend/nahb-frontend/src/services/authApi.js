import apiClient from "./apiClient";

const AUTH_URL = "http://localhost:4001";

export const loginRequest = async (email, password) => {
    const res = await apiClient.post(`${AUTH_URL}/auth/login`, { identifier: email, password });
    return res.data;
};

export const register = async (data) => {
    const res = await apiClient.post(`${AUTH_URL}/auth/register`, data);
    return res.data;
};