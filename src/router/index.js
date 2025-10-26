import { createRouter, createWebHistory } from "vue-router";

// Import your pages
import LandingPage from "../views/LandingPage.vue";
import AuthPage from "../views/AuthPage.vue";
import Dashboard from "../components/Dashboard.vue";
import TicketManagement from "../components/TicketManagement.vue";

const routes = [
  { path: "/", name: "Landing", component: LandingPage },
  {
    path: "/login",
    name: "login",
    component: AuthPage,
    props: { mode: "login" },
  },
  {
    path: "/signup",
    name: "signup",
    component: AuthPage,
    props: { mode: "signup" },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard, // 👈 define this route
  },
  {
    path: "/tickets",
    name: "tickets",
    component: TicketManagement, // 👈 define this route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
