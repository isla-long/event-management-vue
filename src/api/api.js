import request from "@/utils/request"

export const userRegisterService = (data) =>{
   let params = new URLSearchParams()
   params.append("username", data.username)
   params.append("password", data.password)
   return request.post("/user/register", params)
}

export const userLoginService = (data) =>{
   let params = new URLSearchParams()
   params.append("username", data.username)
   params.append("password", data.password)
   return request.post("/user/login", params)
}

export const getArticleCategoriesService = () =>{
   return request.get("/category")
}

export const addArticleCategoryService = (data) =>{
   return request.post("/category", data)
}

export const updateArticleCategoryService = (data) =>{
   return request.put("/category", data)
}

export const deleteArticleCategoryService = (id) =>{
   return request.delete("/category?id=" + id)
}

export const getArticleListService = (params) =>{
   return request.get("/article", {params: params})
}

export const avatarUploadService = (formData) =>{
   return request.post("/upload", formData)
}

export const addArticleService = (data) =>{
   return request.post("/article", data)
}

export const updateArticleService = (data) =>{
   return request.put("/article", data)
}

export const deleteArticleService = (id) =>{
   return request.delete("/article?id=" + id)
}

export const updateUserInfoService = (data) =>{
   return request.put("/user/update", data)
}