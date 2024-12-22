<template>
  <el-header>
    <div class="header-container">
      <div class="logo">
        <span class="logo-text">Work.ua</span>
      </div>

      <el-menu mode="horizontal" class="menu">
        <el-menu-item index="1">
          <router-link to="/">Главная</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/profile">Профиль</router-link>
        </el-menu-item>
      </el-menu>

      <div v-if="!authStore.user" class="auth-buttons">
        <router-link to="/login">
          <el-button type="primary">Login</el-button>
        </router-link>

        <router-link to="/register">
          <el-button>Register</el-button>
        </router-link>
      </div>

      <div v-if="authStore.user" class="auth-buttons">
        <div class="bell" @mouseleave="hideNotifications">
          <el-badge
            :value="notificationStore.hasNewReportNotification ? '!' : ''"
            class="notification-badge"
            link
          >
            <el-icon @click="toggleNotifications" class="notification-icon">
              <Bell />
            </el-icon>
          </el-badge>

          <transition name="fade">
            <div v-if="showNotifications" class="notification-popup">
              <h4>Уведомления</h4>
              <ul>
                <li
                  v-for="(
                    notification, index
                  ) in notificationStore.notifications"
                  :key="index"
                >
                  {{ notification.message }}
                  <router-link to="/reports"> посмотреть </router-link>
                </li>
              </ul>
              <el-button type="text" @click="clearNotifications"
                >Очистить</el-button
              >
            </div>
          </transition>
        </div>

        <router-link to="/profile">
          <el-button>{{ authStore.user.email }}</el-button>
        </router-link>

        <el-button @click="handleLogout" type="primary">Exit</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "../../store/authStore"
import { useNotificationStore } from "../../store/notificationStore"
import { Bell } from "@element-plus/icons-vue"

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const hideNotifications = () => {
  showNotifications.value = false
}

const clearNotifications = () => {
  notificationStore.clearNotifications()
  showNotifications.value = false
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.notification-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 24px;
}
.notification-popup {
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  z-index: 1000;
}
.notification-popup h3 {
  margin: 0 0 10px;
}
.notification-popup ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.notification-popup li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.notification-popup li:last-child {
  border-bottom: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.notification-badge {
  cursor: pointer;
}
.bell {
  display: flex;
  justify-content: end;
  align-items: center;
  position: relative;
  margin-right: 5px;
  width: 300px;
}
.el-menu-item:hover {
  background-color: transparent !important;
  color: inherit !important;
}
.el-menu-item.is-active {
  color: inherit !important;
  background-color: transparent !important;
}
.el-menu-item.is-active:hover {
  background-color: transparent !important;
}
.el-menu-item a {
  text-decoration: none !important;
  color: inherit !important;
  font-size: 1.1em;
  font-weight: 600;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}
.logo {
  padding-right: 10px;
  font-size: 1.5em;
  font-weight: bold;
}
.menu {
  display: flex;
  width: 50rem;
  background-color: #409eff;
  border: #409eff;
}
.auth-buttons {
  display: flex;
  padding-left: 10px;
  gap: 10px;
}
.el-header {
  background-color: #409eff;
  padding: 10px 0;
  color: white;
}
</style>
