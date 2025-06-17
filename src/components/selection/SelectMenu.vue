<template>
  <v-select
    v-model="selectedMenu"
    :items="ignoreNested ? ignoreNestedList : datas"
    item-title="menuName"
    item-value="menuId"
    :loading="loading"
    :disabled="loading || datas.length === 0"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    clearable
    :return-object="returnObject"
    :rules="validationRules"
    @update:model-value="validate"
    :error-messages="errorMessages"
    :multiple="multiple"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>No Data</v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import {ref, watch, defineModel, defineEmits, defineProps, computed} from 'vue';
import {getListMenu} from "@/service/masterMenu.js";

const emit = defineEmits(['updateValue','valid'])

const selectedMenu = defineModel()
const datas = ref([]);
const loading = ref(true);
const errorMessages = ref([]);
const isValid = ref(true);

const props = defineProps({
  rules: {
    type: Array,
    default: () => [],
  },
  multiple:{
    type: Boolean,
    default: ()=> false
  },
  ignoreNested:{
    type: Boolean,
    default: ()=> false
  },
  returnObject:{
    type: Boolean,
    default: ()=> true
  }
});

const ignoreNestedList = computed(() => {
  const result = []
  for (const data of datas.value) {
    result.push(data)
    if (data.subMenu.length > 0) {
      result.push(...data.subMenu)
    }
  }
  return result
});

const validationRules = computed(() => {
  return props.rules.concat(
    (value) => {
      errorMessages.value = [];
      if (!value) {
        errorMessages.value = ["This field is required"];
        isValid.value = false;
        return "This field is required";
      }
      isValid.value = true;
      return true;
    }
  )
});

const validate = () => {
  emit('valid', isValid.value);
}

watch(() => selectedMenu.value, () => {
  validate();
});

watch(selectedMenu, async (newVal, oldVal) => {
  emit('updateValue', newVal);
})

const fetchMenu = async () => {
  getListMenu(null).then(function (response) {
    datas.value = response.data.data
  }).catch(function (error) {
    console.log("error", error)
  }).finally(function () {
    loading.value = false
  })
};

// Fetch menu when the component is mounted
onMounted(() => {
  fetchMenu();
});

</script>
