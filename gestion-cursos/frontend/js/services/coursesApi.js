async function getCourses() {
  return apiRequest("/courses");
}

async function createCourse(courseData) {
  return apiRequest("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}
