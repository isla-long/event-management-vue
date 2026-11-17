<script setup>
import { ref } from 'vue'
import { useUserInfo } from '@/stores/store'
const userInfo = useUserInfo()
const userInfoForm = ref({
    id: userInfo.userInfo.id,
    username: userInfo.userInfo.username,
    email: userInfo.userInfo.email,
    nickname: userInfo.userInfo.nickname,
    avatar: userInfo.userInfo.avatar
})
const rules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '用户名长度为3-10位', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' }
    ]
})
import { updateUserInfoService } from '@/api/api'
const submitForm = ()=>{
    formRef.value.validate((valid)=>{
        if (valid) {
            updateUserInfo()
        } else {
            ElMessage.error('请填写完整信息')
        }
    })
}
const updateUserInfo = async () => {
    let res = await updateUserInfoService(userInfoForm.value)
    if (res.code === 200) {
        ElMessage.success('更新成功')
        userInfo.setUserInfo({
            id: userInfoForm.value.id,
            username: userInfoForm.value.username,
            email: userInfoForm.value.email,
            nickname: userInfoForm.value.nickname,
            avatar: userInfoForm.value.avatar
        })
    } else {
        ElMessage.error(res.message)
    }
}
</script>


<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <div class="user-info">
            <div class="info">
                <el-form :model="userInfoForm" label-width="80px" :rules="rules" style="width: 100%;">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userInfoForm.username" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userInfoForm.email" style="width: 100%;"     />
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="userInfoForm.nickname" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item >
                        <el-button class="default-button" style="margin-left: auto;"  @click="submitForm">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="avatar-display">
                <el-avatar :size="100"  v-if="userInfoForm.avatar" :src="userInfoForm.avatar" />
                <el-avatar :size="100"  v-else>
                    <el-icon ><Plus /></el-icon>
                </el-avatar>
            </div>
        </div>
    </el-card>
</template>


<style scoped> 
.user-info{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "left right";
}
.info{
    height: 100%;
    grid-area: left;
    border: 1px solid black;
    margin: 0;
    padding: 20px 10%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.page-container{
    min-height: 100%;
    box-sizing: border-box;
    .header{
        display: flex;
    }
}
.avatar-display{
    height: 100%;
    margin: 0;
    grid-area: right;
    border: 1px solid black;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>