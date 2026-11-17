<script setup>
import { ref } from 'vue'
import login1 from './components/login1.vue'
import login2 from './components/login2.vue'

const login = ref(false)

const selectLogin = (isLogin) => {
    login.value = isLogin
}
</script>

<template>
    <div class = "login-container">
        <img src="./assets/122079331_p0_master1200.jpg" class = "bk-img">
        <div class = "content-layer">
            <!-- 组件标签不会出现在真实 DOM 里，必须自己包一层 div 才能作为网格项目定位 -->
            <div class = "form-panel">
                <login1 v-if="login" @select-login="selectLogin"/>
                <login2 v-else @select-login="selectLogin"/>
            </div>
        </div>
    </div>
</template> 

<style scoped>
.login-container{
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
}

.bk-img{
    width: 100%;
    height: 100%;
    z-index:1;
    object-fit: cover;
    position : absolute;
    top: 0;
    left: 0;
    mask-image: linear-gradient(to right, black 20%, transparent 60%);

}
.content-layer{
    z-index: 2;
    position: relative;
    display: grid;
    width: 100%;
    min-height: 100vh;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "left right";
    align-items: center;
    justify-items: center;
    padding: 20px;
    box-sizing: border-box;
}
/* 真正占格子的网格项目是这层 div，grid-area 要写在这里 */
.form-panel{
    /* border: 5px solid black; */
    grid-area: right;
    width: 100%;
    max-width: 400px;
}
</style>
