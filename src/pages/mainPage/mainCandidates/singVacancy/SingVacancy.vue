<template>
  <div class="content">
    <el-container>
      <div class="main-card">
        <el-card v-if="resumeStore.singVacancy">
          <div class="card-header">
            <h2>{{ resumeStore.singVacancy.name }}</h2>
            <el-rate
              v-model="resumeStore.singVacancy.rating"
              :max="5"
              @change="submitRating"
            />
          </div>

          <div class="card-details">
            <div class="description-card">
              <span>Описание:</span>
              {{ resumeStore.singVacancy.description }}
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque,
              nam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Autem ducimus necessitatibus alias, omnis impedit quod. Lorem
              ipsum dolor sit, amet consectetur adipisicing elit. Corporis
              praesentium labore veniam.
            </div>
            <p class="city-card">Город: {{ resumeStore.singVacancy.city }}</p>
            <p class="salary-card">
              Зарплата: {{ resumeStore.singVacancy.salary_min }} -
              {{ resumeStore.singVacancy.salary_max }} грн
            </p>
            <p class="phone-card">
              Телефон: {{ resumeStore.singVacancy.phone }}
            </p>
          </div>

          <div class="card-actions">
            <el-button type="primary" @click="getChat">Написать</el-button>
            <router-link to="/">
              <el-button>Назад</el-button>
            </router-link>
          </div>

          <div class="reviews-section">
            <h3>Отзывы</h3>
            <div
              v-if="resumeStore.singVacancy.reviews.length === 0"
              class="no-reviews"
            >
              <p>Пока нет отзывов. Будьте первым, кто оставит отзыв!</p>
            </div>

            <div v-else>
              <div
                class="review"
                v-for="(review, index) in resumeStore.singVacancy.reviews"
                :key="index"
              >
                <div class="view-review">
                  <div>
                    <strong>{{ review.user_name }}:</strong>
                    {{ review.message }}
                  </div>
                  <div class="view-review-date">{{ review.created_at }}</div>
                </div>
              </div>
            </div>

            <el-form @submit.prevent="submitReview" class="review-form">
              <el-form-item label="Ваш отзыв">
                <el-input
                  v-model="newReview"
                  type="textarea"
                  :rows="4"
                  placeholder="Напишите ваш отзыв о вакансии..."
                ></el-input>
              </el-form-item>
              <el-form-item class="button-rewies">
                <el-button type="primary" @click="submitReview"
                  >Отправить отзыв</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useResumeStore } from "../../../../store/resumeStore"
import { useRoute, useRouter } from "vue-router"
import { useReviewStore } from "../../../../store/reviewStore"
import { useRatingStore } from "../../../../store/ratingStore"

const resumeStore = useResumeStore()
const reviewStore = useReviewStore()
const ratingStore = useRatingStore()
const route = useRoute()
const router = useRouter()
const newReview = ref("")

const getChat = () => {
  router.push({
    name: "Chat",
    query: {
      receiverId: resumeStore.singVacancy.author_id, // передаем ID автора
      receiverName: resumeStore.singVacancy.author, // передаем имя автора
    },
  })
}

const submitRating = (newRating) => {
  const id = route.params.id
  ratingStore.createRatingForVacancy(newRating, id)
}

const submitReview = () => {
  if (!newReview.value.trim()) {
    return console.error("Отзыв не может быть пустым!")
  }

  const review = {
    vacancy_id: resumeStore.singVacancy.id,
    message: newReview.value,
  }

  reviewStore.createReviewForVacancy(review)
  newReview.value = ""
}

onMounted(() => {
  const id = route.params.id
  resumeStore.getSingVacancy(id)
})
</script>

<style scoped>
.view-review-date {
  font-weight: 400;
  font-size: small;
  opacity: 0.6;
}
.view-review {
  display: flex;
  justify-content: space-between;
}
.review-form {
  margin-top: 10px;
}
.no-reviews {
  margin-top: 20px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
  color: #909399;
}
.button-rewies {
  margin-left: 80%;
}
.reviews-section {
  margin-top: 30px;
  border-top: 1px solid #dcdfe6;
  padding-top: 20px;
}
.reviews-section h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.review {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
.review p {
  margin: 0;
}
.phone-card {
  font-weight: 500;
}
.salary-card {
  font-weight: 500;
}
.city-card {
  font-weight: 500;
}
.description-card {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  height: 100px;
  margin: 20px 0;
}
.el-card {
  width: 100%;
  margin: 0 auto;
}
.main-card {
  width: 80%;
  margin: 0 auto;
}
.el-container {
  width: 1000px;
  margin: 0 auto;
  margin-top: 5rem;
}
.content {
  min-height: 100vh;
}
.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
}
.card-details {
  margin-top: 10px;
}
.card-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
