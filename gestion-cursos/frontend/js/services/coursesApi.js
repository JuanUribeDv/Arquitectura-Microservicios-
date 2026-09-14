import { apiRequest } from "./apiClient.js";

async function getCourses() {
  return apiRequest("/courses");
}

async function createCourse(courseData) {
  return apiRequest("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}

async function assignCourseTeacher(courseId, teacherUid) {
  return apiRequest(`/courses/${courseId}/teacher`, {
    method: "PATCH",
    body: JSON.stringify({ teacherUid }),
  });
}

export { getCourses, createCourse, assignCourseTeacher };
