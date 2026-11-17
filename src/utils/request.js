import axios from "axios"
import { ElMessage } from "element-plus"
import router from '@/router'
import { useToken } from '@/stores/store'

const prefix = '/api'
const instance = axios.create({
    baseURL: prefix,
    timeout: 5000
})

instance.interceptors.request.use(config => {
    const tokenStore = useToken()
    if (tokenStore.token) {
        config.headers.Authorization = tokenStore.token
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    // 注意：这里 return 之后代码不会执行，
    // 401 的跳转逻辑必须写在 return 之前，或者放到下面的 error 分支里
    return response.data
}, error => {
    const status = error.response?.status
    // 后端统一返回体 { code, message, data }，HTTP 400 时 body 里也有可读的 message
    const backendMessage = error.response?.data?.message

    if (status === 401) {
        ElMessage.error('请先登录')
        const tokenStore = useToken()
        tokenStore.removeToken()
        router.push('/login')
    } else if (error.code === 'ECONNABORTED') {
        error.message = '请求超时，请检查后端服务'
        ElMessage.error(error.message)
    } else if (backendMessage) {
        // 把后端的错误文本挂到 error.message 上，调用方 catch 里直接 alert(error.message)
        // 这里不再弹 ElMessage，避免和调用方的提示重复
        error.message = backendMessage
    } else {
        error.message = '服务异常'
        ElMessage.error(error.message)
    }
    return Promise.reject(error)
})

export default instance
