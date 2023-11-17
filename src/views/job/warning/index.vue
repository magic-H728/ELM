<template>
  <div class="app-container">
  
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:121:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:121:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="WarningList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="网站ID" align="center" prop="siteId" />
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="主分类ID" align="center" prop="cateId" />
      <el-table-column label="车速" align="center" prop="speed" />
      <el-table-column label="纵距" align="center" prop="long" />
      <el-table-column label="横距" align="center" prop="lat" />
      <el-table-column label="报警" align="center" prop="aflag" />
      <el-table-column label="关联设备" align="center" prop="mId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:121:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:121:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改车辆报警对话框 -->
  </div>
</template>

<script>
import { list121, get121, del121, add121, update121 } from "@/api/system/121";

export default {
  name: "121",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 车辆报警表格数据
      WarningList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: null,
        projectId: null,
        cateId: null,
        speed: null,
        long: null,
        lat: null,
        aflag: null,
        mId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteId: [
          { required: true, message: "网站ID不能为空", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "项目ID不能为空", trigger: "blur" }
        ],
        cateId: [
          { required: true, message: "主分类ID不能为空", trigger: "blur" }
        ],
        speed: [
          { required: true, message: "车速不能为空", trigger: "blur" }
        ],
        long: [
          { required: true, message: "纵距不能为空", trigger: "blur" }
        ],
        lat: [
          { required: true, message: "横距不能为空", trigger: "blur" }
        ],
        aflag: [
          { required: true, message: "报警不能为空", trigger: "blur" }
        ],
        mId: [
          { required: true, message: "关联设备不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询车辆报警列表 */
    getList() {
      this.loading = true;
      list121(this.queryParams).then(response => {
        this.WarningList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        siteId: null,
        projectId: null,
        cateId: null,
        speed: null,
        long: null,
        lat: null,
        aflag: null,
        mId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加车辆报警";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      get121(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆报警";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除车辆报警编号为"' + ids + '"的数据项？').then(function() {
        return del121(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('job/warning/export', {
        ...this.queryParams
      }, `121_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
