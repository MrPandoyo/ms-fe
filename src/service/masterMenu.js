import apiClient from "@/service/api.js";

const getListMenu =  function(search) {
  if(!search) search = ''
  return apiClient.get("/api/v1/menu?search="+search)
}

const saveMenu =  function(menu) {
  return apiClient.post("/api/v1/menu", menu)
}

export {getListMenu, saveMenu};
