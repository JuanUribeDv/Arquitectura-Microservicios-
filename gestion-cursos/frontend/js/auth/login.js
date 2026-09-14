import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const routes = {
  admin: "./pages/admin/dashboard.html",
  docente: "./pages/docente/dashboard.html",
  estudiante: "./pages/estudiante/dashboard.html",
};

const redirectToRoleDashboard = (role = "estudiante") => {
  const target = routes[role] || routes.estudiante;
  window.location.assign(target);
};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!loginForm || !emailInput || !passwordInput) return;

  const restoreRoleFromLocalStorage = () => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    return savedUser?.role || "estudiante";
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const role = restoreRoleFromLocalStorage();
      redirectToRoleDashboard(role);
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Completa email y contraseña");
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const users = JSON.parse(localStorage.getItem("gc_users") || "[]");
      const profile = users.find((item) => item.email && item.email.toLowerCase() === user.email.toLowerCase());
      const role = profile?.role || "estudiante";

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ uid: user.uid, email: user.email, role })
      );

      loginForm.reset();
      redirectToRoleDashboard(role);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        alert("Usuario no registrado en Firebase Authentication");
      } else {
        alert("Credenciales incorrectas o usuario no existe");
      }
    }
  });
});
