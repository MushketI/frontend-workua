import { defineStore } from "pinia"

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    hasNewReportNotification: false,
    notifications: [],
  }),
  actions: {
    setNotification(status) {
      this.hasNewReportNotification = status
    },

    addNotification(notification) {
      this.notifications.push(notification)
      this.hasNewReportNotification = true
    },

    clearNotifications() {
      this.notifications = []
      this.hasNewReportNotification = false
    },
  },
})
