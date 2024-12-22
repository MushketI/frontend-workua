<template>
  <div class="content">
    <el-container>
      <el-card>
        <div class="card-header">
          <h3 class="card-title">
            {{ receiverName }}
          </h3>
        </div>
        <div v-for="message in messages" :key="message.id">
          <div
            :class="{
              'my-message': message.sender_id === currentUserId,
              'other-message': message.sender_id !== currentUserId,
            }"
          >
            <div class="message-header">
              <strong>{{
                message.sender_id === currentUserId
                  ? authStore.user.name
                  : receiverName
              }}</strong>
            </div>
            <div class="message-body">
              {{ message.message }}
            </div>
          </div>
        </div>

        <el-input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Введите сообщение"
          class="message-input"
        >
        </el-input>
      </el-card>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "../../store/authStore"
import axios from "axios"
import Pusher from "pusher-js"

const authStore = useAuthStore()
const route = useRoute()
const currentUserId = ref(null)
const messages = ref([])
const newMessage = ref("")

const receiverId = route.query.receiverId // Кому пишем
const receiverName = route.query.receiverName // его нейм
const token = localStorage.getItem("auth_token")

// Получение сообщений
const fetchMessages = async () => {
  axios
    .get(`http://localhost:8080/api/messages/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      messages.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

// Отправка сообщения
const sendMessage = async () => {
  if (newMessage.value.trim() === "") {
    return
  }

  axios
    .post(
      "http://localhost:8080/api/messages",
      {
        receiver_id: receiverId,
        message: newMessage.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      newMessage.value = ""
      messages.value.push(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}

onMounted(async () => {
  await authStore.getUser()
  currentUserId.value = authStore.user.id

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    broadcaster: "pusher",
    authEndpoint: "http://localhost:8080/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const channel = pusher.subscribe(`private-chat.${authStore.user.id}`)

  channel.bind("MessageSent", (data) => {
    if (!messages.value.some((message) => message.id === data.id)) {
      messages.value.push(data)
    }
  })

  fetchMessages()
})
</script>

<style scoped>
.el-card {
  min-height: 20vh;
}

.card-header {
  width: 100%;
  background-color: rgb(102.2, 177.4, 255);
  border-radius: 4px;
  margin-bottom: 20px;
}
.card-title {
  padding: 10px;
  text-align: center;
}

.content {
  height: 100vh;
  margin-top: 5rem;
}

.el-container {
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: 0 auto;
}

.my-message {
  text-align: left;
  background-color: #e1f5fe;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.other-message {
  text-align: right;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.message-input {
  margin-top: 10%;
  width: 100%;
}
</style>
