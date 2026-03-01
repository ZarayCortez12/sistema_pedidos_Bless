import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // en segundos
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (e) {
    console.error("Error validando token:", e);
    return false;
  }
};

export function getTokenExpiration(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // en ms
  } catch (e) {
    return null;
  }
}

export function getTimeUntilExpiration(token) {
  const exp = getTokenExpiration(token);
  if (!exp) return 0;
  return exp - Date.now();
}
