# 重点位置

1. src/api/tool/gen.js 生成器JS接口, 配合后端生成器使用
2. src/router/index.js 路由配置
3. src/views/server/book/index.vue 书籍管理页面
4. src/api/server/book.js 书籍管理接口

# 替换操作

删除有关原项目的字段

- package删除原仓库
  ```
  "repository": {
    "type": "git",
    "url": "https://gitee.com/y_project/RuoYi-Vue.git"
  },
  ```
- 主页字段大改, 删除所有广告, 调整目录层级
- 完成包结构搭建

