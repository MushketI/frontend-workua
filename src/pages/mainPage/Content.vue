<template>
  <div class="content">
    <MainCandidates
      v-if="!authStore.user || (authStore.user && authStore.user.role_id !== 2)"
    />
    <MainEmployers v-if="authStore.user && authStore.user.role_id === 2" />
  </div>
</template>

<script setup>
import { useAuthStore } from "../../store/authStore"
import MainCandidates from "./mainCandidates/MainCandidates.vue"
import MainEmployers from "./mainEmployers/MainEmployers.vue"

const authStore = useAuthStore()
// authStore.getUser()
</script>

<style scoped>
.content {
  height: 100vh;
}
</style>
