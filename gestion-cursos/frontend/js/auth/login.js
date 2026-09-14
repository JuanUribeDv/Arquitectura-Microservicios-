document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const role = document.getElementById("role")?.value;

    if (!email || !password || !role) {
      alert("Completa todos los campos");
      return;
    }

    console.log("Login simulado:", { email, password, role });

    const routes = {
      admin: "./pages/admin/dashboard.html",
      docente: "./pages/docente/dashboard.html",
      estudiante: "./pages/estudiante/dashboard.html",
    };

    if (routes[role]) {
      window.location.href = routes[role];
    }
  });
});
