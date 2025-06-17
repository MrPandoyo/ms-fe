// Utilities
import {defineStore} from 'pinia'
import router from "@/router/index.js";
import {loginRequest, logoutRequest} from "@/service/auth.js";

export const useAuthenticationStore = defineStore('authentication', () => {
  const loggedUser = ref(null)
  const isLoggedIn = computed(() => loggedUser.value != null)
  const menus = computed(() => loggedUser.value != null ? loggedUser.value.menu : [])

  async function login(username, password) {

    await loginRequest(username, password)
      .then(function (response) {
        loggedUser.value = response.data.data
        router.push('/')
      })
      .catch(function (error) {
        const statusCode = error.response.status
        const statusMessage = error.response.data
        alert("Login Error : " + statusCode + " " + statusMessage)
      })

  }

  async function logout() {

    await logoutRequest()
      .then(function (response) {
        removeUser()
        router.push('/login')
      })
      .catch(function (error) {
        const statusCode = error.response.status
        const statusMessage = error.response.data

        alert("Logout Error : " + statusCode + " " + statusMessage)
      })

  }

  function getToken() {
    return loggedUser.value != null ? loggedUser.value.token : null
  }

  function removeUser() {
    loggedUser.value = null
  }

  return {
    loggedUser, login, logout, getToken, isLoggedIn, menus, removeUser
  }
}, {persist: true})
