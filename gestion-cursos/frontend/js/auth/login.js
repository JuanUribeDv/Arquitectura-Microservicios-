import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const routes = {
  admin: "/pages/admin/dashboard.html",
  docente: "/pages/docente/dashboard.html",
  estudiante: "/pages/estudiante/dashboard.html",
};

const redirectToRoleDashboard = (role = "estudiante") => {
  const target = routes[role] || routes.estudiante;
  window.location.assign(target);
};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("login-error");

  if (!loginForm || !emailInput || !passwordInput) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorMessage.textContent = "Completa email y contraseña";
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const token = await user.getIdToken();
      const profileResponse = await fetch("http://localhost:3000/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
      if (!profileResponse.ok) {
        const detail = await profileResponse.text();
        throw new Error(`El usuario autenticó, pero el perfil respondió HTTP ${profileResponse.status}: ${detail}`);
      }
      const profile = await profileResponse.json();
      const role = profile.role;
      if (!["admin", "docente", "estudiante"].includes(role)) throw new Error("Rol inválido");

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ uid: user.uid, email: user.email, role })
      );

      loginForm.reset();
      redirectToRoleDashboard(role);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
        errorMessage.textContent = "Firebase rechazó el correo o la contraseña. Verifica que Email/Password esté habilitado y que el usuario exista en Authentication.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage.textContent = "El correo no existe en Firebase Authentication.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage.textContent = "La contraseña no coincide con la registrada en Firebase.";
      } else if (error.message.includes("perfil respondió")) {
        errorMessage.textContent = error.message;
      } else {
        errorMessage.textContent = `No se pudo iniciar sesión: ${error.message}`;
      }
    }
  });
});
