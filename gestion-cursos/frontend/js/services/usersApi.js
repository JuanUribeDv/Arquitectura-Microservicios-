async function getUsers() {
  return apiRequest("/users");
}

async function createUser(userData) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
