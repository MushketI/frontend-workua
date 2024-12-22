import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import { useResumeStore } from "./resumeStore"
import { useCompanyStore } from "./companyStore"
import axios from "axios"

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: null,
    status: null,
    router: useRouter(),
    resumeStore: useResumeStore(),
    companyStore: useCompanyStore(),
  }),
  actions: {
    getUser() {
      axios.defaults.withCredentials = false
      const token = localStorage.getItem("auth_token")

      return axios
        .get("http://localhost:8080/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.user = response.data
          console.log(this.user, "getUser success")
        })
        .catch((error) => {
          this.user = null
          this.status = error.response.data.status
        })
    },

    login(form) {
      axios
        .post("http://localhost:8080/api/login", {
          email: form.value.email,
          password: form.value.password,
        })
        .then((response) => {
          if (response.data.status.code === 200) {
            this.user = response.data.user
            localStorage.setItem("auth_token", response.data.token)
            this.router.push("/profile")
          }
          this.status = response.data.status
        })
        .catch((error) => {
          this.status = error.response.data.status
        })
    },

    register(form) {
      axios
        .post("http://localhost:8080/api/register", {
          name: form.value.name,
          email: form.value.email,
          phone: `+380${form.value.phone}`,
          role_id: form.value.role_id,
          password: form.value.password,
          password_confirmation: form.value.password,
        })
        .then((response) => {
          if (response.data.status.code === 200) {
            this.user = response.data.user
            localStorage.setItem("auth_token", response.data.token)
            this.router.push("/profile")
          }
          this.status = response.data.status
        })
        .catch((error) => {
          this.user = null
          this.status = error.response.data.status
        })
    },

    logout() {
      const token = localStorage.getItem("auth_token")

      if (!token) {
        console.error(
          "Токен не найден. Возможно, пользователь не вошел в систему"
        )
        return
      }

      axios
        .post(
          "http://localhost:8080/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.user = null
          this.status = response.data.status
          localStorage.removeItem("auth_token")
          this.resumeStore.getAllCandidates()
          this.companyStore.getAllVacancy()
          this.router.push("/")
        })
        .catch((error) => {
          this.status = error.response.data.status
        })
    },

    setUser(form) {
      axios.defaults.withCredentials = false
      const token = localStorage.getItem("auth_token")

      axios
        .put(
          "http://localhost:8080/api/auth/edit/" + form.id,
          {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status.code === 200) {
            this.user = response.data.user
            this.getUser()
          }
          this.status = response.data.status
          this.router.push("/profile")
        })
        .catch((error) => {
          this.status = {
            code: 422,
            message: error.message,
          }
          this.router.push("/profile")
        })
    },

    forgotPasswordUser(form) {
      axios
        .post("http://localhost:8080/api/forgot-password", {
          email: form.email,
        })
        .then((response) => {
          this.status = response.data.status
        })
        .catch((error) => {
          this.status = error.response.data.status
        })
    },

    resetPasswordUser(form, token) {
      axios
        .post("http://localhost:8080/api/reset-password", {
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword,
          token: token,
        })
        .then((response) => {
          this.router.push("/login")
          this.status = response.data.status
        })
        .catch((error) => {
          this.status = error.response.data.status
        })
    },
  },
})
