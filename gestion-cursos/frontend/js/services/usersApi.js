import { apiRequest } from "./apiClient.js";

async function getUsers() {
  return apiRequest("/users");
}

async function createUser(userData) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

async function getStudents() {
  return apiRequest("/users/students");
}

export { getUsers, createUser, getStudents };
