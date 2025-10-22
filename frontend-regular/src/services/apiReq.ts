import { getTokens, setAccessToken } from "@/utils/helpers";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";

const apiReq = async (method: string, endpoint: string, body?: unknown) => {
  const options: RequestInit = {
    method,
  };
  try {
    let { accessToken } = getTokens();
    const { refreshToken } = getTokens();

    if (accessToken && refreshToken) {
      const decodedToken = jwtDecode(accessToken);

      if (!decodedToken.exp) throw new Error("Error in decoding token");

      if (Date.now() >= decodedToken.exp * 1000) {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        accessToken = data.access_token;
        if (accessToken) {
          setAccessToken(accessToken);
        } else {
          throw new Error("Error in refreshing token");
        }
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      if (body) {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
          };
          options.body = JSON.stringify(body);
        }
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

      // Attempt to parse JSON, gracefully handle non-JSON responses.
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && Array.isArray(data?.detail)) {
          // FastAPI validation error
          const firstError = data.detail[0];
          const errorMessage = `${firstError.loc.join(" -> ")}: ${firstError.msg}`;
          throw new Error(errorMessage);
        } else if (data?.message) {
          // Custom JSON response with a "message" key
          throw new Error(data.message);
        } else if (data?.detail) {
          // Standard FastAPI HTTPException
          if (typeof data.detail === "string") {
            throw new Error(data.detail);
          }
          // If detail is an object, stringify it
          throw new Error(JSON.stringify(data.detail));
        } else {
          // Fallback for unknown error formats
          throw new Error(`An error occurred with status code ${res.status}`);
        }
      }

      return data;
    }
  } catch (err) {
    console.error("API Request Error:", err);
    throw err;
  }
};

export default apiReq;
