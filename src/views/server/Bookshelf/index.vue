<template>
  <div class="app-container">

    <!--标题介绍内容-->
    <el-row>
      <h1 style="margin: 10px 0 0 20px;">书架管理</h1>
    </el-row>
    <br/>
    <el-row>
      <h4 style="margin: 10px 0 0 20px;">书架管理模块，用于查看当前图书馆拥有书架,非必须不可进行修改</h4>
    </el-row>
    <br/>
    <el-divider></el-divider>

    <!--    搜索-->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="书架类型" prop="bookshelfType">
        <el-input
            v-model="queryParams.bookshelfType"
            placeholder="请输入书架类型"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      新增只能通过后端手动修改-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="primary"-->
      <!--            plain-->
      <!--            icon="Plus"-->
      <!--            @click="handleAdd"-->
      <!--            v-hasPermi="['server:Bookshelf:add']"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['server:Bookshelf:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      为了维护只能把新增和删除隐藏-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="danger"-->
      <!--            plain-->
      <!--            icon="Delete"-->
      <!--            :disabled="multiple"-->
      <!--            @click="handleDelete"-->
      <!--            v-hasPermi="['server:Bookshelf:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['server:Bookshelf:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BookshelfList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="书架序号" align="center" prop="bookshelfNumber"/>
      <el-table-column label="书架类型" align="center" prop="bookshelfType"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['server:Bookshelf:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['server:Bookshelf:remove']">删除</el-button>
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

    <!-- 添加或修改书架对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="BookshelfRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="书架类型" prop="bookshelfType">
          <el-input v-model="form.bookshelfType" placeholder="请输入书架类型"/>
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

<script setup name="Bookshelf">
import {addBookshelf, delBookshelf, getBookshelf, listBookshelf, updateBookshelf} from "@/api/server/Bookshelf";

const {proxy} = getCurrentInstance();

const BookshelfList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookshelfType: null
  },
  rules: {
    //RULE - 无新增

  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询书架列表 */
function getList() {
  loading.value = true;
  listBookshelf(queryParams.value).then(response => {
    BookshelfList.value = response.rows;
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
    bookshelfNumber: null,
    bookshelfType: null
  };
  proxy.resetForm("BookshelfRef");
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
  ids.value = selection.map(item => item.bookshelfNumber);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加书架";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _bookshelfNumber = row.bookshelfNumber || ids.value
  getBookshelf(_bookshelfNumber).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改书架";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["BookshelfRef"].validate(valid => {
    if (valid) {
      if (form.value.bookshelfNumber != null) {
        updateBookshelf(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBookshelf(form.value).then(response => {
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
  const _bookshelfNumbers = row.bookshelfNumber || ids.value;
  proxy.$modal.confirm('是否确认删除书架编号为"' + _bookshelfNumbers + '"的数据项？').then(function () {
    return delBookshelf(_bookshelfNumbers);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('server/Bookshelf/export', {
    ...queryParams.value
  }, `Bookshelf_${new Date().getTime()}.xlsx`)
}

getList();
</script>
