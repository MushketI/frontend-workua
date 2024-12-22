<template>
  <div class="content">
    <el-container>
      <div class="main-card">
        <el-card v-if="companyStore.singCandidate">
          <div class="card-header">
            <h2>{{ companyStore.singCandidate.name }}</h2>
            <el-rate
              v-model="companyStore.singCandidate.rating"
              :max="5"
              @change="submitRating"
            />
          </div>

          <div class="card-details">
            <div class="description-card">
              <span>Resume:</span>
              {{ companyStore.singCandidate.resume }}
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque,
              nam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Autem ducimus necessitatibus alias, omnis impedit quod. Lorem
              ipsum dolor sit, amet consectetur adipisicing elit. Corporis
              praesentium labore veniam.
            </div>

            <div class="skills-section">
              <p>Навыки:</p>
              <div class="skills-card">
                <!-- Разделяем строку skills на массив -->
                <div
                  v-for="(skill, index) in skillsArray"
                  :key="index"
                  class="skills-teg"
                >
                  <el-tag type="info">{{ skill }}</el-tag>
                </div>
              </div>
            </div>

            <p class="category-card">
              Категория: {{ companyStore.singCandidate.category }}
            </p>
            <p class="phone-card">
              Телефон: {{ companyStore.singCandidate.phone }}
            </p>
          </div>

          <div class="card-actions">
            <!-- Здесь кнопка для отклика на вакансию -->
            <el-button type="primary" @click="getChat">Написать</el-button>
            <router-link to="/">
              <el-button>Назад</el-button>
            </router-link>
          </div>

          <!-- Секция отзывов -->
          <div class="reviews-section">
            <h3>Отзывы</h3>

            <!-- Проверка наличия отзывов -->
            <div
              v-if="companyStore.singCandidate.reviews.length === 0"
              class="no-reviews"
            >
              <p>Пока нет отзывов. Будьте первым, кто оставит отзыв!</p>
            </div>

            <!-- Отображение отзывов -->
            <div v-else>
              <div
                class="review"
                v-for="(review, index) in companyStore.singCandidate.reviews"
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
            <!-- Добавление отзыва -->
            <el-form @submit.prevent="submitReview" class="review-form">
              <el-form-item label="Ваш отзыв">
                <el-input
                  v-model="newReview"
                  type="textarea"
                  rows="4"
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
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCompanyStore } from "../../../../store/companyStore"
import { useReviewStore } from "../../../../store/reviewStore"
import { useRatingStore } from "../../../../store/ratingStore"

const companyStore = useCompanyStore()
const reviewStore = useReviewStore()
const ratingStore = useRatingStore()
const route = useRoute()
const router = useRouter()
const newReview = ref("")

const submitReview = () => {
  if (!newReview.value.trim()) {
    return console.log("Отзыв не может быть пустым!")
  }
  const review = {
    candidate_id: companyStore.singCandidate.id,
    message: newReview.value,
  }
  reviewStore.createReviewForCandidate(review)
  newReview.value = ""
}

const submitRating = (newRating) => {
  const id = route.params.id
  ratingStore.createRatingForCandidate(newRating, id)
}

const getChat = () => {
  // Переход на страницу чата с передачей данных через параметры URL
  router.push({
    name: "Chat",
    query: {
      receiverId: companyStore.singCandidate.user_id, // передаем ID кандидата
      receiverName: companyStore.singCandidate.name, // передаем имя кандидата
    },
  })
}

const skillsArray = computed(() => {
  return companyStore.singCandidate.skills
    ? companyStore.singCandidate.skills.split(",")
    : []
})

onMounted(() => {
  const id = route.params.id
  companyStore.getSingCandidate(id)
})
</script>

<style scoped>
.category-card {
  font-weight: 500;
}

.skills-section {
  margin-bottom: 10px;
}

.skills-card {
  display: flex;
  gap: 5px;
}

.skill-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.button-rewies {
  margin-left: 80%;
}

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

.view-review-date {
  font-weight: 400;
  font-size: small;
  opacity: 0.6;
}

.view-review {
  display: flex;
  justify-content: space-between;
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
