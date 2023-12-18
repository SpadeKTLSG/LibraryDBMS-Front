<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="读者姓名" prop="readerName">
        <el-input
            v-model="queryParams.readerName"
            placeholder="请输入读者姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="读者类型" prop="readerType">
        <el-input
            v-model="queryParams.readerType"
            placeholder="请输入读者类型"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-input
            v-model="queryParams.sex"
            placeholder="请输入性别"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="借阅数量" prop="borrowingNumber">
        <el-input
            v-model="queryParams.borrowingNumber"
            placeholder="请输入借阅中数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归还数量" prop="borrowedNumber">
        <el-input
            v-model="queryParams.borrowedNumber"
            placeholder="请输入已归还数量"
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
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['server:Reader:add']"
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
            v-hasPermi="['server:Reader:edit']"
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
            v-hasPermi="['server:Reader:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['server:Reader:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ReaderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="卡号" align="center" prop="cardNumber"/>
      <el-table-column label="读者姓名" align="center" prop="readerName"/>
      <el-table-column label="读者类型" align="center" prop="readerType"/>
      <el-table-column label="性别" align="center" prop="sex"/>
      <el-table-column label="借阅中数量" align="center" prop="borrowingNumber"/>
      <el-table-column label="已归还数量" align="center" prop="borrowedNumber"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['server:Reader:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['server:Reader:remove']">删除</el-button>
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

    <!-- 添加或修改读者对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="ReaderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="读者姓名" prop="readerName">
          <el-input v-model="form.readerName" placeholder="请输入读者姓名"/>
        </el-form-item>
        <el-form-item label="读者类型" prop="readerType">
          <el-input v-model="form.readerType" placeholder="请输入读者类型"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="form.sex" placeholder="请输入性别"/>
        </el-form-item>
        <el-form-item label="借阅中数量" prop="borrowingNumber">
          <el-input v-model="form.borrowingNumber" placeholder="请输入借阅中数量"/>
        </el-form-item>
        <el-form-item label="已归还数量" prop="borrowedNumber">
          <el-input v-model="form.borrowedNumber" placeholder="请输入已归还数量"/>
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

<script setup name="Reader">
import {addReader, delReader, getReader, listReader, updateReader} from "@/api/server/Reader";

const {proxy} = getCurrentInstance();

const ReaderList = ref([]);
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
    readerName: null,
    readerType: null,
    sex: null,
    borrowingNumber: null,
    borrowedNumber: null
  },
  rules: {
    readerName: [
      {required: true, message: "读者姓名不能为空", trigger: "blur"}
    ],
    readerType: [
      {required: true, message: "读者类型不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询读者列表 */
function getList() {
  loading.value = true;
  listReader(queryParams.value).then(response => {
    ReaderList.value = response.rows;
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
    cardNumber: null,
    readerName: null,
    readerType: null,
    sex: null,
    borrowingNumber: null,
    borrowedNumber: null
  };
  proxy.resetForm("ReaderRef");
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
  ids.value = selection.map(item => item.cardNumber);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加读者";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _cardNumber = row.cardNumber || ids.value
  getReader(_cardNumber).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改读者";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["ReaderRef"].validate(valid => {
    if (valid) {
      if (form.value.cardNumber != null) {
        updateReader(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addReader(form.value).then(response => {
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
  const _cardNumbers = row.cardNumber || ids.value;
  proxy.$modal.confirm('是否确认删除读者编号为"' + _cardNumbers + '"的数据项？').then(function () {
    return delReader(_cardNumbers);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('server/Reader/export', {
    ...queryParams.value
  }, `Reader_${new Date().getTime()}.xlsx`)
}

getList();
</script>
