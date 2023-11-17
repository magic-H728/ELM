<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="设备名称" prop="subtitle">
        <el-input
          v-model="queryParams.subtitle"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:119:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:119:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:119:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="DevList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="网站ID" align="center" prop="siteId" />
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="主分类ID" align="center" prop="cateId" />
      <el-table-column label="雷达代码" align="center" prop="radar" />
      <el-table-column label="电池电压" align="center" prop="bat" />
      <el-table-column label="longi" align="center" prop="longi" />
      <el-table-column label="lati" align="center" prop="lati" />
      <el-table-column label="超速阀值" align="center" prop="ov" />
      <el-table-column label="近距离速度阀值" align="center" prop="nv" />
      <el-table-column label="触发报警的距离" align="center" prop="long" />
      <el-table-column label="触发报警的车横向范围" align="center" prop="lat" />
      <el-table-column label="设备状态" align="center" prop="gps" />
      <el-table-column label="分组" align="center" prop="fenzu" />
      <el-table-column label="config_更新时间" align="center" prop="configUpdate" />
      <el-table-column label="开机时间" align="center" prop="onTime" />
      <el-table-column label="设备名称" align="center" prop="subtitle" />
      <el-table-column label="更新时间" align="center" prop="statusUpdate" />
      <el-table-column label="视频名" align="center" prop="deviceserial" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:119:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:119:remove']"
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

    <!-- 添加或修改预警机对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="雷达代码" prop="radar">
          <el-input v-model="form.radar" placeholder="请输入雷达代码" />
        </el-form-item>
        <el-form-item label="电池电压" prop="bat">
          <el-input v-model="form.bat" placeholder="请输入电池电压" />
        </el-form-item>
        <el-form-item label="longi" prop="longi">
          <el-input v-model="form.longi" placeholder="请输入longi" />
        </el-form-item>
        <el-form-item label="lati" prop="lati">
          <el-input v-model="form.lati" placeholder="请输入lati" />
        </el-form-item>
        <el-form-item label="超速阀值" prop="ov">
          <el-input v-model="form.ov" placeholder="请输入超速阀值" />
        </el-form-item>
        <el-form-item label="近距离速度阀值" prop="nv">
          <el-input v-model="form.nv" placeholder="请输入近距离速度阀值" />
        </el-form-item>
        <el-form-item label="触发报警的距离" prop="long">
          <el-input v-model="form.long" placeholder="请输入触发报警的距离" />
        </el-form-item>
        <el-form-item label="触发报警的车横向范围" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入触发报警的车横向范围" />
        </el-form-item>
        <el-form-item label="设备状态" prop="gps">
          <el-input v-model="form.gps" placeholder="请输入设备状态" />
        </el-form-item>
        <el-form-item label="分组" prop="fenzu">
          <el-input v-model="form.fenzu" placeholder="请输入分组" />
        </el-form-item>
        <el-form-item label="config_更新时间" prop="configUpdate">
          <el-input v-model="form.configUpdate" placeholder="请输入config_更新时间" />
        </el-form-item>
        <el-form-item label="开机时间" prop="onTime">
          <el-input v-model="form.onTime" placeholder="请输入开机时间" />
        </el-form-item>
        <el-form-item label="设备名称" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="更新时间" prop="statusUpdate">
          <el-input v-model="form.statusUpdate" placeholder="请输入更新时间" />
        </el-form-item>
        <el-form-item label="视频名" prop="deviceserial">
          <el-input v-model="form.deviceserial" placeholder="请输入视频名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list119, get119, del119, add119, update119 } from "@/api/system/119";

export default {
  name: "119",
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
      // 预警机表格数据
      DevList: [],
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
        radar: null,
        bat: null,
        longi: null,
        lati: null,
        ov: null,
        nv: null,
        long: null,
        lat: null,
        gps: null,
        fenzu: null,
        configUpdate: null,
        onTime: null,
        subtitle: null,
        statusUpdate: null,
        deviceserial: null
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
        radar: [
          { required: true, message: "雷达代码不能为空", trigger: "blur" }
        ],
        bat: [
          { required: true, message: "电池电压不能为空", trigger: "blur" }
        ],
        longi: [
          { required: true, message: "longi不能为空", trigger: "blur" }
        ],
        lati: [
          { required: true, message: "lati不能为空", trigger: "blur" }
        ],
        ov: [
          { required: true, message: "超速阀值不能为空", trigger: "blur" }
        ],
        nv: [
          { required: true, message: "近距离速度阀值不能为空", trigger: "blur" }
        ],
        long: [
          { required: true, message: "触发报警的距离不能为空", trigger: "blur" }
        ],
        lat: [
          { required: true, message: "触发报警的车横向范围不能为空", trigger: "blur" }
        ],
        gps: [
          { required: true, message: "设备状态不能为空", trigger: "blur" }
        ],
        fenzu: [
          { required: true, message: "分组不能为空", trigger: "blur" }
        ],
        configUpdate: [
          { required: true, message: "config_更新时间不能为空", trigger: "blur" }
        ],
        onTime: [
          { required: true, message: "开机时间不能为空", trigger: "blur" }
        ],
        subtitle: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        statusUpdate: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ],
        deviceserial: [
          { required: true, message: "视频名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询预警机列表 */
    getList() {
      this.loading = true;
      list119(this.queryParams).then(response => {
        this.DevList = response.rows;
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
        radar: null,
        bat: null,
        longi: null,
        lati: null,
        ov: null,
        nv: null,
        long: null,
        lat: null,
        gps: null,
        fenzu: null,
        configUpdate: null,
        onTime: null,
        subtitle: null,
        statusUpdate: null,
        deviceserial: null
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
      this.title = "添加预警机";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      get119(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改预警机";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            update119(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add119(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除预警机编号为"' + ids + '"的数据项？').then(function() {
        return del119(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('device/devList/export', {
        ...this.queryParams
      }, `119_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
