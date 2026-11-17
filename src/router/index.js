import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/Layout.vue'
import login from '@/login.vue'
import articleCategories from '@/views/article/articleCategories.vue'
import articleManager from '@/views/article/articleManager.vue'
import userInfo from '@/views/user/userInfo.vue'
import userPassword from '@/views/user/userPassword.vue'
const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '/article/articleCategories', component: articleCategories },
            { path: '/article/articleManager', component: articleManager },
            { path: '/user/userInfo', component: userInfo },
            { path: '/user/userPassword', component: userPassword }
        ]
    },
    {
        path: '/login',
        component: login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes:routes
})

export default router