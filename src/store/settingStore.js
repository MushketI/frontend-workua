import { defineStore } from "pinia"
import axios from "axios"

export const useSettingStore = defineStore("setting", {
  state: () => ({
    report: null,
  }),
  actions: {
    async getSettingReport() {
      return axios
        .get("http://localhost:8080/api/service/reports")
        .then((response) => {
          this.report = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
