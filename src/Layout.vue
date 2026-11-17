<script setup>
import { ref } from 'vue'
import avatar from './avatar.vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ArrowUp, SwitchButton } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { Location, Menu, Document, Setting, UserFilled, Crop, EditPen, DocumentRemove, Collection ,User} from '@element-plus/icons-vue'
const isVisible = ref(false);
const router = useRouter()  
const handleVisibleChange = (visible) => {
    isVisible.value = visible;
}
const route = useRoute()
const blurHandle = (e) => {
    e.currentTarget?.blur?.();
}
const userName = ref('long')
</script>       

<template>
    <el-container style="height: 100vh; background-color: white;">
        <el-header >
            <avatar>
                <img src="./assets/F7526D6A37066D521D877938500AB5DF.jpg" alt="avatar" />
            </avatar>
            <span class="user-name">
                <el-dropdown trigger="click" @visible-change="handleVisibleChange">
                    <span class="el-dropdown-link" style="color: grey;">
                    当前用户:{{ userName }}
                    <el-icon class="el-icon--right" :class = "{'rotate': isVisible}">
                        <arrow-up />
                    </el-icon>
                    </span>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @pointerleave="blurHandle"  @click="router.push('/user/userInfo')" :class="{'is-active': route.path === '/user/userInfo'}"><el-icon><User /></el-icon>基本资料</el-dropdown-item>
                        <el-dropdown-item @pointerleave="blurHandle" @click="router.push('/user/userPassword')" :class="{'is-active': route.path === '/user/userPassword'}"><el-icon><EditPen /></el-icon>修改密码</el-dropdown-item>
                        <el-dropdown-item @pointerleave="blurHandle" @click="router.push('/login')" :class="{'is-active': route.path === '/login'}"><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </span>
        </el-header>
        <el-container>
            <el-aside width="200px" > 
                <el-menu
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                router
                :default-active="route.path"
                >
                <el-menu-item index="/article/articleCategories">
                    <el-icon><Collection /></el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/articleManager">
                    <el-icon><Document /></el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu>
                <template #title>
                    <el-icon><UserFilled/></el-icon>
                    <span>个人中心</span>
                </template>
                <el-menu-item index="/user/userInfo">
                    <el-icon><User/></el-icon>
                    <span>基本资料</span>
                </el-menu-item>
                <el-menu-item index="/user/userPassword">
                    <el-icon><EditPen /></el-icon>
                    <span>修改密码</span>
                </el-menu-item>
                </el-sub-menu>
            </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-bottom: 2px solid rgb(191, 190, 190);
}
.el-header .avatar{
    margin-left: 20px;
}
.el-header .user-name{
    font-weight: bold;
    font-family: 'Microsoft YaHei';
    margin-right: 20px;
    color: black;
}
.el-dropdown{
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.el-dropdown :deep(:focus){
    border: none;
    outline: none;
}
.el-container *{
    /* border: 1px solid black; */
}
.el-aside{
    /* border-right: 1px solid grey; */
}
.el-main{
    background-color: rgb(230, 228, 228);
}
.el-menu-item{
    transition: all 0.1s ease;
}
.el-menu-item:hover,
:deep(.el-sub-menu__title:hover),
:deep(.el-dropdown-menu__item:hover){
    background-color: rgb(230, 228, 228) !important;
    color: black !important;
}
.el-menu-item.is-active,
:deep(.el-dropdown-menu__item.is-active){
    background-color: rgb(213, 210, 210) !important;
    color: black !important;
}
.el-icon--right{
    transition:all 0.3s ease;
}
.rotate{
    transform: rotate(180deg);
}
</style>

