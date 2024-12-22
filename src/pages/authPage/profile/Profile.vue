<template>
  <div class="content">
    <el-card class="profile-card" shadow="hover" v-if="authStore.user">
      <div class="profile-header">
        <div class="section-avatar">
          <el-avatar size="large" :src="avatarUrl" />
        </div>

        <div class="section-info">
          <h2 v-if="authStore.user">{{ authStore.user.name }}</h2>
          <p v-if="authStore.user" class="info-role">
            {{ authStore.user.role.description }}
          </p>
        </div>
      </div>
      <el-alert
        v-if="isModalActive"
        :title="authStore.status.message"
        :type="statusType"
        show-icon
      />
      <div class="profile-details">
        <div class="edit-button">
          <router-link :to="'/edit/user/' + authStore.user.id">
            <el-button>Информация</el-button>
          </router-link>

          <router-link to="/create-resume" v-if="authStore.user.role_id === 1">
            <el-button>Создать резюме</el-button>
          </router-link>

          <router-link to="/create-avatar">
            <el-button>Добавить аватар</el-button>
          </router-link>

          <router-link to="/chats">
            <el-button>Чаты</el-button>
          </router-link>

          <router-link
            v-if="
              (!companyStore.company || companyStore.company.length === 0) &&
              authStore.user.role_id === 2
            "
            to="/create-company"
          >
            <el-button>Создать компанию</el-button>
          </router-link>
        </div>

        <!-- таблица для отображения роботодателя -->
        <el-table
          v-if="authStore.user.role_id === 2"
          :data="companyStore.company"
          style="width: 100%; margin-top: 10px"
          border
        >
          <el-table-column
            prop="name"
            label="Название компании"
            width="250"
          ></el-table-column>

          <el-table-column
            prop="description"
            label="Описание"
            width="200"
          ></el-table-column>

          <el-table-column label="Действия">
            <template #default="{ row }">
              <div class="actions-container">
                <router-link to="/profile-company">
                  <el-button size="small" type="primary">Профиль</el-button>
                </router-link>
                <router-link
                  to="/reports"
                  v-if="settingStore.report.is_active === 1"
                >
                  <el-button size="small" type="success">Отчет</el-button>
                </router-link>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteCompany(row)"
                >
                  Удалить
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Таблица для отображения кандидата -->
      <el-table
        v-if="authStore.user.role_id === 1"
        :data="resumeStore.resume"
        style="width: 100%; margin-top: 10px"
        border
      >
        <el-table-column label="Категория" prop="category_name" width="150" />
        <el-table-column label="Навыки" prop="skills" width="220" />
        <el-table-column
          label="Образование"
          prop="education"
          :formatter="
            (row, column, cellValue, index) =>
              cellValue === 1 ? 'Вышее образование' : ''
          "
          width="120"
        />
        <el-table-column label="Статус" width="110">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? "Активна" : "Неактивна" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Действия" width="158">
          <template #default="{ row }">
            <div class="actions-container">
              <el-button
                size="small"
                type="primary"
                @click="getEditResume(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>

              <el-button size="small" type="warning" @click="deleteResume(row)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
              <el-button
                size="small"
                :type="row.isActive ? 'success' : 'danger'"
                @click="toggleResumeStatus(row)"
              >
                <el-icon><View /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { Delete, Edit, View } from "@element-plus/icons-vue"
import { useAuthStore } from "../../../store/authStore"
import { useCompanyStore } from "../../../store/companyStore"
import { useResumeStore } from "../../../store/resumeStore"
import { useSettingStore } from "../../../store/settingStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const companyStore = useCompanyStore()
const resumeStore = useResumeStore()
const settingStore = useSettingStore()
const isModalActive = ref(false)
const router = useRouter()

const avatarUrl = computed(() => {
  if (authStore.user.image) {
    return authStore.user.image
  } else {
    return "https://via.placeholder.com/150"
  }
})

const statusType = computed(() => {
  if (authStore.status.code === 200) {
    return "success"
  } else {
    return "error"
  }
})

const toggleResumeStatus = () => {
  const token = localStorage.getItem("auth_token")
  resumeStore.toggleResumeActive(token)
}

const deleteResume = () => {
  const token = localStorage.getItem("auth_token")
  resumeStore.clearResumeInfo(token)
}

const deleteCompany = (row) => {
  const token = localStorage.getItem("auth_token")
  companyStore.deleteCompany(row.id, token)
}

const getEditResume = (row) => {
  router.push("/edit-resume")
}

onMounted(async () => {
  if (authStore.status) {
    isModalActive.value = true
  }

  const token = localStorage.getItem("auth_token")
  companyStore.getUserCompany(token)
  resumeStore.getCandidateInfo(token)
  settingStore.getSettingReport()
})

onBeforeUnmount(() => {
  // if (authStore.user.role_id != 2) {
  //   companyStore.clearCompany()
  // }
  companyStore.clearCompany()
})

watch(
  () => isModalActive.value,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        authStore.status = null
        isModalActive.value = false
      }, 5000)
    }
  }
)
</script>

<style scoped>
.actions-container {
  display: flex;
  gap: 10px;
}
.content {
  height: 100vh;
}
.el-table .el-button {
  margin-right: 5px;
}
.el-table .el-button:last-child {
  margin-right: 0;
}
.edit-button {
  display: flex;
  gap: 10px;
}
.el-button {
  margin: 10px 0;
}
.el-avatar {
  width: 150px;
  height: 150px;
}
.profile-card {
  max-width: 800px;
  margin: auto;
  margin-top: 5%;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  text-align: end;
  margin-bottom: 20px;
  padding: 10px;
}
.section-avatar {
  display: flex;
  justify-content: start;
  width: 50%;
}
.section-info {
  width: 50%;
  padding: 0 20px 0 0;
  font-weight: 500;
}
.section-info h2 {
  font-weight: 400;
}
.profile-header h3 {
  margin: 0px 0;
}
.info-role {
  opacity: 70%;
}
.profile-details {
  margin-top: 20px;
}
</style>
