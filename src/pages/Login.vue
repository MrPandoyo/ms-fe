<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh">
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="3">
            <v-card class="pa-5" elevation="5" rounded="xl">
              <v-img class="pb-5" src="@/assets/logo_lq.png" :width="250"/>
              <v-card-title class="text-h5 pl-0 pb-0 font-weight-bold">Hi, Welcome</v-card-title>
              <v-card-subtitle class="pl-0">It's good to see you again</v-card-subtitle>

              <v-form ref="form" class="pt-10">
                <div class="text-subtitle-1 font-weight-bold">Username</div>
                <v-text-field
                  v-model="username"
                  type="text"
                  placeholder="Input username"
                  density="compact"
                  variant="outlined"
                  :rules="rules"
                />
                <div class="text-subtitle-1 font-weight-bold">Password</div>
                <v-text-field v-model="password" :rules="rules"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Input password"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>

                <div class="text-subtitle-1">
                  Forgot your password?
                  <a class=" text-blue" href="#" rel="noopener noreferrer" target="_blank">
                    Click here
                  </a>
                </div>
                <v-btn color="primary" type="button" block rounded="md" class="mt-4" @click="submitLogin" :loading="loading">Login</v-btn>
              </v-form>
              <v-card-text class="text-center">
                Don't have an account?
                <a class="text-blue text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
                  Register
                </a>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="3">
            <v-card class="pa-5" elevation="5" rounded="xl">
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
    <Footer></Footer>
  </v-app>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthenticationStore} from "@/stores/app.js";
import Footer from "@/layouts/Footer.vue";

const username = ref('')
const password = ref('')
const visible = ref(false)
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
