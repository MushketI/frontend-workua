<template>
  <div class="content">
    <el-card class="profile-card" shadow="hover">
      <div class="profile-header">
        <h2 class="title">Создать резюме</h2>
        <el-alert
          v-if="resumeStore.status"
          :title="resumeStore.status.message"
          type="error"
          show-icon
          style="margin: 10px 0"
        />
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="160px">
        <el-form-item label="Резюме" prop="resume">
          <el-input
            type="textarea"
            v-model="form.resume"
            placeholder="Введите данные вашего резюме здесь..."
            rows="5"
          />
        </el-form-item>

        <el-form-item label="Категория" prop="category_id">
          <el-select
            v-model="form.category_id"
            placeholder="Выберите категорию"
          >
            <el-option
              v-for="(item, index) in categoryStore.categories"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Навыки" prop="skills">
          <el-select
            v-model="form.skills"
            multiple
            filterable
            placeholder="Выберите свои навыки"
          >
            <el-option
              v-for="skill in skillOptions"
              :key="skill"
              :label="skill"
              :value="skill"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Образование" prop="education">
          <el-select
            v-model="form.education"
            placeholder="Выберите свое образование"
          >
            <el-option
              v-for="option in educationOptions"
              :key="option.name"
              :label="option.name"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">Создать</el-button>
          <el-button @click="back">Назад</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCategoryStore } from "../../../../store/categoryStore"
import { useResumeStore } from "../../../../store/resumeStore"

const categoryStore = useCategoryStore()
const resumeStore = useResumeStore()
const formRef = ref(null)
const router = useRouter()

const form = ref({
  resume: "",
  skills: [],
  education: "",
  category_id: "",
})

const rules = ref({
  resume: [{ required: true, message: "Резюме обязательно", trigger: "blur" }],
  skills: [
    {
      required: true,
      message: "Выберите хотя бы один навык",
      trigger: "change",
    },
  ],
  education: [
    { required: true, message: "Образование обязательно", trigger: "change" },
  ],
  category_id: [
    { required: true, message: "Категория обязательна", trigger: "change" },
  ],
})

const skillOptions = [
  "Коммуникация",
  "Командная работа",
  "Креативность",
  "Организационные навыки",
  "Лидерство",
  "Аналитическое мышление",
  "Навыки продаж",
  "Переговоры",
  "Работа с клиентами",
  "Управление проектами",
  "Внимание к деталям",
]

const educationOptions = [
  { value: true, name: "Вышее образование" },
  { value: false, name: "Нет высшего образования" },
]

const back = () => {
  router.push("profile")
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const token = localStorage.getItem("auth_token")
      resumeStore.createCandidateInfo(form, token)
    } else {
      console.error("Form error")
    }
  })
}

onMounted(() => {
  categoryStore.getCategories()
})
</script>

<style scoped>
.title {
  margin: 10px auto;
}
.content {
  height: 100vh;
}
.el-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
