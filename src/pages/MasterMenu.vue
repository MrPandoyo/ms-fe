<template>
  <v-container>
    <v-row>
      <v-col cols="12 d-flex justify-end">
        <v-btn
          border
          variant="outlined"
          color="primary"
          class="me-2 text-none"
          prepend-icon="mdi-plus-circle-outline"
          rounded="lg"
          text="Add Child"
          @click="add(false)"
        />
        <v-btn
          border
          color="primary"
          class="me-2 text-none"
          prepend-icon="mdi-plus-circle-outline"
          rounded="lg"
          text="Add Parent"
          @click="add(true)"
        />
      </v-col>
      <v-col cols="12">
        <v-sheet border rounded="lg" elevation="1">
          <v-toolbar color="white" rounded="lg">
            <v-toolbar-title class="font-weight-bold">
              <v-icon color="medium-emphasis" icon="mdi-format-list-text" size="x-small" start/>
              Master Menu
            </v-toolbar-title>

            <template v-slot:append>
              <div class="d-flex ga-1">
                <v-btn
                  border
                  class="me-1 text-none bg-grey-lighten-3"
                  height="2.5rem"
                  rounded="lg"
                  text="Delete"/>
                <v-btn
                  border
                  class="me-1 text-none bg-grey-lighten-3"
                  height="2.5rem"
                  rounded="lg">
                  <v-icon icon="mdi-refresh"></v-icon>
                </v-btn>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  placeholder="Search data..."
                  prepend-inner-icon="mdi-magnify"
                  width="250"
                  flat
                  hide-details
                  single-line
                ></v-text-field>
                <v-btn
                  border
                  class="me-1 text-none bg-grey-lighten-3"
                  height="2.5rem"
                  rounded="lg"
                  text="Search"/>
              </div>
            </template>
          </v-toolbar>

          <v-data-table
            :headers="headers"
            :items="tableData"
            show-expand
            item-value="menuId"
          >
            <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
              <v-btn
                v-if="internalItem.raw.subMenu && internalItem.raw.subMenu.length > 0"
                :icon="isExpanded(internalItem) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline'"
                border="0"
                rounded="lg"
                size="2rem"
                elevation="0"
                @click="toggleExpand(internalItem)"
              ></v-btn>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
              <tr v-if="item.subMenu && item.subMenu.length > 0">
                <td :colspan="columns.length" class="py-2">
                  <v-sheet rounded="lg" border>
                    <v-data-table
                      :headers="headers"
                      :items="item.subMenu"
                      hide-default-footer
                    >
                      <template #item.data-table-expand="{ subMenu }"></template>
                      <template #item.status="{ item }">
                        <div class="d-flex ga-2 justify-center">
                          <v-btn class="text-none" rounded="xl" variant="outlined" readonly :color="item.status==='ACTIVE' ? 'green':'red'">{{ item.status === 'ACTIVE' ? 'Active' : 'Non Active' }}</v-btn>
                        </div>
                      </template>
                      <template #item.actions="{ item }">
                        <div class="d-flex ga-2 justify-center">
                          <v-btn
                            border
                            color="primary"
                            class="text-none"
                            prepend-icon="mdi-pencil-box-outline"
                            rounded="lg"
                            text="Edit"
                            @click="edit(item.menuId)"
                          />
                        </div>
                      </template>
                    </v-data-table>
                  </v-sheet>
                </td>
              </tr>
            </template>

            <template #item.status="{ item }">
              <div class="d-flex ga-2 justify-center">
                <v-btn class="text-none" rounded="xl" variant="outlined" readonly :color="item.status==='ACTIVE' ? 'green':'red'">{{ item.status === 'ACTIVE' ? 'Active' : 'Non Active' }}</v-btn>
              </div>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex ga-2 justify-center">
                <v-btn
                  border
                  color="primary"
                  class="text-none"
                  prepend-icon="mdi-pencil-box-outline"
                  rounded="lg"
                  text="Edit"
                  @click="edit(item.menuId)"
                />
              </div>
            </template>

            <template #bottom="{ page,itemsPerPage,pageCount }">
              <v-divider></v-divider>

              <v-toolbar color="white" rounded="lg" elevation="0" class="">
                <v-toolbar-title style="font-size: 1rem">
                  Showing {{ itemsPerPage * (page - 1) + 1 }} to {{ itemsPerPage * page }} of {{ pageCount * itemsPerPage }} entries
                </v-toolbar-title>

                <template v-slot:append>
                  <div class="d-flex ga-1">
                    <v-pagination
                      :length="20"
                      color="primary"
                      size="2rem"
                      :variant="'outlined'"
                      :total-visible="5"
                      class="mt-2"
                    >
                      <template v-slot:prev="{disabled}">
                        <v-btn variant="text" icon="mdi-chevron-left" size="2rem" :disabled="disabled"></v-btn>
                      </template>
                      <template v-slot:next="{disabled}">
                        <v-btn variant="text" icon="mdi-chevron-right" size="2rem" :disabled="disabled"></v-btn>
                      </template>
                    </v-pagination>
                  </div>
                </template>
              </v-toolbar>
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
                Menu Form
              </v-col>
              <v-col cols="12" v-if="!isParent">
                <b>Menu Parent</b>
                <SelectMenu v-model="record.parent" :rules="required" @update-value="updateParent"/>
              </v-col>
              <v-col cols="6">
                <b>Menu Name</b>
                <v-text-field v-model="record.menuName" :rules="required"/>
              </v-col>
              <v-col cols="6">
                <b>Menu Code</b>
                <v-text-field v-model="record.menuCode" :rules="required"/>
              </v-col>
              <v-col cols="6">
                <b>Menu Icon</b>
                <v-text-field v-model="record.menuIcon"/>
              </v-col>
              <v-col cols="6">
                <b>Menu Url</b>
                <v-text-field v-model="record.menuUrl" :rules="required"/>
              </v-col>
              <v-col cols="6">
                <b>Menu Order</b>
                <v-text-field type="number" v-model="record.menuOrder"/>
              </v-col>
              <v-col cols="6">
                <b>Status</b>
                <v-select
                  v-model="record.status"
                  :items="statuses"
                  item-title="title"
                  item-value="value"
                ></v-select>
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
import {computed, onMounted, ref, watch} from 'vue'
import {getListMenu, saveMenu} from "@/service/masterMenu.js";

