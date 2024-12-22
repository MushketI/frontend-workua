<template>
  <el-container style="height: 100vh; margin-top: 5rem">
    <el-main>
      <el-row justify="center" align="middle">
        <el-col :span="9">
          <el-card class="card" style="min-width: 500px">
            <div class="card-header">
              <h3>Создать компанию</h3>
            </div>

            <el-alert
              v-if="isModalActive && companyStore.status.code != 200"
              :title="companyStore.status.message"
              type="error"
              style="margin: 10px 0"
              show-icon
            />

            <el-form
              :model="form"
              ref="formRef"
              label-width="160px"
              @submit.prevent="submitForm"
            >
              <el-form-item
                label="Название компании"
                prop="name"
                :rules="nameRules"
              >
                <el-input v-model="form.name" placeholder="Название" />
              </el-form-item>

              <el-form-item
                label="Описание"
                prop="description"
                :rules="descriptionRules"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Описание"
                />
              </el-form-item>
              <el-form-item class="buttons">
                <el-button
                  class="create-button"
                  type="primary"
                  @click="submitForm"
                  >Создать компанию</el-button
                >
                <router-link to="/profile" style="margin-left: 10px">
                  <el-button class="back-button" type="info">Назад</el-button>
                </router-link>
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
import { useCompanyStore } from "../../../../store/companyStore"

const companyStore = useCompanyStore()
const isModalActive = ref(false)
const formRef = ref(null)

const form = ref({
  name: "",
  description: "",
})

const nameRules = [
  { required: true, message: "Введите название компании", trigger: "blur" },
  {
    max: 255,
    message: "Название не может превышать 255 символов",
    trigger: "blur",
  },
]

const descriptionRules = [
  { required: true, message: "Введите описание компании", trigger: "blur" },
  {
    max: 255,
    message: "Описание не может превышать 255 символов",
    trigger: "blur",
  },
]

const submitForm = async () => {
  if (!formRef.value) {
    return
  }

  const token = localStorage.getItem("auth_token")

  formRef.value.validate(async (valid) => {
    if (valid) {
      companyStore.createCompany(form, token)
      isModalActive.value = true
    } else {
      console.log("Ошибка в форме")
    }
  })
}
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 10px;
}
.card {
  padding: 20px;
}
.card-header {
  text-align: center;
  margin-bottom: 20px;
}
</style>
