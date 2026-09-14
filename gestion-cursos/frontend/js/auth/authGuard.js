const roleRoutes = {
  admin: ["/pages/admin/"],
  docente: ["/pages/docente/"],
  estudiante: ["/pages/estudiante/"],
};

function requireRole(expectedRole) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user || user.role !== expectedRole) {
    window.location.href = "/frontend/index.html";
    return false;
  }

  return true;
}

function loginAs(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
