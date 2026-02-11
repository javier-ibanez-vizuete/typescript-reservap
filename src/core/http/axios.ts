import axios from "axios";
import { getTokenFromLocalStorage } from "../auth/auth.service";

export type ApiErrorData = {
    message?: string;
    code?: string;
}

enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,

    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

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
    (response) => response
    ,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as ApiErrorData;

            console.error(`[API ERROR] ${status}: ${data?.message || error?.message}`);

            if (status === HttpStatus.BAD_REQUEST) console.warn("Sintaxis or Validation Error. Fix Request Data...")
            if (status === HttpStatus.UNAUTHORIZED) console.warn("Unauthorized (No Token) - Redirecting...")
            if (status === HttpStatus.FORBIDDEN) console.warn("Token not valid to continue...")
            if (status === HttpStatus.NOT_FOUND) console.warn("The Path doesn't exist.", error?.response?.data?.path ?? "")
            if (status === HttpStatus.CONFLICT) console.warn("Conflict. Data already Exist");
            if (status === HttpStatus.UNPROCESSABLE_ENTITY) console.warn("Error Processing specific fields");
            if (status === HttpStatus.INTERNAL_SERVER_ERROR) console.warn("Server is not Available");
            if (status === HttpStatus.SERVICE_UNAVAILABLE) console.warn("Server under Maintenance")
        }
        if (!axios.isAxiosError(error)) console.error("Uncontrolled Error:", error)

        return Promise.reject(error);
    }
);