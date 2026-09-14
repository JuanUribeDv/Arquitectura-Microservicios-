async function getEnrollments() {
  return apiRequest("/enrollments");
}

async function enrollStudent(enrollmentData) {
  return apiRequest("/enrollments", {
    method: "POST",
    body: JSON.stringify(enrollmentData),
  });
}
