<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="default" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="序列号" label-width="40%"  prop="startTime">
        <el-input
            v-model="queryParams.serialNumber"
            placeholder="请输入序列号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="雷达故障代码" label-width="40%" prop="radarFaultCode">
        <el-input
            v-model="queryParams.radarFaultCode"
            placeholder="请输入雷达故障代码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备故障代码" label-width="40%" prop="deviceFaultCode">
        <el-input
            v-model="queryParams.deviceFaultCode"
            placeholder="请输入设备故障代码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属服务站" label-width="40%" prop="affiliatedServiceStation">
        <el-input
            v-model="queryParams.affiliatedServiceStation"
            placeholder="请输入所属服务站 "
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" size="default" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" size="default" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="plus"
            size="default"
            @click="handleAdd"
            v-hasPermi="['regulatory_platform:earlywarningequipment:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="edit"
            size="default"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['regulatory_platform:earlywarningequipment:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="delete"
            size="default"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['regulatory_platform:earlywarningequipment:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="download"
            size="default"
            @click="handleExport"
            v-hasPermi="['regulatory_platform:earlywarningequipment:export']"
        >导出
        </el-button>


      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="earlywarningequipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序列号" align="center" prop="serialNumber"/>
      <el-table-column label="设备开始时间" align="center" prop="startTime"/>
      <el-table-column label="雷达故障代码" align="center" prop="radarFaultCode"/>
      <el-table-column label="设备故障代码" align="center" prop="deviceFaultCode"/>
      <el-table-column label="电池电压" align="center" prop="batteryVoltage"/>
      <el-table-column label="经度" align="center" prop="longitude"/>
      <el-table-column label="纬度" align="center" prop="latitude"/>
      <el-table-column label="超速阈值" align="center" prop="overspeedThreshold"/>
      <el-table-column label="近距离速度阀值" align="center" prop="closeRangeSpeedThreshold"/>
      <el-table-column label="触发报警的距离" align="center" prop="distanceToTriggerAlarm"/>
      <el-table-column label="触发报警的车横向范围" align="center" prop="theLateralRangeOfTheCarThatTriggeredTheAlarm"/>
      <el-table-column label="所属服务站 " align="center" prop="affiliatedServiceStation"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="default"
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['regulatory_platform:earlywarningequipment:edit']"
          >修改
          </el-button>
          <el-button
              size="default"
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['regulatory_platform:earlywarningequipment:remove']"
          >删除
          </el-button>
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

    <!-- 修改防撞预警设备对话框 -->
    <el-dialog :title="title" v-model="open"  width="55%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序列号" label-width="20%" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入产品序列号"/>
        </el-form-item>
        <el-form-item label="设备开始时间" label-width="20%" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入设备开始时间" />
        </el-form-item>
        <el-form-item label="雷达故障代码" label-width="20%" prop="radarFaultCode">
          <el-input v-model="form.radarFaultCode" placeholder="请输入雷达故障代码" />
        </el-form-item>
        <el-form-item label="设备故障代码" label-width="20%" prop="deviceFaultCode">
          <el-input v-model="form.deviceFaultCode" placeholder="请输入设备故障代码" />
        </el-form-item>
        <el-form-item label="电池电压" label-width="20%" prop="batteryVoltage">
          <el-input v-model="form.batteryVoltage" placeholder="请输入电池电压" />
        </el-form-item>
        <el-form-item label="经度" label-width="20%" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" label-width="20%" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="超速阈值" label-width="20%" prop="overspeedThreshold">
          <el-input v-model="form.overspeedThreshold" placeholder="请输入超速阈值" />
        </el-form-item>
        <el-form-item label="近距离速度阀值" label-width="20%" prop="closeRangeSpeedThreshold">
          <el-input v-model="form.closeRangeSpeedThreshold" placeholder="请输入近距离速度阀值" />
        </el-form-item>
        <el-form-item label="触发报警的距离" label-width="20%" prop="distanceToTriggerAlarm">
          <el-input v-model="form.distanceToTriggerAlarm" placeholder="请输入触发报警的距离" />
        </el-form-item>
        <el-form-item label="触发报警的车横向范围" label-width="20%" prop="theLateralRangeOfTheCarThatTriggeredTheAlarm">
          <el-input v-model="form.theLateralRangeOfTheCarThatTriggeredTheAlarm" placeholder="请输入触发报警的车横向范围" />
        </el-form-item>
        <el-form-item label="所属服务站" label-width="20%" prop="affiliatedServiceStation">
          <el-input v-model="form.affiliatedServiceStation" placeholder="请输入所属服务站 " />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">

        <el-button type="primary" :span="1.5" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 增加防撞预警设备对话框 -->
    <el-dialog :title="title" v-model="openAdd"  width="55%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序列号" label-width="20%" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入产品序列号"/>
        </el-form-item>
        <el-form-item label="所属服务站" label-width="20%" prop="affiliatedServiceStation">
          <el-input v-model="form.affiliatedServiceStation" placeholder="请输入所属服务站 "/>
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
import {
  listEarlywarningequipment,
  getEarlywarningequipment,
  delEarlywarningequipment,
  addEarlywarningequipment,
  updateEarlywarningequipment
} from "@/api/regulatory_platform/earlywarningequipment";

export default {
  name: "Earlywarningequipment",
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
      // 防撞预警设备表格数据
      earlywarningequipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAdd: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        radarFaultCode: null,
        deviceFaultCode: null,
        batteryVoltage: null,
        longitude: null,
        latitude: null,
        overspeedThreshold: null,
        closeRangeSpeedThreshold: null,
        distanceToTriggerAlarm: null,
        theLateralRangeOfTheCarThatTriggeredTheAlarm: null,
        affiliatedServiceStation: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serialNumber: [
          {required: true, message: "序列号不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询防撞预警设备列表 */
    getList() {
      this.loading = true;
      listEarlywarningequipment(this.queryParams).then(response => {
        this.earlywarningequipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openAdd = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        serialNumber: null,
        startTime: null,
        radarFaultCode: null,
        deviceFaultCode: null,
        batteryVoltage: null,
        longitude: null,
        latitude: null,
        overspeedThreshold: null,
        closeRangeSpeedThreshold: null,
        distanceToTriggerAlarm: null,
        theLateralRangeOfTheCarThatTriggeredTheAlarm: null,
        affiliatedServiceStation: null
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
      this.ids = selection.map(item => item.serialNumber)
      console.log(this.ids)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.openAdd = true;
      this.title = "添加防撞预警设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const serialNumber = row.serialNumber || this.ids
      getEarlywarningequipment(serialNumber).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改防撞预警设备";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.open !== false) {
            updateEarlywarningequipment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.openAdd = false;
              this.getList();
            });
          } else {
            addEarlywarningequipment(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.openAdd = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const serialNumbers = row.serialNumber || this.ids;
      this.$modal.confirm('是否确认删除防撞预警设备编号为"' + serialNumbers + '"的数据项？').then(function () {
        return delEarlywarningequipment(serialNumbers);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('regulatory_platform/earlywarningequipment/export', {
        ...this.queryParams
      }, `earlywarningequipment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
