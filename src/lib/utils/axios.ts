import axios from "axios";

import catchAxiosError from "./catch-axios-error";

const API_ENTRYPOINT = process.env.NEXT_PUBLIC_ENTRYPOINT;

const fetcher = axios.create({
    baseURL: API_ENTRYPOINT,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

fetcher.interceptors.response.use(
    (response) => response,
    (error) => catchAxiosError(error)
);

export default fetcher;
