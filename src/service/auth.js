import apiClient from "@/service/api.js";

const loginRequest =  function(username, password) {
  return apiClient.post("/api/v1/auth/login", {
    username: username, password: password
  })
}

const logoutRequest =  function() {
  return apiClient.post("/api/v1/auth/logout")
}

export {loginRequest, logoutRequest};
