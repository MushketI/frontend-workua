import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../store/authStore"
import Register from "../pages/authPage/register/Register.vue"
import Login from "../pages/authPage/login/Login.vue"
import Profile from "../pages/authPage/profile/Profile.vue"
import Content from "../pages/mainPage/Content.vue"
import EditUser from "../pages/authPage/profile/edit/EditUser.vue"
import ForgotPassword from "../pages/authPage/forgotPassword/ForgotPassword.vue"
import ResetPassword from "../pages/authPage/resetPassword/ResetPassword.vue"
import CreateVacancy from "../pages/authPage/profile/createVacancy/CreateVacancy.vue"
import CreateCompany from "../pages/authPage/profile/createCompany/CreateCompany.vue"
import ProfileCompany from "../pages/authPage/profile/profileCompany/ProfileCompany.vue"
import EditVacancy from "../pages/authPage/profile/editVacancy/EditVacancy.vue"
import CreateResume from "../pages/authPage/profile/createResume/CreateResume.vue"
import EditResume from "../pages/authPage/profile/editResume/EditResume.vue"
import CreateAvatar from "../pages/authPage/profile/createAvatar/CreateAvatar.vue"
import SingVacancy from "../pages/mainPage/mainCandidates/singVacancy/SingVacancy.vue"
import SingCandidate from "../pages/mainPage/mainEmployers/singCandidate/SingCandidate.vue"
import ChatPage from "../pages/chatPage/ChatPage.vue"
import Chats from "../pages/authPage/profile/chats/Chats.vue"
import Reports from "../pages/authPage/profile/reports/Reports.vue"
import { useSettingStore } from "../store/settingStore"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "content",
      path: "/",
      component: Content,
    },
    {
      name: "register",
      path: "/register",
      component: Register,
      meta: { isAuth: false },
    },
    {
      name: "login",
      path: "/login",
      component: Login,
      meta: { isAuth: false },
    },
    {
      name: "profile",
      path: "/profile",
      component: Profile,
      meta: { isAuth: true },
    },
    {
      name: "EditUser",
      path: "/edit/user/:id",
      component: EditUser,
      props: true,
      meta: { isAuth: true },
    },
    {
      name: "forgotPassword",
      path: "/forgot-password",
      component: ForgotPassword,
    },
    {
      name: "resetPassword",
      path: "/reset-password/:token",
      component: ResetPassword,
    },
    {
      name: "createCompany",
      path: "/create-company",
      component: CreateCompany,
      meta: { isAuth: true, requiredRole: 2 },
    },
    {
      name: "profileCompany",
      path: "/profile-company",
      component: ProfileCompany,
      meta: { isAuth: true, requiredRole: 2 },
    },
    {
      name: "createVacancy",
      path: "/create-vacancy",
      component: CreateVacancy,
      meta: { isAuth: true, requiredRole: 2 },
    },
    {
      name: "editVacancy",
      path: "/edit-vacancy/:id",
      component: EditVacancy,
      meta: { isAuth: true, requiredRole: 2 },
    },
    {
      name: "createResume",
      path: "/create-resume",
      component: CreateResume,
      meta: { isAuth: true, requiredRole: 1 },
    },
    {
      name: "editResume",
      path: "/edit-resume",
      component: EditResume,
      meta: { isAuth: true, requiredRole: 1 },
    },
    {
      name: "createAvatar",
      path: "/create-avatar",
      component: CreateAvatar,
      meta: { isAuth: true },
    },
    {
      name: "singVacancy",
      path: "/sing-vacancy/:id",
      component: SingVacancy,
    },
    {
      name: "singCandidate",
      path: "/sing-candidate/:id",
      component: SingCandidate,
    },
    {
      path: "/chat",
      name: "Chat",
      component: ChatPage,
      meta: { isAuth: true },
    },
    {
      path: "/chats",
      name: "Chats",
      component: Chats,
      meta: { isAuth: true },
    },
    {
      name: "reports",
      path: "/reports",
      component: Reports,
      meta: { isAuth: true, requiredRole: 2 },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("auth_token")
  const authStore = useAuthStore()
  const settingStore = useSettingStore()

  if (to.meta.isAuth) {
    if (!token) {
      return next("/login")
    }

    if (!authStore.user && token) {
      authStore.getUser()
    }

    if (
      to.meta.requiredRole &&
      authStore.user &&
      authStore.user.role_id !== to.meta.requiredRole
    ) {
      return next("/profile")
    }
  }

  if (to.name === "reports") {
    await settingStore.getSettingReport()
    if (settingStore.report.is_active !== 1) {
      return next("/profile")
    }
  }

  if (to.meta.isAuth === false && token) {
    return next("/profile")
  }

  next()
})

export default router
