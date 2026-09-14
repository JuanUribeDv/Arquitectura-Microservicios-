import { auth } from "../config/firebaseConfig.js";

const API_BASE_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  if (typeof auth.authStateReady === "function") {
    await Promise.race([
      auth.authStateReady(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  }
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    signal: controller.signal,
    ...options,
  });
  clearTimeout(timeout);

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Error en la petición (${response.status}): ${detail}`);
  }

  return response.json();
}

export { apiRequest };
