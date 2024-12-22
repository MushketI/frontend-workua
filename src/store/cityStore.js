import { defineStore } from "pinia"
import axios from "axios"

export const useCityStore = defineStore("cityStore", {
  state: () => ({
    cities: [],
  }),
  actions: {
    getCity() {
      axios
        .get("http://localhost:8080/api/cities")
        .then((response) => {
          this.cities = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