const headers = [
  {title: '', key: 'data-table-expand'},
  {title: 'Menu Name', key: 'menuName'},
  {title: 'Menu Code', key: 'menuCode'},
  {title: 'Menu Icon', key: 'menuIcon'},
  {title: 'Menu Url', key: 'menuUrl'},
  {title: 'Status', key: 'status', align: 'center'},
  {title: 'Action', key: 'actions', align: 'center', sortable: false},
]

const statuses = [
  {title:'Active', value:'ACTIVE'},
  {title:'Inactive', value:'INACTIVE'}
]

const DEFAULT_RECORD = {
  id: null,
  parent: null,
  parentId: null,
  menuCode: null,
  menuName: null,
  menuIcon: null,
  menuUrl: null,
  status: 'ACTIVE',
  menuOrder: null
}

const search = ref()
const tableData = ref([])
const record = ref(DEFAULT_RECORD)
const dialog = ref(false)
const isEditing = ref(false)
const isParent = ref(false)
const form = ref()

const required = [value => !!value || 'This field is required']

const allData = computed(() => {
  const datas = []
  for (const data of tableData.value) {
    datas.push(data)
    if (data.subMenu.length > 0) {
      for (const datum of data.subMenu) {
        const subMenu = datum
        subMenu.parent = {menuId:data.menuId,menuName:data.menuName}
        subMenu.parentId = data.menuId
        datas.push(subMenu)
      }
    }
  }
  return datas
});

onMounted(() => {
  fetchData()
  reset()
})

const updateParent = (value) => {
  record.value.parentId = value.menuId;
};

function reset() {
  search.value = null
  dialog.value = false
  record.value = {...DEFAULT_RECORD}
}

function add(val) {
  isEditing.value = false
  isParent.value = val
  record.value = {...DEFAULT_RECORD}
  dialog.value = true
}

function edit(id) {
  isEditing.value = true

  const data = allData.value.find(menu => menu.menuId === id)
  record.value = {...data}
  isParent.value = data.parentId == null

  dialog.value = true
}

async function submitForm() {
  const {valid} = await form.value.validate()
  if (valid) {
    await save()
    dialog.value = false
  }
}

async function fetchData() {
  getListMenu(search.value).then(function (response) {
    tableData.value = response.data.data
  }).catch(function (error) {
    const statusCode = error.response.status
    const statusMessage = error.response.data
    console.log("error", error)
  })
}

async function save() {
  saveMenu(record.value).then(function (response) {
    alert("Data saved")
    fetchData()
  }).catch(function (error) {
    const statusCode = error.response.status
    const statusMessage = error.response.data
    console.log("error", error)
    alert("Error saving : " + statusMessage)
  })
}

function remove(id) {
}

</script>
