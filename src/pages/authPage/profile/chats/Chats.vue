<template>
  <div class="content">
    <el-card>
      <div class="card-header">
        <h3 class="card-title">Ваши чаты</h3>
      </div>
      <div v-if="chats.length > 0" class="card-chats">
        <el-button
          v-for="chat in chats"
          :key="chat.id"
          :label="chat.name"
          @click="openChat(chat.id, chat.name)"
          class="card-buttons"
        >
          {{ chat.name }}
        </el-button>
      </div>
      <div v-else>Нет чатов</div>
      <div class="card-back">
        <router-link to="/profile">
          <el-button type="info">Назад</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const chats = ref([])

const getChats = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/chats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    chats.value = response.data
  } catch (error) {
    console.log(error)
  }
}

const openChat = (userId, userName) => {
  router.push({
    name: "Chat",
    query: {
      receiverId: userId,
      receiverName: userName,
    },
  })
}

onMounted(() => {
  getChats()
})
</script>

<style scoped>
.card-back {
  display: flex;
  justify-content: end;
  margin-top: 45%;
}
.card-buttons {
  display: block;
  width: 40%;
}
.card-chats {
  display: flex;
  gap: 3px;
  padding: 20px 0;
}
.card-title {
  text-align: center;
  opacity: 0.8;
}
.card-header {
  padding: 10px;
}
.el-card {
  width: 600px;
  margin: 0 auto;
  margin-top: 5rem;
  min-height: 50%;
}
.content {
  height: 100vh;
}
</style>
