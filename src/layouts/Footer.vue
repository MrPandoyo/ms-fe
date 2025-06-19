<template>
  <v-footer
    app
    color="white"
    height="60" class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3">

    <div>
      Copyright &copy; Listrique
      {{ (new Date()).getFullYear() }}
      &middot;
      All right Reserved
    </div>
  </v-footer>
</template>

<script setup>
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
