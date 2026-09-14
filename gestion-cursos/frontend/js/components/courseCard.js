function createCourseCard(course) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <h3>${course.title || "Curso sin nombre"}</h3>
    <p>${course.description || "Sin descripción disponible"}</p>
    <button>Ver detalle</button>
  `;
  return card;
}
