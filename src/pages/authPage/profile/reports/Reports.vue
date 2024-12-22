<template>
  <div class="content">
    <el-container>
      <el-card>
        <el-alert
          v-if="notification"
          title="Отчет готов"
          type="success"
          description="Отчет успешно сгенерирован!"
          :closable="false"
        />
        <div class="card-create-repord">
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="Выберите дату начала"
            format="yyyy-MM-dd"
          />

          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="Выберите дату окончания"
            format="yyyy-MM-dd"
          />

          <el-button @click="createReport">Запросить отчет</el-button>
          <router-link to="/profile">
            <el-button type="info">Назад</el-button>
          </router-link>
        </div>

        <el-table :data="reports">
          <el-table-column
            label="Название отчета"
            prop="name"
          ></el-table-column>

          <el-table-column label="Дата создания" prop="created_at">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>

          <el-table-column label="Статус" prop="status">
            <template #default="{ row }">
              <span :class="statusClass(row.status)">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Скачать отчет">
            <template #default="{ row }">
              <a :href="getDownloadLink(row.file_path)" target="_blank"
                >Скачать</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useNotificationStore } from "../../../../store/notificationStore"
import { useRouter } from "vue-router"
import Pusher from "pusher-js"
import axios from "axios"

const notificationStore = useNotificationStore()
const router = useRouter()
const notification = ref(null)
const startDate = ref("")
const reportId = ref(null)
const endDate = ref("")
const reports = ref([])

const getReports = () => {
  const token = localStorage.getItem("auth_token")
  axios
    .get("http://localhost:8080/api/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      reports.value = response.data
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error)
    })
}

const createReport = () => {
  if (startDate.value && endDate.value) {
    const token = localStorage.getItem("auth_token")

    axios
      .post(
        "http://localhost:8080/api/reports",
        {
          name: "My report",
          start_date: startDate.value,
          end_date: endDate.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        reportId.value = response.data.report.id

        if (reportId.value) {
          Pusher.logToConsole = true

          const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          })

          const channel = pusher.subscribe("report." + reportId.value)

          channel.bind("App\\Events\\ReportGenerated", (data) => {
            notification.value = "Отчет готов: " + data.file_path

            notificationStore.addNotification({
              id: response.data.report.id,
              message: "Отчет готов",
            })

            notificationStore.setNotification(true)
            getReports()
          })
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error)
      })
  } else {
    alert("Пожалуйста, выберите обе даты")
  }
  router.push("/")
}

const getDownloadLink = (filePath) => {
  return `http://localhost:8080/storage/${filePath}`
}

const statusClass = (status) => {
  switch (status) {
    case "completed":
      return "Cтатус завершено"
    case "pending":
      return "Cтатус ожидание"
    case "in_progress":
      return "Cтатус в процессе"
    case "failed":
      return "Cтатус неудачно"
    default:
      return ""
  }
}

const formatDate = (date) => {
  const formattedDate = new Date(date)
  return formattedDate.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

onMounted(() => {
  getReports()
})
</script>

<style scoped>
.card-create-repord {
  display: flex;
  gap: 10px;
  padding: 10px;
}
.el-card {
  width: 100%;
}
.el-container {
  width: 1200px;
  margin: 0 auto;
  margin-top: 5rem;
}
.content {
  height: 100vh;
}
.status-completed {
  color: green;
}
.status-pending {
  color: orange;
}
.status-in-progress {
  color: blue;
}
.status-failed {
  color: red;
}
</style>
