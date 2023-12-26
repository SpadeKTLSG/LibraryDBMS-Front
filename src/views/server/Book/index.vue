<template>

  <div class="app-container">

    <!--标题介绍内容-->
    <el-row>
      <h1 style="margin: 10px 0 0 20px;">书籍管理</h1>
    </el-row>
    <br/>
    <el-row>
      <h4 style="margin: 10px 0 0 20px;">书籍管理模块，用于管理图书的增删改查以及借阅逻辑实现</h4>
    </el-row>
    <br/>
    <el-divider></el-divider>

    <!--  搜索表单  -->

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格" prop="bookPrice">
        <el-input
            v-model="queryParams.bookPrice"
            placeholder="请输入价格"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版商" prop="publishingHouse">
        <el-input
            v-model="queryParams.publishingHouse"
            placeholder="请输入出版商"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书架序号" prop="bookshelfNumber">
        <el-input
            v-model="queryParams.bookshelfNumber"
            placeholder="请输入书架序号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收集总数" prop="collectionNumber">
        <el-input
            v-model="queryParams.collectionNumber"
            placeholder="请输入收集总数"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="借出数量" prop="borrowedNumber">
        <el-input
            v-model="queryParams.borrowedNumber"
            placeholder="请输入借出数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="持有数量" prop="inLibrariesNumber">
        <el-input
            v-model="queryParams.inLibrariesNumber"
            placeholder="请输入持有数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <!--  按钮逻辑  -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['server:Book:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['server:Book:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['server:Book:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['server:Book:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BookList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" prop="bookId"/>
      <el-table-column label="名称" align="center" prop="bookName"/>
      <el-table-column label="作者" align="center" prop="author"/>
      <el-table-column label="类型" align="center" prop="bookType"/>
      <el-table-column label="价格" align="center" prop="bookPrice"/>
      <el-table-column label="出版商" align="center" prop="publishingHouse"/>
      <el-table-column label="概要" align="center" prop="summary"/>
      <el-table-column label="书架序号" align="center" prop="bookshelfNumber"/>
      <el-table-column label="收集总数" align="center" prop="collectionNumber"/>
      <el-table-column label="借出数量" align="center" prop="borrowedNumber"/>
      <el-table-column label="持有数量" align="center" prop="inLibrariesNumber"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['server:Book:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['server:Book:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- ! 添加或修改书籍对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="BookRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="bookName">
          <el-input v-model="form.bookName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者"/>
        </el-form-item>
        <el-form-item label="类型" prop="bookType" style="width: 100%">
          <el-select v-model="form.bookType" placeholder="请选择类型" lable-with="60px">
            <!--?赋值查询表单对象-->
            <el-option
                v-for="item in typeOptions"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="bookPrice">
          <el-input v-model="form.bookPrice" placeholder="请输入价格"/>
        </el-form-item>
        <el-form-item label="出版商" prop="publishingHouse">
          <el-input v-model="form.publishingHouse" placeholder="请输入出版商"/>
        </el-form-item>
        <el-form-item label="书架序号" prop="bookshelfNumber">
          <el-input v-model="form.bookshelfNumber" placeholder="请输入书架序号"/>
        </el-form-item>
        <el-form-item label="收集总数" prop="collectionNumber">
          <el-input v-model="form.collectionNumber" placeholder="请输入收集总数"/>
        </el-form-item>
        <el-form-item label="借出数量" prop="borrowedNumber">
          <el-input v-model="form.borrowedNumber" placeholder="请输入借出数量"/>
        </el-form-item>
        <el-form-item label="持有数量" prop="inLibrariesNumber">
          <el-input v-model="form.inLibrariesNumber" placeholder="请输入持有数量"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="Book">
//从js导入
import {addBook, delBook, getBook, getTypeOptions, listBook, updateBook} from "@/api/server/Book";

const {proxy} = getCurrentInstance();

const BookList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

//! data 构建
const data = reactive({
  //! 修改部分：添加了一个 typeOptions 数组，用来存储从后端获取的类型列表
  typeOptions: {},
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookName: null,
    author: null,
    bookType: null,
    bookPrice: null,
    publishingHouse: null,
    summary: null,
    bookshelfNumber: null,
    collectionNumber: null,
    borrowedNumber: null,
    inLibrariesNumber: null
  },
  rules: { //!RULE 新增校验规则
    bookName: [
      {required: true, message: "名称不能为空", trigger: "blur"},
      {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: "名称字段非法", trigger: "blur"}
    ],
    author: [
      {required: true, message: "作者不能为空", trigger: "blur"},
      {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: "作者字段非法", trigger: "blur"}
    ],
    bookshelfNumber: [
      {required: true, message: "书架序号不能为空", trigger: "blur"},
      {pattern: /^[0-9]\d*$/, message: "书架序号必须是整数", trigger: "blur"}
    ],
    bookPrice: [
      {pattern: /^\d+(\.\d+)?$/, message: "不合法的价格", trigger: "blur"}
    ],
    collectionNumber: [
      {required: true, message: "收集总数不能为空", trigger: "blur"},
      {pattern: /^[0-9]\d*$/, message: "收集总数必须是整数", trigger: "blur"},
      {
        validator: (rule, value, callback) => {
          if (value < form.borrowedNumber + form.inLibrariesNumber) {
            callback(new Error("收藏数量关系错误"));
          } else {
            callback();
          }
        }, trigger: "blur"
      }
    ],
    borrowedNumber: [
      {required: true, message: "借出数量不能为空", trigger: "blur"},
      {pattern: /^[0-9]\d*$/, message: "借出数量必须是整数", trigger: "blur"},
      {
        validator: (rule, value, callback) => {
          if (value > form.collectionNumber) {
            callback(new Error("借出数量不能多于收集总数"));
          } else {
            callback();
          }
        }, trigger: "blur"
      }
    ],
    inLibrariesNumber: [
      {required: true, message: "持有数量不能为空", trigger: "blur"},
      {pattern: /^[0-9]\d*$/, message: "持有数量必须是整数", trigger: "blur"},
      {
        validator: (rule, value, callback) => {
          if (value > form.collectionNumber) {
            console.log(form.collectionNumber + " " + value);
            callback(new Error("持有数量不能多于收集总数"));
          } else {
            callback();
          }
        }, trigger: "blur"
      }
    ]
  }

});


