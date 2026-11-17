<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const categorys = ref([
])
import { getArticleCategoriesService } from '@/api/api'
const getArticleCategories = async () => {
    const res = await getArticleCategoriesService()
    if (res.code === 200) {
        categorys.value = res.data
    }
    else {
        alert(res.message)
    }
}
getArticleCategories()

const dialogVisible = ref(false)
const form = ref({
    categoryName: '',
    categoryAlias: '',
    id: ''
})
const rules = ref({
    categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    categoryAlias: [{ required: true, message: '请输入分类别名', trigger: 'blur' }],
})
const formRef = ref(null)
import { addArticleCategoryService } from '@/api/api'
const addCategory = async () => {
    const res = await addArticleCategoryService({
        categoryName: form.value.categoryName,
        categoryAlias: form.value.categoryAlias
    })
    if (res.code === 200) {
        dialogVisible.value = false
        getArticleCategories()
        ElMessage.success('添加成功')
        form.value = {
            categoryName: '',
            categoryAlias: ''
        }
        formRef.value.resetFields()
    }
    else {
        ElMessage.error(res.message)
    }
}
const title = ref('')
const editCategory = (row) => {
    dialogVisible.value = true
    title.value = '编辑分类'
    form.value.id = row.id
    form.value.categoryName = row.categoryName
    form.value.categoryAlias = row.categoryAlias
}
import { updateArticleCategoryService } from '@/api/api'
const updateCategory = async () => {
    const res = await updateArticleCategoryService(form.value)
    if (res.code === 200) {
        dialogVisible.value = false
        getArticleCategories()
        ElMessage.success('更新成功')
        form.value = {
            categoryName: '',
            categoryAlias: '',
            id: ''
        }
        formRef.value.resetFields()
    }
    else {
        ElMessage.error(res.message)
    }
}
const selectDialog = () => {
    if(title.value === '添加分类'){
        addCategory()
    }
    else if(title.value === '编辑分类'){
        updateCategory()
    }
}
const addCategoryDialog = () => {
    dialogVisible.value = true
    title.value = '添加分类'
    form.value = {
        categoryName: '',
        categoryAlias: '',
        id: ''
    }
    formRef.value.resetFields()
}
import { ElMessageBox } from 'element-plus'
const open = (id) => {
  ElMessageBox.confirm(
    '确定要删除吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-dialog',
      cancelButtonClass: 'default-button',
      confirmButtonClass: 'default-button',
    }
  )
    .then(async () => {
        let res = await deleteArticleCategoryService(id)
        if (res.code === 200) {
            getArticleCategories()
            ElMessage.success('删除成功')
        }
        else {
            ElMessage.error(res.message)
        }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除失败',
      })
    })
}
import { deleteArticleCategoryService } from '@/api/api'
</script>


<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="default" @click="addCategoryDialog" class="default-button">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="default" @click="editCategory(row)" class="default-button"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="open(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="title" width="500px" align-center style="border-radius: 10px; padding: 20px;">
        <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" style="padding-right: 20px;">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="form.categoryName" />
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input v-model="form.categoryAlias" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="default" @click="selectDialog" class="default-button">确定</el-button>
            <el-button @click="dialogVisible = false" class="default-button">取消</el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
:global(.default-button:hover){
    background-color:rgba(224, 222, 222, 0.884);
    color: grey;
    border-color: rgba(224, 222, 222, 0.884);
}
:global(.custom-dialog){
    border-radius: 20px;
}
</style>
