<template>
  <v-layout>
    <v-app-bar color="white" elevation="0" border="sm" height="70">

      <v-app-bar-nav-icon rounded="0" width="250" border="sm" height="100">
        <v-img src="@/assets/logo_lq.png" width="180"/>
      </v-app-bar-nav-icon>

      <v-app-bar-title>
        <span class="text-h6">
           {{ currentRouteName }}
        </span>
        <v-breadcrumbs class="pa-0" density="compact"
                       active-class="text-blue"
                       :items="nestedRoutes"
        >
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-app-bar-title>

      <template #append>
        <v-btn style="background-color: #F4F6FA" icon="">
          <v-badge color="error" content="5">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-divider class="pl-5" vertical inset length="50" ></v-divider>

        <v-list>
          <v-list-item
            prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
            :subtitle="useAuthenticationStore().loggedUser.username"
            :title="useAuthenticationStore().loggedUser.fullName"
          >
            <template v-slot:title>
              <span class="font-weight-bold">
                {{ useAuthenticationStore().loggedUser.fullName }}
              </span>
            </template>
            <template v-slot:append>
              <v-btn id="user-menu"
                icon="mdi-menu-down"
                size="small"
                variant="text"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
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

    <v-navigation-drawer>
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

    <v-main class="ma-5">
        <router-view/>
    </v-main>
  </v-layout>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAuthenticationStore} from "@/stores/app.js";

const route = useRoute()
const currentRouteName = computed(() => route.name)
const nestedRoutes = computed(() => {
  let nested = route.matched
    .filter(r => r.name) // Only include routes with a name
    .map(r => r.name)
  nested.unshift('ListriQu')
  return nested
})

const menus = useAuthenticationStore().menus

</script>

<style scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 30px !important;
}

:deep(.v-breadcrumbs-divider) {
  padding: 0 !important;
  font-size: 13px;
}

:deep(.v-breadcrumbs-item) {
  padding: 0 !important;
  font-size: 13px;
}

:deep(.v-breadcrumbs-item--disabled) {
  color: #0E71BC;
  opacity: 100;
}

:deep(thead){
  background-color: #F9FAFC;
}
</style>
