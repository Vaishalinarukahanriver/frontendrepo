// Layer 2 of 3: the single axios instance every service uses.
// Adds the base URL, a bearer token if one is stored, and turns every failure into ApiRequestError.
import Axios, { AxiosError, AxiosInstance } from "axios";
import type { ApiErrorBody } from "@/types/api";
import { ApiRequestError } from "@/utils/api-error";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

class CoreAPIService {
  private axios: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.axios = Axios.create({
      baseURL,
      timeout: 15_000,
      headers: { "Content-Type": "application/json" },
    });

    // Request: attach the token when the app has one (login is not part of the starter).
    this.axios.interceptors.request.use((config) => {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // Response: normalise errors so screens only ever deal with ApiRequestError.
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorBody>) => Promise.reject(this.normalise(error)),
    );
  }

  private normalise(error: AxiosError<ApiErrorBody>): ApiRequestError {
    if (error.response) {
      const body = error.response.data;
      const message = body?.message || `Server error (${error.response.status}).`;
      return new ApiRequestError(message, error.response.status, body?.errors);
    }
    if (error.request) {
      return new ApiRequestError("No response from the server. Is the API running?", 0);
    }
    return new ApiRequestError(error.message || "Request failed.", 0);
  }

  get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return this.axios.get<T>(url, { params }).then((r) => r.data);
  }

  post<T, B = unknown>(url: string, body: B): Promise<T> {
    return this.axios.post<T>(url, body).then((r) => r.data);
  }

  patch<T, B = unknown>(url: string, body: B): Promise<T> {
    return this.axios.patch<T>(url, body).then((r) => r.data);
  }

  delete<T>(url: string): Promise<T> {
    return this.axios.delete<T>(url).then((r) => r.data);
  }
}

export default CoreAPIService;
