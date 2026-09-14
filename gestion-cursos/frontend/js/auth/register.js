import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const loginPage = "/index.html";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const roleSelect = document.getElementById("registerRole");
  const errorMessage = document.getElementById("register-error");

  if (!form || !emailInput || !passwordInput) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect?.value || "estudiante";
    if (!email || !password) {
      errorMessage.textContent = "Completa todos los campos";
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ displayName: email.split("@")[0], role }),
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`El usuario se creó en Authentication, pero el perfil devolvió HTTP ${response.status}: ${responseText}`);
      }
      const profile = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(profile));

      form.reset();
      alert("Cuenta creada correctamente. Ahora inicia sesión.");
      window.location.assign(loginPage);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        errorMessage.textContent = "Ese correo ya está registrado en Firebase Authentication";
      } else if (error.code === "auth/weak-password") {
        errorMessage.textContent = "La contraseña debe tener al menos 6 caracteres";
      } else {
        errorMessage.textContent = error.message || "No se pudo crear la cuenta en Firebase";
      }
    }
  });
});
