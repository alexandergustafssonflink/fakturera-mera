// import { RouteRecordRaw } from "vue-router";
import Invoices from "@/views/invoices.vue";
import SingleInvoice from "@/views/single-invoice.vue"
import Settings from "@/views/settings.vue";
import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
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
        path: "/invoices/:id",
        name: "single-invoice",
        component: SingleInvoice,
        meta: { requiresAuth: true },
    },
    {
        path: "/settings",
        name: "settings",
        component: Settings,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/register",
        name: "register",
        component: Register,
    },
];

export default routes;