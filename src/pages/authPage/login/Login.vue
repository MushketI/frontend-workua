<template>
  <el-container style="min-height: 100vh">
    <el-main>
      <el-row justify="center" align="middle" style="height: 80%">
        <el-col :span="8">
          <el-card>
            <h2 class="form-title">Вход</h2>

            <el-alert
              v-if="isModalActive && authStore.status.code != 200"
              :title="authStore.status.message"
              type="error"
              show-icon
            />

            <el-form
              :model="form"
              ref="formRef"
              label-width="150px"
              :rules="rules"
            >
              <el-form-item label="Email" prop="email">
                <el-input
                  name="email"
                  v-model="form.email"
                  placeholder="Введите ваш email"
                />
              </el-form-item>

              <el-form-item label="Пароль" prop="password">
                <el-input
                  name="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Введите ваш пароль"
                />
              </el-form-item>

              <!-- Забыли пароль -->
              <el-form-item>
                <div class="forgot-password">
                  <router-link to="/forgot-password">
                    <el-button type="text" class="forgot-password-button">
                      Забыли пароль?
                    </el-button>
                  </router-link>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSubmit"
                  >Войти</el-button
                >
              </el-form-item>
            </el-form>

            <div class="register-link">
              <span>
                Нет аккаунта?
                <router-link to="/register">
                  <el-button type="text" class="register-button">
                    Зарегистрироваться
                  </el-button>
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
import { ref, onMounted } from "vue"
import { useAuthStore } from "../../../store/authStore"

const authStore = useAuthStore()

const formRef = ref(null)
const isModalActive = ref(false)

const form = ref({
  email: "poshukach@asd.asd",
  password: "asdasdasd",
})

const rules = ref({
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
})

onMounted(() => {
  if (authStore.status) {
    authStore.status = null
  }
})

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  formRef.value.validate(async (valid) => {
    if (valid) {
      authStore.login(form)
      isModalActive.value = true
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
.register-link {
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
