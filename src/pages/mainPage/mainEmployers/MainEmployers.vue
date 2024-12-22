<template>
  <div class="search-block">
    <div class="section-search">
      <el-input
        v-model="searchQuery"
        placeholder="Введите для поиска"
        clearable
        prefix-icon="el-icon-search"
        @clear="handleSearchClear"
        @input="handleSearchInput"
      ></el-input>
    </div>
  </div>

  <el-container>
    <div class="card-main">
      <el-card
        v-for="candidate in resumeStore.allCandidates"
        :key="candidate.id"
        class="vacancy-card"
        :body-style="{ padding: '20px' }"
      >
        <h1 class="title-card">{{ candidate.name }}</h1>
        <p class="category-card">{{ candidate.category }}</p>
        <p class="education-card">
          {{
            candidate.education === 1
              ? "Есть высшее образование"
              : "Нет высшего образования"
          }}
        </p>
        <p class="resume-card">{{ candidate.resume }}</p>

        <div class="info-card">
          <p class="date-card">{{ candidate.created_at }}</p>
          <router-link :to="'/sing-candidate/' + candidate.id">
            <el-button type="primary" size="small">Подробнее</el-button>
          </router-link>
        </div>
      </el-card>

      <div v-if="resumeStore.allCandidates.length === 0">
        <p>Кандидаты не найдены</p>
      </div>

      <el-pagination
        v-if="resumeStore.paginationMeta?.total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="resumeStore.paginationMeta?.total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <div class="aside">
      <div class="education-aside">
        <span>Образование</span>
        <el-radio-group v-model="education" @change="handleEducationChange">
          <el-radio :label="1">Есть высшее образование</el-radio>
          <el-radio :label="0">Нет высшего образования</el-radio>
        </el-radio-group>
      </div>

      <div class="category-aside">
        <el-select
          placeholder="Выберите категорию"
          v-model="selectedCategory"
          @change="handleCategoryChange"
        >
          <el-option value="all" label="Все категории" />
          <el-option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </div>

      <div class="sort-aside">
        <el-select
          v-model="selectedSortOrder"
          placeholder="Сортировка"
          @change="handleSortChange"
        >
          <el-option :value="null" label="Все" />
          <el-option label="Сначала старые" value="asc"></el-option>
          <el-option label="Сначала новые" value="desc"></el-option>
        </el-select>
      </div>
    </div>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useResumeStore } from "../../../store/resumeStore"
import { useCategoryStore } from "../../../store/categoryStore"
import { useRoute, useRouter } from "vue-router"

const resumeStore = useResumeStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()

const selectedCategory = ref(null)
const education = ref(null)
const selectedSortOrder = ref(null)
const searchQuery = ref("")
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const pageSize = ref(5)

function handleCategoryChange(value) {
  router.push({ query: { ...route.query, category: value } })
  getCandidates()
}

function handleEducationChange(value) {
  const queryParams = { ...route.query }
  if (value === null || value === undefined) {
    delete queryParams.education
  } else {
    queryParams.education = value
  }

  router.push({ query: queryParams })
  getCandidates()
}

function handleSortChange(value) {
  router.push({ query: { ...route.query, sort: value } })
  getCandidates()
}

function handleSearchInput(value) {
  router.push({ query: { ...route.query, search: value || undefined } })
  getCandidates()
}

function handleSearchClear() {
  searchQuery.value = ""
  router.push({ query: { ...route.query, search: undefined } })
  getCandidates()
}

function handlePageChange(page) {
  currentPage.value = page
  router.push({ query: { ...route.query, page } })
  getCandidates()
}

function getCandidates() {
  const params = {
    category: selectedCategory.value,
    education:
      education.value !== null ? education.value.toString() : undefined,
    sort: selectedSortOrder.value,
    search: searchQuery.value,
    page: currentPage.value,
    per_page: pageSize.value,
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v)
  )

  resumeStore.getAllCandidates(filteredParams)
}

onMounted(() => {
  categoryStore.getCategories()

  selectedCategory.value =
    route.query.category && route.query.category !== "all"
      ? parseInt(route.query.category)
      : null
  education.value = route.query.education
    ? parseInt(route.query.education)
    : null
  selectedSortOrder.value = route.query.sort || null
  searchQuery.value = route.query.search || ""
  currentPage.value = route.query.page ? parseInt(route.query.page) : 1

  getCandidates()
})
</script>

<style scoped>
.education-aside {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  padding: 20px;
}
.resume-card {
  font-weight: 500;
  opacity: 0.7;
}
.education-card {
  font-weight: 500;
}
.section-search {
  width: 70%;
}
.search-block {
  width: 1000px;
  margin: 0 auto;
  margin-top: 5rem;
}
.sort-aside {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  padding: 20px;
}
.category-aside {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  padding: 20px;
}
.candidate-aside {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  padding: 20px;
}
.el-container {
  width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 29%;
}
.category-card {
  font-weight: 500;
}
.info-card {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
.date-card {
  font-size: small;
  opacity: 0.6;
  font-weight: 500;
}
.description-card {
  margin-top: 10px;
  font-weight: 500;
  opacity: 0.7;
}
.title-card {
  margin: 0 0 10px 0;
}
.card-main {
  width: 70%;
}
.vacancy-card {
  margin: 20px 0;
}
</style>
