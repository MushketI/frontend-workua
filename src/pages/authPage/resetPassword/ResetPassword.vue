<template>
  <el-container>
    <el-main>
      <el-row justify="center" align="middle" style="height: 80%">
        <el-col :span="8">
          <el-card>
            <h2 class="form-title">Сброс пароля</h2>
            <el-form
              :model="form"
              :rules="rules"
              ref="formRef"
              label-width="200px"
              class="reset-password-form"
            >
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="Введите ваш email"
                />
              </el-form-item>

              <el-form-item label="Пароль" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="Введите новый пароль"
                  show-password
                />
              </el-form-item>

              <el-form-item label="Подтверждение пароля" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSubmit"
                  >Сменить пароль</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "../../../store/authStore"

const router = useRoute()
const authStore = useAuthStore()

const formRef = ref(null)

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
})

const token = router.params.token

const rules = {
  email: [
    {
      required: true,
      message: "Пожалуйста, введите ваш email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Некорректный формат email",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "Пожалуйста, введите новый пароль",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Пароль должен содержать минимум 6 символов",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Пожалуйста, подтвердите новый пароль",
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
}

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  formRef.value.validate(async (valid) => {
    if (valid) {
      authStore.resetPasswordUser(form.value)
    } else {
      console.log("Ошибка в форме")
    }
  })
}
</script>

<style scoped>
.el-container {
  margin-top: 5rem;
}
.form-title {
  text-align: center;
  padding: 10px;
}
.reset-password-form {
  margin: 0 auto;
}
</style>
