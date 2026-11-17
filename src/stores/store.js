import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useToken = defineStore('token', () => {
    const token = ref('')
    const setToken = (newToken) => {
        token.value = newToken
    }
    const removeToken = () => {
        token.value = ''
    }
    return {
        token,
        setToken,
        removeToken
    }
}, {
    persist: true
})

export const useUserInfo = defineStore('userInfo', () => {
    const userInfo = ref({})
    const setUserInfo = (newUserInfo) => {
        userInfo.value = newUserInfo
    }
    const removeUserInfo = () => {
        userInfo.value = {}
    }
    return {
        userInfo,
        setUserInfo,
        removeUserInfo
    }
}, {
    persist: true
})