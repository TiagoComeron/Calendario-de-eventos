import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import NotFound from "../components/NotFound.vue"

Vue.use(VueRouter);

const routes = [
    {
        path:"/",
        redirect:'/login',
    },
    {
        path:"/login",
        name:"Login",
        component:Login
    },
    {
        path:"/home",
        name:"Home",
        component:Home
    },
    {
        path:"*",
        name:"NotFound",
        component:NotFound
    }
]

const router = new VueRouter({
    mode: "history",
    base: "",
    routes
})

export default router