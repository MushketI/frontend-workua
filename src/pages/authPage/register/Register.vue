<template>
  <el-container style="min-height: 100vh">
    <el-main>
      <el-row justify="center" align="middle" style="height: 80%">
        <el-col :span="9">
          <el-card>
            <h2 class="form-title">Регистрация</h2>

            <el-alert
              v-if="authStore.status && authStore.status.code === 422"
              :title="authStore.status.message"
              type="error"
              show-icon
            />

            <el-form
              :model="form"
              ref="formRef"
              label-width="160px"
              :rules="rules"
            >
              <el-form-item label="Имя" prop="name">
                <el-input v-model="form.name" placeholder="Введите ваше имя" />
              </el-form-item>

              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="Введите ваш email"
                />
              </el-form-item>

              <el-form-item label="Номер телефона" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="Введите номер телефона"
                  maxlength="9"
                  clearable
                >
                  <template #prepend>+380</template>
                </el-input>
              </el-form-item>

              <el-form-item label="Пароль" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="Введите ваш пароль"
                />
              </el-form-item>

              <el-form-item label="Подтвердите пароль" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Подтвердите ваш пароль"
                />
              </el-form-item>

              <el-form-item label="Выберите роль" prop="role_id">
                <el-select v-model="form.role_id" placeholder="Выберите">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSubmit"
                  >Зарегистрироваться</el-button
                >
              </el-form-item>
            </el-form>

            <div class="login-link">
              <span>
                Уже есть аккаунт?
                <router-link to="/login">
                  <el-button type="text">Войти</el-button>
                </router-link>
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "../../../store/authStore"

const authStore = useAuthStore()
const formRef = ref(null)

const form = ref({
  name: "",
  email: "",
  phone: "",
  role_id: "",
  password: "",
  confirmPassword: "",
})

const options = ref([
  { value: 1, label: "Поиск работы" },
  { value: 2, label: "Поиск сотрудников" },
])

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
      required: true,
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
      required: true,
      message: "Пожалуйста, подтвердите ваш пароль",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error("Пароли не совпадают"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
  role_id: [
    {
      required: true,
      message: "Пожалуйста, выберите роль",
      trigger: "blur",
    },
  ],
})

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  formRef.value.validate(async (valid) => {
    if (valid) {
      authStore.register(form)
    } else {
      console.log("Form error")
    }
  })
}
</script>

<style scoped>
.el-card {
  padding: 20px;
}
.el-form {
  padding: 10px;
}
.form-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}
.login-link {
  text-align: center;
  margin-top: 20px;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-col {
  margin-right: 10px;
}
</style>
