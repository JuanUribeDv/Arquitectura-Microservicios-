function renderNavbar(userRole = "admin") {
  const navbar = document.createElement("nav");
  navbar.className = "navbar";

  const links = {
    admin: [
      { label: "Dashboard", href: "./dashboard.html" },
      { label: "Usuarios", href: "./usuarios.html" },
      { label: "Cursos", href: "./cursos.html" },
    ],
    docente: [
      { label: "Dashboard", href: "./dashboard.html" },
      { label: "Mis cursos", href: "./mis-cursos.html" },
      { label: "Calificar", href: "./calificar.html" },
    ],
    estudiante: [
      { label: "Dashboard", href: "./dashboard.html" },
      { label: "Mis cursos", href: "./mis-cursos.html" },
      { label: "Curso", href: "./curso-detalle.html" },
    ],
  };

  const list = document.createElement("ul");
  list.className = "nav-links";

  links[userRole].forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    li.appendChild(a);
    list.appendChild(li);
  });

  navbar.appendChild(list);
  return navbar;
}
