const roleRoutes = {
  admin: "/pages/admin/dashboard.html",
  docente: "/pages/docente/dashboard.html",
  estudiante: "/pages/estudiante/dashboard.html",
};

export function requireRole(expectedRole) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user || user.role !== expectedRole) {
    const redirectUrl = roleRoutes[expectedRole] || "/pages/estudiante/dashboard.html";
    window.location.href = redirectUrl;
    return false;
  }

  return true;
}

