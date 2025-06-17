<template>
  <v-footer
    app
    border
    color="teal"
    height="40"
  >

    <div
      class="text-caption"
      style="position: absolute; right: 16px"
    >
      &copy; {{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Iqbal Pandoyo</span>
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
