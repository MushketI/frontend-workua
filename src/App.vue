<template>
  <div>
    <Header />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useAuthStore } from "./store/authStore"
import Header from "./pages/headerPage/Header.vue"

const authStore = useAuthStore()

onMounted(() => {
  authStore.getUser()
  console.log("App onMounted")
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
