<template>
  <v-layout>
    <v-app-bar color="teal-darken-1" :elevation="2">
      <template #prepend>
        <v-btn to="/">
          <v-img src="@/assets/logo.png" :width="30"/>
        </v-btn>

      </template>

      <v-app-bar-title>Management System</v-app-bar-title>

      <template #append>
        <v-btn icon="mdi-bell"/>

        <v-list-item id="user-menu">
          <v-icon icon="mdi-account"/>
          {{useAuthenticationStore().loggedUser.fullName}}
          <v-icon icon="mdi-chevron-down"/>
        </v-list-item>
        <v-menu activator="#user-menu">
          <v-list>
            <v-list-item link @click="useAuthenticationStore().logout">
              <v-icon icon="mdi-logout"/>
              Logout
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer expand-on-hover rail>
      <v-list
        :lines="false"
        density="compact"
        nav
      >
        <template v-for="(menu) in menus" :key="menu.menuId">
          <v-list-item
            v-if="menu.subMenu.length === 0"
            link
            :value="menu.menuId"
            :to="menu.menuUrl"
            color="primary"
          >
            <template #prepend>
              <v-icon :icon="menu.menuIcon"></v-icon>
            </template>

            <v-list-item-title link v-text="menu.menuName"></v-list-item-title>
          </v-list-item>

          <!--         for nested menu -->
          <v-list-group
            v-else
            :value="menu.menuId">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="menu.menuName"
                :prepend-icon="menu.menuIcon"
              ></v-list-item>
            </template>

            <v-list-item
              v-for="(subMenu) in menu.subMenu"
              :key="subMenu.menuId"
              :prepend-icon="subMenu.menuIcon"
              :title="subMenu.menuName"
              :value="subMenu.menuId"
              :to="subMenu.menuUrl"
              link
            ></v-list-item>
          </v-list-group>

        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-breadcrumbs :items="[currentRouteName]"/>
      <router-view/>
    </v-main>
  </v-layout>
  <Footer/>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAuthenticationStore} from "@/stores/app.js";
import Footer from "@/layouts/Footer.vue";

const route = useRoute()
const currentRouteName = computed(() => route.name)
const menus = useAuthenticationStore().menus
</script>

<style scoped>
.v-list-group__items .v-list-item{
  padding-inline-start: 10px !important;
}
</style>
