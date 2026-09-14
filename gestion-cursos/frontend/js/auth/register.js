import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const loginPage = "./index.html";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const roleSelect = document.getElementById("registerRole");

  if (!form || !emailInput || !passwordInput || !roleSelect) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value || "estudiante";

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const users = JSON.parse(localStorage.getItem("gc_users") || "[]");
      const exists = users.some((item) => item.email && item.email.toLowerCase() === email.toLowerCase());

      if (!exists) {
        users.push({
          uid: user.uid,
          email: user.email,
          role,
          name: email.split("@")[0],
        });
      }

      localStorage.setItem("gc_users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify({ uid: user.uid, email: user.email, role }));

      form.reset();
      alert("Cuenta creada correctamente. Ahora inicia sesión.");
      window.location.assign(loginPage);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Ese correo ya está registrado en Firebase Authentication");
      } else if (error.code === "auth/weak-password") {
        alert("La contraseña debe tener al menos 6 caracteres");
      } else {
        alert("No se pudo crear la cuenta en Firebase");
      }
    }
  });
});
