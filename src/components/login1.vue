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
      <el-form-item class="title" label="注册"></el-form-item>
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
      <el-form-item label="重复密码" prop="rePassword">
        <el-input v-model="ruleForm.rePassword" type="password" autocomplete="off" placeholder="请输入重复密码" :prefix-icon="Lock" />
      </el-form-item>
      <el-form-item label=" ">
        <button type="button" class="back-button" @click="$emit('selectLogin', false)">
            <el-icon><Back /></el-icon>
            返回登录
        </button>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  // :prefix-icon 需要传入组件对象，必须先 import，否则拿到的是 undefined
  import { User, Lock, Back } from '@element-plus/icons-vue'
  import axios from 'axios'
  const ruleFormRef = ref()
  const emit = defineEmits(['selectLogin'])
  const validatePass = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入重复密码'))
    } else if (value !== ruleForm.password) {
      // 校验失败要 return，否则下面还会再 callback() 一次
      callback(new Error('两次密码不一致'))
    } else {
      callback()
    }
  }
  const ruleForm = reactive({
    username: '',
    password: '',
    rePassword: '',
  })
  
  const rules = reactive({
    username: [{ required: true, message: '请输入账号', trigger: 'blur' },
        { pattern: /^\S{5,16}$/, message: '账号长度为5-16位', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/, message: '密码长度为8-16位，至少包含一个字母、一个数字、一个特殊字符', trigger: 'blur' }
    ],
    rePassword: [{validator: validatePass, trigger: 'blur' }],
  })
  import {userRegisterService} from '@/api/api'
  const userRegister = async (ruleForm) => {
    try {
      const res = await userRegisterService(ruleForm)
      if (res.code === 200) {
        emit('selectLogin', false)
        alert(res.message? res.message : '注册成功')
      } else {
        alert(res.message? res.message : '注册失败')
      }
    } catch (error) {
      console.log(error)
      // 后端的错误文本已在 request.js 响应拦截器中挂到 error.message
      alert(error.message || '访问服务器失败，请检查服务器是否正常运行')
    }
  }
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        userRegister(ruleForm)
      } else {
        alert('请输入正确的账号和密码，并且两次密码一致')
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