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
        v-for="vacancy in companyStore.allVacancy"
        :key="vacancy.id"
        class="vacancy-card"
        :body-style="{ padding: '20px' }"
      >
        <h1 class="title-card">{{ vacancy.name }}</h1>
        <p class="salary-card">
          {{ vacancy.salary_min }} - {{ vacancy.salary_max }} грн
        </p>
        <p class="category-card">{{ vacancy.category }}</p>
        <p class="company-card">
          {{ vacancy.company_name }}, {{ vacancy.city }}
        </p>

        <p class="description-card">{{ vacancy.description }}</p>
        <div class="info-card">
          <p class="date-card">{{ vacancy.created_at }}</p>
          <router-link :to="'/sing-vacancy/' + vacancy.id">
            <el-button type="primary" size="small">Подробнее</el-button>
          </router-link>
        </div>
      </el-card>

      <div v-if="companyStore.allVacancy.length === 0">
        <p>Вакансии не найдены</p>
      </div>

      <el-pagination
        v-if="companyStore.paginationMeta?.total > 0"
        :current-page="companyStore.paginationMeta?.current_page"
        :page-size="pageSize"
        :total="companyStore.paginationMeta?.total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
    <div class="aside">
      <div class="employment-aside">
        <span>Bид зайнятости</span>
        <el-radio-group
          :value="selectedEmploymentTypes"
          @change="handleEmploymentChange"
        >
          <el-radio :label="1" :checked="selectedEmploymentTypes === 1"
            >Полная</el-radio
          >
          <el-radio :label="2" :checked="selectedEmploymentTypes === 2"
            >Не полная</el-radio
          >
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
      <div class="city-aside">
        <el-select
          placeholder="Выберите город"
          v-model="selectedCity"
          @change="handleCityChange"
        >
          <el-option :value="null" label="Все города" />
          <el-option
            v-for="city in cityStore.cities"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          ></el-option>
        </el-select>
      </div>
      <div class="sort-aside">
        <el-select
          v-model="selectedSortOrder"
          placeholder="Сортировка"
          @change="handleSortChange"
        >
          <el-option :value="null" label="Bсе" />
          <el-option label="Сначала старые" value="asc"></el-option>
          <el-option label="Сначала новые" value="desc"></el-option>
        </el-select>
      </div>
    </div>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useCompanyStore } from "../../../store/companyStore"
import { useCategoryStore } from "../../../store/categoryStore"
import { useCityStore } from "../../../store/cityStore"
import { useRoute, useRouter } from "vue-router"

const companyStore = useCompanyStore()
const categoryStore = useCategoryStore()
const cityStore = useCityStore()
const router = useRouter()
const route = useRoute()

const selectedCategory = ref(null)
const selectedCity = ref(null)
const selectedEmploymentTypes = ref(null)
const selectedSortOrder = ref(null)
const searchQuery = ref("")
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const pageSize = ref(5)

function handleCategoryChange(value) {
  router.push({ query: { ...route.query, category: value } })
  fetchVacancies()
}

function handleCityChange(value) {
  router.push({ query: { ...route.query, city: value } })
  fetchVacancies()
}

function handleEmploymentChange(value) {
  if (selectedEmploymentTypes.value === value) {
    selectedEmploymentTypes.value = null
    router.push({ query: { ...route.query, employment: undefined } })
  } else {
    selectedEmploymentTypes.value = value
    router.push({ query: { ...route.query, employment: value } })
  }
  fetchVacancies()
}

function handleSortChange(value) {
  router.push({
    query: { ...route.query, sort: value },
  })
  fetchVacancies()
}

function handleSearchInput(value) {
  router.push({ query: { ...route.query, search: value || undefined } })
  fetchVacancies()
}

function handleSearchClear() {
  searchQuery.value = ""
  router.push({ query: { ...route.query, search: undefined } })
  fetchVacancies()
}

function handlePageChange(page) {
  currentPage.value = page
  router.push({ query: { ...route.query, page } })
  fetchVacancies()
}

function fetchVacancies() {
  const params = {
    category: selectedCategory.value,
    city: selectedCity.value,
    employment: selectedEmploymentTypes.value,
    sort: selectedSortOrder.value,
    search: searchQuery.value,
    page: currentPage.value,
    per_page: pageSize.value,
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v)
  )
  companyStore.getAllVacancy(filteredParams)
}

onMounted(() => {
  categoryStore.getCategories()
  cityStore.getCity()

  selectedCategory.value =
    route.query.category && route.query.category != "all"
      ? parseInt(route.query.category)
      : null
  selectedCity.value = route.query.city ? parseInt(route.query.city) : null
  selectedEmploymentTypes.value = route.query.employment
    ? parseInt(route.query.employment, 10)
    : null
  selectedSortOrder.value = route.query.sort ? route.query.sort : null
  searchQuery.value = route.query.search || ""
  currentPage.value = route.query.page ? parseInt(route.query.page) : 1

  companyStore.getAllVacancy()

  fetchVacancies()
})
</script>

<style scoped>
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
.city-aside {
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
.employment-aside {
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
.company-card {
  font-weight: 500;
  opacity: 0.8;
}
.salary-card {
  font-weight: 500;
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
