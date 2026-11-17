<template>
    <el-form
      ref="ruleFormRef"
      style="max-width: 100% ; margin: 20px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item class="title" label="登录"></el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入账号" :prefix-icon="User"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"   
          autocomplete="off"
          placeholder="请输入密码"
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item label=" ">
        <button type="button" class="back-button" @click="$emit('selectLogin', true)">
            <el-icon><Back /></el-icon>
            返回注册
        </button>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  // :prefix-icon 需要传入组件对象，必须先 import，否则拿到的是 undefined
  import { User, Lock, Back } from '@element-plus/icons-vue'
  
  const ruleFormRef = ref()
  const ruleForm = reactive({
    username: '',
    password: ''
  })
  const emit = defineEmits(['selectLogin'])

  const rules = reactive({
    username: [{ required: true, message: '请输入账号', trigger: 'blur' },
        { pattern: /^\S{5,16}$/, message: '账号长度为5-16位', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/, message: '密码长度为8-16位，至少包含一个字母、一个数字、一个特殊字符', trigger: 'blur' }
    ]
  })
  import {userLoginService} from '@/api/api'
  import { useRouter } from 'vue-router';
  const router = useRouter();
  import { useToken } from '@/stores/store'
  const tokenStore = useToken()
  const userLogin = async (ruleForm) => {
    try {
      const res = await userLoginService(ruleForm)
      if (res.code === 200) {
        // 先存 token 再跳转，否则目标页面的请求会拿不到鉴权头
        tokenStore.setToken(res.data)
        router.push('/article/articleCategories')
        ElMessage.success(res.message? res.message : '登录成功')
      } else {
        alert(res.message? res.message : '登录失败')
      }
    } catch (error) {
      console.log(error)
      // 后端的错误文本已经在 request.js 的响应拦截器里挂到 error.message 上了
      alert(error.message || '访问服务器失败，请检查服务器是否正常运行')
    }
  }
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        userLogin(ruleForm)
      } else {
        alert('请输入正确的账号和密码')
      }
    })
  }
  
  </script>
  <style scoped>
  .title{
    font-weight: bold;
    margin-bottom: 20px;
  }
  .title :deep(.el-form-item__label){
    font-size: 24px;
    display: block;
  }
  :deep(.el-form-item__label){
    display: none;
  }
  .back-button{
    display: flex;
    align-items: center;
    justify-content: left;
    background-color:transparent;
    color: gray;
    border: none;
    cursor: pointer;
  }
  </style>