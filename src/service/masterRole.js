import apiClient from "@/service/api.js";

const getListRole =  function() {
  return apiClient.get("/api/v1/role")
}

const getRoleMenuList =  function(id) {
  return apiClient.get("/api/v1/role/"+id+"/menu")
}

const saveRoleMenu =  function(role) {
  return apiClient.post("/api/v1/role-menu", role)
}

export {getListRole, saveRoleMenu, getRoleMenuList};
