<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="借出时间" prop="bookBorrowTime">
        <el-date-picker clearable
          v-model="queryParams.bookBorrowTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择借出时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="归还时间" prop="bookReturnTime">
        <el-date-picker clearable
          v-model="queryParams.bookReturnTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择归还时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否还书" prop="isReturn">
        <el-input
          v-model="queryParams.isReturn"
          placeholder="请输入是否还书"
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
          v-hasPermi="['server:Borrow:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['server:Borrow:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['server:Borrow:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['server:Borrow:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BorrowList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人卡号" align="center" prop="cardNumber" />
      <el-table-column label="书序号" align="center" prop="bookNumber" />
      <el-table-column label="借出时间" align="center" prop="bookBorrowTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.bookBorrowTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还时间" align="center" prop="bookReturnTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.bookReturnTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否还书" align="center" prop="isReturn" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['server:Borrow:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['server:Borrow:remove']">删除</el-button>
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

    <!-- 添加或修改借阅对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="BorrowRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="借出时间" prop="bookBorrowTime">
          <el-date-picker clearable
            v-model="form.bookBorrowTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择借出时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="归还时间" prop="bookReturnTime">
          <el-date-picker clearable
            v-model="form.bookReturnTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择归还时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否还书" prop="isReturn">
          <el-input v-model="form.isReturn" placeholder="请输入是否还书" />
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

<script setup name="Borrow">
import { listBorrow, getBorrow, delBorrow, addBorrow, updateBorrow } from "@/api/server/Borrow";

const { proxy } = getCurrentInstance();

const BorrowList = ref([]);
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
    bookBorrowTime: null,
    bookReturnTime: null,
    isReturn: null
  },
  rules: {
    bookBorrowTime: [
      { required: true, message: "借出时间不能为空", trigger: "blur" }
    ],
    bookReturnTime: [
      { required: true, message: "归还时间不能为空", trigger: "blur" }
    ],
    isReturn: [
      { required: true, message: "是否还书不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询借阅列表 */
function getList() {
  loading.value = true;
  listBorrow(queryParams.value).then(response => {
    BorrowList.value = response.rows;
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
    bookNumber: null,
    bookBorrowTime: null,
    bookReturnTime: null,
    isReturn: null
  };
  proxy.resetForm("BorrowRef");
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
  title.value = "添加借阅";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _cardNumber = row.cardNumber || ids.value
  getBorrow(_cardNumber).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改借阅";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["BorrowRef"].validate(valid => {
    if (valid) {
      if (form.value.cardNumber != null) {
        updateBorrow(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBorrow(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除借阅编号为"' + _cardNumbers + '"的数据项？').then(function() {
    return delBorrow(_cardNumbers);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('server/Borrow/export', {
    ...queryParams.value
  }, `Borrow_${new Date().getTime()}.xlsx`)
}

getList();
</script>
