import { defineStore } from "pinia"
import { useCompanyStore } from "./companyStore"
import { useResumeStore } from "./resumeStore"
import axios from "axios"

export const useRatingStore = defineStore("rating", {
  state: () => ({
    companyStore: useCompanyStore(),
    resumeStore: useResumeStore(),
  }),
  actions: {
    createRatingForCandidate(rating, candidate_id) {
      const token = localStorage.getItem("auth_token")

      axios
        .post(
          "http://localhost:8080/api/create-rating-candidate",
          {
            rating: rating,
            candidate_id: candidate_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.companyStore.getSingCandidate(candidate_id)
        })
        .catch((error) => {
          this.companyStore.getSingCandidate(candidate_id)
          console.log(error)
        })
    },

    createRatingForVacancy(rating, vacancy_id) {
      const token = localStorage.getItem("auth_token")
      axios
        .post(
          "http://localhost:8080/api/create-rating-vacancy",
          {
            rating: rating,
            vacancy_id: Number(vacancy_id),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.resumeStore.getSingVacancy(vacancy_id)
        })
        .catch((error) => {
          this.resumeStore.getSingVacancy(vacancy_id)
          console.log(error)
        })
    },
  },
})
