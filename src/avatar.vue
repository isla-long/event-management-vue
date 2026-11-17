<script setup>

</script>

<template>
    <div class="avatar">
        <slot></slot>
    </div>
</template>

<style>

    .avatar{
        /* border: 1px solid gray; */
        border-radius: 50%;
        height: 40px;
        width: 40px;
        overflow: hidden;
    }
    .avatar img{
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
</style>