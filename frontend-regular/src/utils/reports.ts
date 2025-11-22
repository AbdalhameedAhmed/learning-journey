import { jwtDecode } from "jwt-decode";
import { getTokens, setAccessToken } from "./helpers";

export async function downloadReport(url: string, fileName: string) {
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";
  const options: RequestInit = {
    method: "GET",
  };
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
  }

  const response = await fetch(url, options);
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
