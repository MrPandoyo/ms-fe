<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet border rounded>
          <v-data-table
              :headers="headers"
              :hide-default-footer="tableData.length < 11"
              :items="tableData"
              item-value="roleId"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start/>
                  List Role
                </v-toolbar-title>
              </v-toolbar>
            </template>

            <template #item.menu="{ item }">
              <div class="d-flex ga-2 justify-center">
                <v-list
                    :lines="false"
                    density="compact">
                  <template v-for="(menu) in item.menus" :key="menu.menuId">
                    <v-list-item
                        v-if="menu.subMenu.length === 0"
                        :value="menu.menuId"
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
                          link
                      ></v-list-item>
                    </v-list-group>

                  </template>
                </v-list>
              </div>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex ga-2 justify-center">
                <v-btn
                    border
                    class="me-2 bg-yellow"
                    prepend-icon="mdi-pencil"
                    rounded="lg"
                    text="Edit"
                    @click="edit(item.roleId)"
                />
              </div>
            </template>

            <template #no-data>
              No Data
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="50%">
      <v-card>
        <template #text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12 text-h6">
                Role Form
              </v-col>
              <v-col cols="12">
                <b>Role Name</b>
                <v-text-field v-model="record.roleName" readonly/>
              </v-col>
              <v-col cols="12">
                <b>Role Menu</b>
                <SelectMenu :return-object="false" multiple ignore-nested v-model="record.selectedMenuIds" :rules="required"/>
              </v-col>
            </v-row>
          </v-form>
        </template>
        <v-divider/>

        <v-card-actions class="bg-surface-light">
          <v-btn text="Batal" variant="plain" @click="dialog = false"/>
          <v-btn class="bg-teal" text="Simpan" @click="submitForm"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {getListRole, getRoleMenuList, saveRoleMenu} from "@/service/masterRole.js";

const headers = [
  {title: 'Role Name', key: 'roleName'},
  {title: 'Role Code', key: 'roleCode'},
  {title: 'Description', key: 'description'},
  {title: 'Menu', key: 'menu', align: 'center'},
  {title: 'Actions', key: 'actions', align: 'center', sortable: false},
]

const DEFAULT_RECORD = {
  roleId: null,
  roleName: null,
  selectedMenuIds: []
}

const tableData = ref([])
const record = ref(DEFAULT_RECORD)
const dialog = ref(false)
const isEditing = ref(false)
const form = ref()

const required = [value => !!value || 'This field is required']

onMounted(() => {
  fetchData()
  reset()
})

function reset() {
  dialog.value = false
  record.value = {...DEFAULT_RECORD}
}

function add(val) {
  isEditing.value = false
  record.value = {...DEFAULT_RECORD}
  dialog.value = true
}

function edit(id) {
  isEditing.value = true

  const data = tableData.value.find(role => role.roleId === id)
  const menuIds = []

  for (const menu of data.menus) {
    menuIds.push(menu.menuId)
    if(menu.subMenu.length > 0){
      for (const subMenu of menu.subMenu) {
        menuIds.push(subMenu.menuId)
      }
    }
  }

  record.value = {
    roleId: data.roleId,
    roleName: data.roleName,
    selectedMenuIds: menuIds,
  }
  dialog.value = true
  console.log("record edit selectedMenuIds = ",menuIds)
}

async function submitForm() {
  const {valid} = await form.value.validate()
  if (valid) {
    await save()
    dialog.value = false
  }
}

async function fetchData() {
  try {
    const listRole = await getListRole()
    let datas = listRole.data.data

    for (const role of datas) {
      role.menus = (await getRoleMenuList(role.roleId)).data.data
    }

    tableData.value = datas
  }catch (e) {
    console.log("error", error)
  }
}

async function save() {
  const payload = {
    roleId:record.value.roleId,
    menuIds:record.value.selectedMenuIds
  }
  console.log("payload = ", payload)
  saveRoleMenu(payload).then(function (response) {
    alert("Data saved")
    fetchData()
  }).catch(function (error) {
    const statusMessage = error.response.data
    console.log("error", error)
    alert("Error saving : " + statusMessage)
  })
}

function remove(id) {
}


</script>
<style scoped>
.v-list-group__items .v-list-item{
  padding-inline-start: 10px !important;
}
</style>
