import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import NotFound from "../components/NotFound.vue"

Vue.use(VueRouter);

const routes = [
    {
        path:"/login",
        name:"Home",
        component:Login
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