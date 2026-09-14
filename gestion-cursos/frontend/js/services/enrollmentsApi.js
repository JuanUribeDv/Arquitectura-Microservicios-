import { apiRequest } from "./apiClient.js";

async function getEnrollments() {
  return apiRequest("/enrollments");
}

async function enrollStudent(enrollmentData) {
  return apiRequest("/enrollments", {
    method: "POST",
    body: JSON.stringify(enrollmentData),
  });
}

async function getMyGrades() {
  return apiRequest("/enrollments/my-grades");
}

async function recordGrade(gradeData) {
  return apiRequest("/enrollments/grades", { method: "POST", body: JSON.stringify(gradeData) });
}

export { getEnrollments, enrollStudent, getMyGrades, recordGrade };
