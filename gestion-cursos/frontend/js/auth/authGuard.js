import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const roleRoutes = {
  admin: "./pages/admin/dashboard.html",
  docente: "./pages/docente/dashboard.html",
  estudiante: "./pages/estudiante/dashboard.html",
};

export function requireAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "../register.html";
        resolve(false);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser || currentUser.uid !== user.uid) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ uid: user.uid, email: user.email, role: "estudiante" })
        );
      }

      resolve(true);
    });
  });
}

export function requireRole(expectedRole) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user || user.role !== expectedRole) {
    const redirectUrl = roleRoutes[expectedRole] || "./pages/estudiante/dashboard.html";
    window.location.href = redirectUrl;
    return false;
  }

  return true;
}

export function loginAs(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}
