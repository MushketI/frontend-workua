<template>
  <el-container style="height: 100vh; margin-top: 5rem">
    <el-main>
      <el-row justify="center" align="middle">
        <el-col :span="9">
          <el-card class="card" style="min-width: 500px">
            <div class="card-header">
              <h3>Создать вакансию</h3>
            </div>
            <div class="card-create">
              <el-form
                :model="form"
                :rules="rules"
                ref="formRef"
                label-width="160px"
              >
                <el-form-item label="Название вакансии" prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="Введите название вакансии"
                  />
                </el-form-item>
                <el-form-item label="Выбор занятости" prop="employmentTypes">
                  <el-select
                    placeholder="Выберите вариант"
                    collapse-tags
                    v-model="form.employmentTypes"
                  >
                    <el-option label="Полная занятость" :value="1" />
                    <el-option label="Неполная занятость" :value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Категория" prop="category_id">
                  <el-select
                    placeholder="Выберите категорию"
                    collapse-tags
                    v-model="form.category_id"
                  >
                    <el-option
                      v-for="(item, index) in categoryStore.categories"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Ваш город" prop="city">
                  <el-autocomplete
                    v-model="selectCity"
                    :fetch-suggestions="querySearch"
                    placeholder="Введите название города"
                    @select="handleSelect"
                  />
                </el-form-item>
                <el-form-item label="Зарплата" prop="salary">
                  <el-slider
                    v-model="form.salary"
                    :min="0"
                    :max="200000"
                    range
                    :step="1000"
                    :format-tooltip="formatTooltip"
                  />
                  <p v-if="form.salary[0] > 0">
                    Выбранный диапазон зарплат: {{ form.salary[0] }} -
                    {{ form.salary[1] }} грн
                  </p>
                </el-form-item>
                <el-form-item label="Описание вакансии" prop="description">
                  <el-input
                    v-model="form.description"
                    type="textarea"
                    placeholder="Введите описание вакансии"
                    :rows="5"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSubmit"
                    >Создать</el-button
                  >
                  <router-link to="/profile-company" style="margin-left: 10px">
                    <el-button class="back-button" type="info">Назад</el-button>
                  </router-link>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useCityStore } from "../../../../store/cityStore"
import { useCategoryStore } from "../../../../store/categoryStore"
import { useCompanyStore } from "../../../../store/companyStore"

const cityStore = useCityStore()
const categoryStore = useCategoryStore()
const companyStore = useCompanyStore()
const selectCity = ref("")
const formRef = ref(null)

const form = ref({
  name: "",
  employmentTypes: "",
  category_id: "",
  city: "",
  salary: [0, 0],
  description: "description",
})

const rules = ref({
  name: [
    {
      required: true,
      message: "Название вакансии обязательно",
      trigger: "blur",
    },
    { min: 3, max: 50, message: "Длина от 3 до 50 символов", trigger: "blur" },
  ],
  employmentTypes: [
    { required: true, message: "Выберите тип занятости", trigger: "change" },
  ],
  category_id: [
    { required: true, message: "Выберите категорию", trigger: "change" },
  ],
  city: [{ required: true, message: "Выберите город", trigger: "change" }],
  salary: [
    { required: true, message: "Укажите диапазон зарплаты", trigger: "change" },
  ],
  description: [
    { required: true, message: "Описание обязательно", trigger: "blur" },
    {
      min: 10,
      max: 500,
      message: "Длина от 10 до 500 символов",
      trigger: "blur",
    },
  ],
})

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const token = localStorage.getItem("auth_token")
      companyStore.createVacancy(form, token)
    } else {
      console.log("Ошибка валидации формы")
    }
  })
}

const querySearch = (queryString, cb) => {
  const formattedResults = cityStore.cities
    .filter((city) =>
      city.name.toLowerCase().includes(queryString.toLowerCase())
    )
    .map((city) => ({
      value: city.name,
      id: city.id,
    }))
  cb(formattedResults)
}

const handleSelect = (city) => {
  selectCity.value = city.value
  form.value.city = city.id
}

const formatTooltip = (value) => {
  return `${value} грн`
}

onMounted(() => {
  cityStore.getCity()
  categoryStore.getCategories()
})
</script>

<style scoped>
.card {
  padding: 20px;
}
.card-header {
  text-align: center;
  margin-bottom: 20px;
}
.card-create {
  margin-top: 20px;
}
</style>