let {queryParams, form, typeOptions, rules} = toRefs(data); //这个是解构赋值, 用于将响应式对象解构为单个属性

/** 查询书籍列表 */
function getList() {
  loading.value = true;
  listBook(queryParams.value).then(response => {
    BookList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    bookId: null,
    bookName: null,
    author: null,
    bookType: null,
    bookPrice: null,
    publishingHouse: null,
    summary: null,
    bookshelfNumber: null,
    collectionNumber: null,
    borrowedNumber: null,
    inLibrariesNumber: null
  };
  proxy.resetForm("BookRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.bookId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加书籍";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _bookId = row.bookId || ids.value
  getBook(_bookId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改书籍";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["BookRef"].validate((valid) => {
    if (valid) {
      if (form.value.bookId != null) {
        updateBook(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBook(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _bookIds = row.bookId || ids.value;
  proxy.$modal.confirm('是否确认删除书籍编号为"' + _bookIds + '"的数据项？').then(function () {
    return delBook(_bookIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('server/Book/export', {
    ...queryParams.value
  }, `Book_${new Date().getTime()}.xlsx`)
}


// 修改部分：在 mounted 钩子中调用了 getTypeOptions 方法，以便在页面加载时就获取类型列表
onMounted(() => {
  getList();
  getTypeOptions().then(response => {
    // proxy.$modal.msgSuccess("获取图书列表成功");
    typeOptions = response.rows;
  });
});
</script>
