import { defineStore } from "pinia"
import axios from "axios"

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
  }),
  actions: {
    getCategories() {
      axios
        .get("http://localhost:8080/api/categories")
        .then((response) => {
          this.categories = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
