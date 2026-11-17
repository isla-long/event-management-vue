<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
//文章分类数据模型
const categorys = ref([
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(10)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getArticleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getArticleList()
}
import { getArticleCategoriesService } from '@/api/api'
const getArticleCategories = async () => {
    let res = await getArticleCategoriesService()
    if (res.code === 200) {
        categorys.value = res.data
    }
}
getArticleCategories()

import { getArticleListService } from '@/api/api'
const getArticleList = async () => {
    let res = await getArticleListService({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value.id?categoryId.value.id:null,
        state: state.value?state.value:null
    })
    if (res.code === 200) {
        total.value = res.data.total
        articles.value = res.data.items

        for (let i = 0; i < articles.value.length; i++) {
            articles.value[i].categoryName = categorys.value.find(c => c.id === articles.value[i].categoryId).categoryName
        }
    }
}
getArticleList()
const reset = () => {
    categoryId.value = ''
    state.value = ''
    getArticleList()
}

const drawer = ref(false)

const form = reactive({ 
    title: '',
    content: '', 
    coverImg: '', 
    categoryId: '', 
    state: '' })
const validateContent = (rule, value, callback) => {
    const str = value.replace(/<[^>]*>?/g, '').trim()
    if (str.length === 0) {
        callback(new Error('请输入文章内容'))
        return
    }
    callback()
}
const rules = ref({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
    ],
    coverImg: [
        { required: true, message: '请上传文章封面', trigger: 'blur' }
    ],
    content: [
        { validator: validateContent, trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'blur' }
]
})
const formRef = ref(null)
const uploadRef = ref(null)
import { Plus } from '@element-plus/icons-vue'
const handleChange = (file) => {
    // form 是 reactive 对象，不能写 form.value
    imgInstance.value = file.raw
    form.coverImg = URL.createObjectURL(imgInstance.value)
    formRef.value?.validateField('coverImg')
}
import { avatarUploadService } from '@/api/api'
const imgInstance = ref(null)

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { addArticleService } from '@/api/api'
const addArticle = (formEl, state) => {
    formEl.validate(async (valid) => {
        if (valid) {
            form.state = state
            const formData = new FormData()
            formData.append('file', imgInstance.value)
            const imgres = await avatarUploadService(formData)
            if (imgres.code === 200) {
                form.coverImg = imgres.data
            }else{
                ElMessage.error(imgres.message)
                return
            }
            const res = await addArticleService(form)
            if (res.code === 200) {
                ElMessage.success(res.message)
                drawer.value = false
                imgInstance.value = null
                formRef.value.resetFields()
                getArticleList()
            }else{
                ElMessage.error(res.message)
            }
        }
        else{
            ElMessage.error('请填写完整信息')
        }
    })
}

// 编辑文章dialog
const dialog = ref(false)
const editFormRef = ref(null)
const editIndex = ref(null)
const rawImg = ref(null)
const editArticle = (row, index) =>{
    dialog.value = true
    form.title = row.title
    form.categoryId = row.categoryId
    form.coverImg = row.coverImg
    form.content = row.content
    form.state = row.state
    editIndex.value = row.id
    rawImg.value = row.coverImg
}
import { updateArticleService } from '@/api/api'
const changeArticle = (formEl) => {
    formEl.validate(async (valid) => {
        if (valid) {
            const formData = new FormData()
            formData.append('file', imgInstance.value)
            if(rawImg.value!==form.coverImg){
                const imgres = await avatarUploadService(formData)
                if (imgres.code === 200) {
                    form.coverImg = imgres.data
                }else{
                    ElMessage.error(imgres.message)
                    return
                }
            }
            const res = await updateArticleService({
                id: editIndex.value,
                title: form.title,
                categoryId: form.categoryId,
                coverImg: form.coverImg,
                content: form.content,
                state: form.state
            })
            if (res.code === 200) {
                ElMessage.success(res.message)
                dialog.value = false
                imgInstance.value = null
                editFormRef.value.resetFields()
                getArticleList()
            }else{
                ElMessage.error(res.message)
            }
        }
        else{
            ElMessage.error('请填写完整信息')
        }
    })
}
import { ElMessageBox } from 'element-plus'
import { deleteArticleService } from '@/api/api'
const deleteArticle = (id) => {
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
        let res = await deleteArticleService(id)
        if (res.code === 200) {
            getArticleList()
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
</script>


<template>
    <el-drawer v-model="drawer" direction="rtl" title="添加文章" size="40%">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select v-model="form.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="coverImg">
                <el-upload
                    ref="uploadRef"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleChange"
                    >
                    <div  v-if="form.coverImg" class="img-container">
                        <img  :src="form.coverImg" alt="cover" />
                    </div>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor-container">
                    <QuillEditor v-model:content="form.content"  theme="snow" placeholder="请输入文章内容" content-type="html"/>
                </div>
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button @click="addArticle(formRef,'草稿')">草稿</el-button>
            <el-button type="primary" @click="addArticle(formRef,'已发布')">发布</el-button>
        </template>
    </el-drawer>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="drawer = true">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 120px;">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 120px;">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticleList">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="封面" width="100">
                <template #default="{ row }">
                    <div class="img-container-table" v-if="row.coverImg">
                        <img :src="row.coverImg" alt="cover" />
                    </div>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="editArticle(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <el-dialog v-model="dialog" title="编辑文章" size="40%" align-center>
        <el-form ref="editFormRef" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select v-model="form.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
                <el-select v-model="form.state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="coverImg">
                <el-upload
                    ref="editUploadRef"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleChange"
                    >
                    <div  v-if="form.coverImg" class="img-container">
                        <img  :src="form.coverImg" alt="cover" />
                    </div>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor-container">
                    <QuillEditor v-model:content="form.content"  theme="snow" placeholder="请输入文章内容" content-type="html"/>
                </div>
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button type="primary" @click="changeArticle(editFormRef)">修改</el-button>
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
.img-container {
  border-radius: 10px;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.img-container-table {
  --height: 50px;
  border-radius: calc(var(--height)*0.2);
  width: var(--height);
  height: var(--height);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.editor-container {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border : 1px dashed #d9d9d9;
}
</style>