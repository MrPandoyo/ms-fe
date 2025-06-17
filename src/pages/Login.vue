<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh">
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-4" elevation="10">
              <v-card-title class="text-h6 text-center mb-4">Login</v-card-title>
              <v-form ref="form">
                <v-text-field
                  v-model="username"
                  type="text"
                  label="Username"
                  prepend-icon="mdi-account"
                  :rules="rules"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  prepend-icon="mdi-lock"
                  :rules="rules"
                />
                <v-btn color="primary" type="button" block class="mt-4" @click="submitLogin" :loading="loading">Login
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-4" elevation="10">
              available user :
              <v-table density="compact">
                <thead>
                <tr>
                  <th class="text-left">
                    Username
                  </th>
                  <th class="text-left">
                    Password
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>superadmin</td>
                  <td>admin</td>
                </tr>
                <tr>
                  <td>admin01</td>
                  <td>admin</td>
                </tr>
                <tr>
                  <td>user01</td>
                  <td>admin</td>
                </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthenticationStore} from "@/stores/app.js";

const username = ref('')
const password = ref('')
const loading = ref(false)
const form = ref(null)
const rules = [
  value => {
    if (value) {
      return true
    }
    return "Field can't be empty"
  },
]

async function submitLogin() {
  try {
    loading.value = true

    const {valid} = await form.value.validate()
    if (!valid) {return false}

    await useAuthenticationStore().login(username.value, password.value)
  } catch (err) {
    console.log("error = ", err)
  } finally {
    loading.value = false
  }
}
</script>
