<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="最长借阅" prop="canBorrowingTime">
        <el-input
            v-model="queryParams.canBorrowingTime"
            placeholder="请输入最长借阅时间"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="同时借阅" prop="canBorrowNumber">
        <el-input
            v-model="queryParams.canBorrowNumber"
            placeholder="请输入同时借阅数量"
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
            v-hasPermi="['server:UserType:add']"
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
            v-hasPermi="['server:UserType:edit']"
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
            v-hasPermi="['server:UserType:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['server:UserType:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="UserTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户类型" align="center" prop="userType"/>
      <el-table-column label="最长借阅时间" align="center" prop="canBorrowingTime"/>
      <el-table-column label="同时借阅数量" align="center" prop="canBorrowNumber"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['server:UserType:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['server:UserType:remove']">删除</el-button>
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

    <!-- 添加或修改用户类型对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="UserTypeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="最长借阅时间" prop="canBorrowingTime">
          <el-input v-model="form.canBorrowingTime" placeholder="请输入最长借阅时间"/>
        </el-form-item>
        <el-form-item label="同时借阅数量" prop="canBorrowNumber">
          <el-input v-model="form.canBorrowNumber" placeholder="请输入同时借阅数量"/>
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

<script setup name="UserType">
import {listUserType, getUserType, delUserType, addUserType, updateUserType} from "@/api/server/UserType";

const {proxy} = getCurrentInstance();

const UserTypeList = ref([]);
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
    canBorrowingTime: null,
    canBorrowNumber: null
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询用户类型列表 */
function getList() {
  loading.value = true;
  listUserType(queryParams.value).then(response => {
    UserTypeList.value = response.rows;
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
    userType: null,
    canBorrowingTime: null,
    canBorrowNumber: null
  };
  proxy.resetForm("UserTypeRef");
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
  ids.value = selection.map(item => item.userType);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加用户类型";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _userType = row.userType || ids.value
  getUserType(_userType).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户类型";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["UserTypeRef"].validate(valid => {
    if (valid) {
      if (form.value.userType != null) {
        updateUserType(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserType(form.value).then(response => {
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
  const _userTypes = row.userType || ids.value;
  proxy.$modal.confirm('是否确认删除用户类型编号为"' + _userTypes + '"的数据项？').then(function () {
    return delUserType(_userTypes);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('server/UserType/export', {
    ...queryParams.value
  }, `UserType_${new Date().getTime()}.xlsx`)
}

getList();
</script>
