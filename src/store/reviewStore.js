import { defineStore } from "pinia"
import { useResumeStore } from "./resumeStore"
import { useCompanyStore } from "./companyStore"
import axios from "axios"

export const useReviewStore = defineStore("review", {
  state: () => ({
    resumeStore: useResumeStore(),
    companyStore: useCompanyStore(),
  }),
  actions: {
    createReviewForVacancy(newReview) {
      const token = localStorage.getItem("auth_token")
      axios
        .post(
          "http://localhost:8080/api/create-review-vacancy",
          {
            vacancy_id: newReview.vacancy_id,
            message: newReview.message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.resumeStore.getSingVacancy(newReview.vacancy_id)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    createReviewForCandidate(newReview) {
      const token = localStorage.getItem("auth_token")

      axios
        .post(
          "http://localhost:8080/api/create-review-candidate",
          {
            candidate_id: newReview.candidate_id,
            message: newReview.message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.companyStore.getSingCandidate(newReview.candidate_id)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
