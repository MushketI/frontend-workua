<template>
  <div class="content">
    <el-card>
      <div class="card-header">
        <h3 class="card-title">Загрузка аватара</h3>
      </div>
      <el-form
        label-position="top"
        label-width="100px"
        class="avatar-upload-form"
      >
        <el-upload
          class="avatar-uploader"
          drag
          action=""
          :show-file-list="false"
          :limit="1"
          :auto-upload="false"
          @change="onFileChange"
          accept="image/*"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Добавьте файл</div>
        </el-upload>

        <el-button
          type="primary"
          @click="submitForm"
          :disabled="!selectedFile"
          class="submit-button"
        >
          Загрузить аватар
        </el-button>

        <div class="block-back">
          <router-link to="/profile">
            <el-button class="button-back" type="info">Назад</el-button>
          </router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../../../store/authStore"
import axios from "axios"

const authStore = useAuthStore()
const router = useRouter()
const selectedFile = ref(null)

const onFileChange = (file) => {
  selectedFile.value = file.raw
}

const submitForm = () => {
  if (!selectedFile.value) {
    alert("Пожалуйста, выберите файл для загрузки")
    return
  }

  const formData = new FormData()
  formData.append("image", selectedFile.value)

  const token = localStorage.getItem("auth_token")

  axios
    .post("http://localhost:8080/api/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      authStore.getUser()
      router.push("/profile")
      selectedFile.value = null
    })
    .catch(() => {
      alert("Ошибка при загрузке аватара")
    })
}
</script>

<style scoped>
.block-back {
  display: flex;
  justify-content: end;
  margin-top: 10px;
}

.card-header {
  margin-bottom: 15px;
}

.card-title {
  text-align: center;
  padding: 10px;
}

.el-card {
  width: 600px;
  margin: 0 auto;
  margin-top: 5rem;
}

.content {
  height: 100vh;
}

.avatar-upload-form {
  max-width: 300px;
  margin: 0 auto;
}

.avatar-uploader {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.submit-button {
  margin-top: 10px;
  width: 100%;
}
</style>
