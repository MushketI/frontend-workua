<template>
  <div class="content">
    <el-card class="candidate-edit-card">
      <h2 class="title">Редактирование данных кандидата</h2>

      <el-alert
        v-if="resumeStore.status"
        :title="resumeStore.status.message"
        :type="resumeStore.status.code === 200 ? 'success' : 'error'"
        show-icon
        style="margin: 10px 0"
      />

      <el-form :model="form" :rules="rules" ref="formRef" label-width="160px">
        <el-form-item label="Резюме" prop="resume">
          <el-input
            v-model="form.resume"
            maxlength="1000"
            show-word-limit
            placeholder="Введите резюме"
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
            placeholder="Выберите навыки"
            :collapse-tags="true"
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
            placeholder="Выберите образование"
          >
            <el-option
              v-for="option in educationOptions"
              :key="option.value"
              :label="option.name"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">Сохранить</el-button>
          <router-link to="/profile" style="margin-left: 5px">
            <el-button type="info">Назад</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, toRaw, onBeforeUnmount } from "vue"
import { useResumeStore } from "../../../../store/resumeStore"
import { useCategoryStore } from "../../../../store/categoryStore"

const resumeStore = useResumeStore()
const categoryStore = useCategoryStore()
const formRef = ref(null)

const form = reactive({
  resume: "",
  category_id: null,
  skills: [],
  education: false,
})

const rules = {
  resume: [
    { required: true, message: "Поле 'Резюме' обязательно", trigger: "blur" },
    {
      max: 1000,
      message: "Резюме не должно превышать 1000 символов",
      trigger: "blur",
    },
  ],
  category_id: [
    { required: true, message: "Выберите категорию", trigger: "change" },
  ],
  skills: [
    {
      type: "array",
      required: true,
      message: "Выберите хотя бы один навык",
      trigger: "change",
    },
  ],
}

const educationOptions = [
  { value: true, name: "Есть вышее образование" },
  { value: false, name: "Нет высшего образования" },
]

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

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const token = localStorage.getItem("auth_token")
      resumeStore.updateCandidateInfo(form, token)
    } else {
      console.log("Form error")
    }
  })
}

onMounted(() => {
  const token = localStorage.getItem("auth_token")
  categoryStore.getCategories()
  resumeStore.getCandidateInfo(token)
})

onBeforeUnmount(() => {
  resumeStore.status = null
})

watch(
  () => resumeStore.resumeEdit,
  (newResume) => {
    const rawResume = toRaw(newResume)

    if (rawResume) {
      form.resume = newResume.resume
      form.category_id = newResume.category_id
      form.skills = Array.isArray(newResume.skills)
        ? newResume.skills.filter((skill) => skillOptions.includes(skill))
        : [newResume.skills]
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.title {
  margin: 10px auto;
  margin-bottom: 20px;
}
.content {
  height: 100vh;
}
.candidate-edit-card {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 5rem;
  padding: 20px;
}
</style>
