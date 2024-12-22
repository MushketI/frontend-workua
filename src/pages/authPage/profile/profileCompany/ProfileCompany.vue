<template>
  <div class="content">
    <el-card class="profile-card" shadow="hover">
      <div class="profile-header">
        <h3>Профиль компании</h3>
        <el-alert
          v-if="isModalActive && companyStore.status"
          :title="companyStore.status.message"
          :type="statusType"
          style="margin: 10px 0px"
          show-icon
        />
      </div>
      <div class="profile-content">
        <router-link to="/create-vacancy">
          <el-button>Добавить вакансию</el-button>
        </router-link>

        <router-link to="/profile" style="margin-left: 5px">
          <el-button type="info">Назад</el-button>
        </router-link>

        <el-table
          :data="companyStore.vacancies"
          style="width: 100%; margin-top: 10px"
          border
        >
          <el-table-column
            prop="name"
            label="Название вакансии"
            width="130"
          ></el-table-column>

          <el-table-column
            prop="location_name"
            label="Город"
            width="150"
          ></el-table-column>

          <el-table-column prop="salary" label="Зарплата" width="115">
            <template v-slot="scope">
              <span>{{ scope.row.salary[0] }} - {{ scope.row.salary[1] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="category_name"
            label="Категория"
            width="150"
          ></el-table-column>

          <el-table-column prop="average_rating" label="Рейтинг" width="145">
            <template v-slot="scope">
              <el-rate
                v-model="scope.row.average_rating"
                disabled
                :value="scope.row.average_rating"
                :max="5"
              >
              </el-rate>
            </template>
          </el-table-column>

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
                  @click="getEditVacancy(row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>

                <el-button
                  size="small"
                  type="warning"
                  @click="deleteVacancy(row)"
                >
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
                <el-button
                  size="small"
                  :type="row.isActive ? 'success' : 'danger'"
                  @click="toggleVacancyStatus(row)"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue"
import { Edit, Delete, View } from "@element-plus/icons-vue"
import { useCompanyStore } from "../../../../store/companyStore"
import { useRouter } from "vue-router"

const companyStore = useCompanyStore()
const router = useRouter()
const isModalActive = ref(false)

const getEditVacancy = (row) => {
  router.push({ name: "editVacancy", params: { id: row.id } })
}

const toggleVacancyStatus = (row) => {
  const token = localStorage.getItem("auth_token")
  companyStore.toggleStatusVacancy(row.id, token)
  isModalActive.value = true
}

const deleteVacancy = async (row) => {
  const token = localStorage.getItem("auth_token")
  companyStore.deleteVacancy(row.id, token)
  isModalActive.value = true
}

const statusType = computed(() => {
  if (companyStore.status.code === 200) {
    return "success"
  } else {
    return "error"
  }
})

onMounted(() => {
  if (companyStore.status) {
    isModalActive.value = true
  }

  const token = localStorage.getItem("auth_token")
  companyStore.getCompanyVacancy(token)
})

watch(
  () => isModalActive.value,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        companyStore.status = null
        isModalActive.value = false
      }, 3000)
    }
  }
)
</script>

<style scoped>
.actions-container {
  display: flex;
}
.profile-header {
  min-height: 50px;
}

.profile-card {
  width: 1000px;
}

.content {
  height: 100vh;
}
</style>
