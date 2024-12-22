<template>
  <div class="content">
    <el-container>
      <el-card class="profile-card" shadow="hover">
        <h1 class="title">Редактирование пользователя</h1>
        <el-form :model="user" :rules="rules" ref="formRef" label-width="200px">
          <el-form-item label="ID">
            <el-input v-model="user.id" :disabled="true" />
          </el-form-item>
          <el-form-item label="Имя" prop="name">
            <el-input v-model="user.name" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="Пароль" prop="password">
            <el-input v-model="user.password" show-password type="password" />
          </el-form-item>
          <el-form-item label="Подтверждение пароля" prop="confirmPassword">
            <el-input
              v-model="user.confirmPassword"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm"
                >Сохранить</el-button
              >
              <el-button @click="resetForm">Сбросить</el-button>
              <el-button type="info" @click="goToProfile">Назад</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../../../store/authStore"

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)

const user = ref({
  id: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
})

onMounted(() => {
  const userData = authStore.user

  if (userData) {
    user.value = { ...userData }
  } else {
    console.error("User not found!")
  }
})

const rules = ref({
  name: [
    {
      required: true,
      message: "Пожалуйста, введите ваш name",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Минимум 6 символов",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Пожалуйста, введите ваш email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Введите корректный email",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      message: "Пожалуйста, введите ваш пароль",
      trigger: "blur",
    },
    {
      min: 8,
      message: "Пароль должен содержать хотя бы 8 символов",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      message: "Пожалуйста, подтвердите ваш пароль",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== user.value.password) {
          callback(new Error("Пароли не совпадают"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
})
const submitForm = () => {
  if (!formRef.value) {
    return
  }

  formRef.value.validate(async (valid) => {
    if (valid) {
      authStore.setUser(user.value)
    } else {
      console.log("Ошибка в форме")
    }
  })
}

const resetForm = () => {
  user.value = {
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
}

const goToProfile = () => {
  router.push("/profile")
}
</script>

<style>
.content {
  height: 100vh;
}
.router-link-button {
  display: inline-block;
}
.title {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.profile-card {
  width: 800px;
  margin: 0 auto;
  margin-top: 5rem;
}
</style>
