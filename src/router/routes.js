// import { RouteRecordRaw } from "vue-router";
import Invoices from "@/views/invoices.vue";
import Login from "@/views/login.vue";
import Home from "@/views/home.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: "/invoices",
        name: "invoices",
        component: Invoices,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
];

export default routes;