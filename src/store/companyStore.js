import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import axios from "axios"

export const useCompanyStore = defineStore("company", {
  state: () => ({
    company: [],
    status: null,
    vacancies: null,
    allVacancy: [],
    singVacancy: null,
    paginationMeta: null,
    singCandidate: null,
    router: useRouter(),
  }),
  actions: {
    createCompany(form, token) {
      axios
        .post(
          "http://localhost:8080/api/create-company",
          {
            name: form.value.name,
            description: form.value.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.router.push("/profile")
        })
        .catch((error) => {
          this.status = error.response.data.status
          console.log(error)
        })
    },

    createVacancy(form, token) {
      console.log(form.value)
      axios
        .post(
          "http://localhost:8080/api/create-vacancy",
          {
            name: form.value.name,
            employment_type: form.value.employmentTypes,
            category_id: form.value.category_id,
            locations_id: form.value.city,
            salary: form.value.salary,
            description: form.value.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.router.push("/profile-company")
          this.status = response.data.status
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getUserCompany(token) {
      axios
        .get("http://localhost:8080/api/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.company = [response.data.data]
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getCompanyVacancy(token) {
      axios
        .get("http://localhost:8080/api/vacancies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.vacancies = response.data.vacancies
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    toggleStatusVacancy(id, token) {
      axios
        .put(
          "http://localhost:8080/api/vacancies-toggle-status/" + id,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const token = localStorage.getItem("auth_token")
          this.getCompanyVacancy(token)
          this.status = response.data.status
        })
        .catch((error) => {
          console.log(error)
        })
    },

    deleteVacancy(id, token) {
      axios
        .delete("http://localhost:8080/api/vacancies-delete/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const token = localStorage.getItem("auth_token")
          this.getCompanyVacancy(token)
          this.status = response.data.status
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getVacancyById(id, token) {
      axios
        .get("http://localhost:8080/api/vacancies/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.singVacancy = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    updateVacancy(form, id, token) {
      axios
        .post(
          "http://localhost:8080/api/vacancies-update/" + id,
          {
            name: form.name,
            employment_type: form.employmentTypes,
            category_id: form.category_id,
            locations_id: form.city,
            salary: form.salary,
            description: form.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.status = response.data.status
          this.router.push("/profile-company")
        })
        .catch((error) => {
          this.status = error.response.data.status
        })
    },

    deleteCompany(id, token) {
      axios
        .delete("http://localhost:8080/api/companies-delete/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.company = []
          const token = localStorage.getItem("auth_token")
          this.getUserCompany(token)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getAllVacancy(params = {}) {
      const token = localStorage.getItem("auth_token")

      axios
        .get("http://localhost:8080/api/all-vacancies", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.allVacancy = response.data.data
          this.paginationMeta = response.data.meta
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getSingCandidate(id) {
      axios
        .get("http://localhost:8080/api/single-candidate/" + id)
        .then((response) => {
          this.singCandidate = response.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    clearCompany() {
      this.company = []
      this.status = null
      this.vacancies = null
      this.singVacancy = null
    },
  },
})
