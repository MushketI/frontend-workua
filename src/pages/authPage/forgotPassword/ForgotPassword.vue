<template>
  <el-container>
    <el-main class="main">
      <el-row justify="center" align="middle" style="height: 100%">
        <el-col :span="8">
          <el-card>
            <h2 class="form-title">Забыли пароль?</h2>

            <el-alert
              v-if="authStore.status"
              :title="authStore.status.message"
              :type="authStore.status.code === 200 ? 'success' : 'error'"
              show-icon
            />

            <el-form
              :model="form"
              ref="formRef"
              label-width="120px"
              :rules="rules"
              @submit.prevent="handleSubmit"
            >
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="Введите ваш email"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="w-full"
                  :loading="isLoading"
                  @click="handleSubmit"
                >
                  Отправить письмо для сброса пароля
                </el-button>
              </el-form-item>
            </el-form>

            <div class="register-link text-center">
              <span>Вспомнили пароль? </span>
              <router-link to="/login">
                <el-button type="text">Войти</el-button>
              </router-link>
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
  email: "",
})

const rules = ref({
  email: [
    {
      required: true,
      message: "Пожалуйста, введите Bаш email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Введите правильный email",
      trigger: ["blur", "change"],
    },
  ],
})

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  formRef.value.validate(async (valid) => {
    if (valid) {
      authStore.forgotPasswordUser(form.value)
    } else {
      console.log("Form error")
    }
  })
}
</script>

<style scoped>
.main {
  margin-top: 5rem;
}
.el-form {
  margin-top: 10px;
}
.form-title {
  margin-bottom: 20px;
  text-align: center;
}
.register-link {
  margin-top: 10px;
  text-align: center;
}
</style>
