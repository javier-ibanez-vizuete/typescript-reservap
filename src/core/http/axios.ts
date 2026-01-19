import axios from "axios";
import { getTokenFromLocalStorage } from "../auth/auth.service";

const baseURL = "https://eleven-code-api-javier-ibanez.vercel.app/api";

export const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getTokenFromLocalStorage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) console.error("ERROR INTERCEPTOR =>", error.response)

        if (error.request) console.error("ERROR INTERCEPTOR REQUEST =>", error.request);

        if (!error.response && !error.request) console.error("ERROR INTERCEPTOR MESSAGE =>", error.message);

        return Promise.reject(error);
    }
);