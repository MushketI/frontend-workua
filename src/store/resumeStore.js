import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import axios from "axios"

export const useResumeStore = defineStore("resume", {
  state: () => ({
    status: null,
    resume: [],
    resumeEdit: null,
    allCandidates: [],
    paginationMeta: null,
    singVacancy: null,
    router: useRouter(),
  }),
  actions: {
    createCandidateInfo(form, token) {
      axios
        .post(
          "http://localhost:8080/api/create-candidate-info",
          {
            resume: form.value.resume,
            category_id: form.value.category_id,
            skills: form.value.skills,
            education: form.value.education,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.status = response.data.status
          this.router.push("/profile")
        })
        .catch((error) => {
          this.status = error.response.data.status
          console.log(error)
        })
    },

    getCandidateInfo(token) {
      axios
        .get("http://localhost:8080/api/candidates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.resume = [response.data]
          this.resumeEdit = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    updateCandidateInfo(form, token) {
      axios
        .post(
          "http://localhost:8080/api/update-candidate-info",
          {
            resume: form.resume,
            category_id: form.category_id,
            skills: form.skills,
            education: form.education,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.status = response.data.status
        })
        .catch((error) => {
          console.log(error)
        })
    },

    toggleResumeActive(token) {
      axios
        .get("http://localhost:8080/api/candidate-toggle-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.getCandidateInfo(token)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    clearResumeInfo(token) {
      axios
        .get("http://localhost:8080/api/clear-candidate-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getAllCandidates(params = {}) {
      const token = localStorage.getItem("auth_token")
      axios
        .get("http://localhost:8080/api/all-candidates", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.allCandidates = response.data.data
          this.paginationMeta = response.data.meta
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getSingVacancy(id) {
      axios
        .get("http://localhost:8080/api/single-vacancy/" + id)
        .then((response) => {
          this.singVacancy = response.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
