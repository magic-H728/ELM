<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义的模板" prop="tpl">
        <el-input
          v-model="queryParams.tpl"
          placeholder="请输入自定义的模板"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SEO标题" prop="seoTitle">
        <el-input
          v-model="queryParams.seoTitle"
          placeholder="请输入SEO标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SEO关键字" prop="seoKeywords">
        <el-input
          v-model="queryParams.seoKeywords"
          placeholder="请输入SEO关键字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SEO描述" prop="seoDesc">
        <el-input
          v-model="queryParams.seoDesc"
          placeholder="请输入SEO描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="tag标签" prop="tag">
        <el-input
          v-model="queryParams.tag"
          placeholder="请输入tag标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主题属性" prop="attr">
        <el-input
          v-model="queryParams.attr"
          placeholder="请输入主题属性"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内容标识串" prop="identifier">
        <el-input
          v-model="queryParams.identifier"
          placeholder="请输入内容标识串"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="CSS样式" prop="style">
        <el-input
          v-model="queryParams.style"
          placeholder="请输入CSS样式"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['system:list:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:list:edit']"
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
          v-hasPermi="['system:list:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:list:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="TotalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="0为根主题，其他ID对应list表的id字段" align="center" prop="parentId" />
      <el-table-column label="分类ID" align="center" prop="cateId" />
      <el-table-column label="模块ID" align="center" prop="moduleId" />
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="网站ID" align="center" prop="siteId" />
      <el-table-column label="主题" align="center" prop="title" />
      <el-table-column label="发布时间" align="center" prop="dateline" />
      <el-table-column label="最后修改时间" align="center" prop="lastdate" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="0未审核，1已审核" align="center" prop="status" />
      <el-table-column label="0显示，1隐藏" align="center" prop="hidden" />
      <el-table-column label="查看次数" align="center" prop="hits" />
      <el-table-column label="自定义的模板" align="center" prop="tpl" />
      <el-table-column label="SEO标题" align="center" prop="seoTitle" />
      <el-table-column label="SEO关键字" align="center" prop="seoKeywords" />
      <el-table-column label="SEO描述" align="center" prop="seoDesc" />
      <el-table-column label="tag标签" align="center" prop="tag" />
      <el-table-column label="主题属性" align="center" prop="attr" />
      <el-table-column label="最后回复时间" align="center" prop="replydate" />
      <el-table-column label="会员ID号，为0表示管理员发布" align="center" prop="userId" />
      <el-table-column label="内容标识串" align="center" prop="identifier" />
      <el-table-column label="财富基于，用于计算财富的基础量" align="center" prop="integral" />
      <el-table-column label="CSS样式" align="center" prop="style" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:list:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:list:remove']"
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

    <!-- 添加或修改内容主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主题" prop="title">
          <el-input v-model="form.title" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="自定义的模板" prop="tpl">
          <el-input v-model="form.tpl" placeholder="请输入自定义的模板" />
        </el-form-item>
        <el-form-item label="SEO标题" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="请输入SEO标题" />
        </el-form-item>
        <el-form-item label="SEO关键字" prop="seoKeywords">
          <el-input v-model="form.seoKeywords" placeholder="请输入SEO关键字" />
        </el-form-item>
        <el-form-item label="SEO描述" prop="seoDesc">
          <el-input v-model="form.seoDesc" placeholder="请输入SEO描述" />
        </el-form-item>
        <el-form-item label="tag标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入tag标签" />
        </el-form-item>
        <el-form-item label="主题属性" prop="attr">
          <el-input v-model="form.attr" placeholder="请输入主题属性" />
        </el-form-item>
        <el-form-item label="内容标识串" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入内容标识串" />
        </el-form-item>
        <el-form-item label="CSS样式" prop="style">
          <el-input v-model="form.style" placeholder="请输入CSS样式" />
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
import { TotalList, getList, delList, addList, updateList } from "@/api/system/list";

export default {
  name: "List",
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
      // 内容主表格数据
      TotalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        cateId: null,
        moduleId: null,
        projectId: null,
        siteId: null,
        title: null,
        dateline: null,
        lastdate: null,
        sort: null,
        status: null,
        hidden: null,
        hits: null,
        tpl: null,
        seoTitle: null,
        seoKeywords: null,
        seoDesc: null,
        tag: null,
        attr: null,
        replydate: null,
        userId: null,
        identifier: null,
        integral: null,
        style: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "0为根主题，其他ID对应list表的id字段不能为空", trigger: "blur" }
        ],
        cateId: [
          { required: true, message: "分类ID不能为空", trigger: "blur" }
        ],
        moduleId: [
          { required: true, message: "模块ID不能为空", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "项目ID不能为空", trigger: "blur" }
        ],
        siteId: [
          { required: true, message: "网站ID不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "主题不能为空", trigger: "blur" }
        ],
        dateline: [
          { required: true, message: "发布时间不能为空", trigger: "blur" }
        ],
        lastdate: [
          { required: true, message: "最后修改时间不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "0未审核，1已审核不能为空", trigger: "change" }
        ],
        hidden: [
          { required: true, message: "0显示，1隐藏不能为空", trigger: "blur" }
        ],
        hits: [
          { required: true, message: "查看次数不能为空", trigger: "blur" }
        ],
        tpl: [
          { required: true, message: "自定义的模板不能为空", trigger: "blur" }
        ],
        seoTitle: [
          { required: true, message: "SEO标题不能为空", trigger: "blur" }
        ],
        seoKeywords: [
          { required: true, message: "SEO关键字不能为空", trigger: "blur" }
        ],
        seoDesc: [
          { required: true, message: "SEO描述不能为空", trigger: "blur" }
        ],
        tag: [
          { required: true, message: "tag标签不能为空", trigger: "blur" }
        ],
        attr: [
          { required: true, message: "主题属性不能为空", trigger: "blur" }
        ],
        replydate: [
          { required: true, message: "最后回复时间不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "会员ID号，为0表示管理员发布不能为空", trigger: "blur" }
        ],
        identifier: [
          { required: true, message: "内容标识串不能为空", trigger: "blur" }
        ],
        integral: [
          { required: true, message: "财富基于，用于计算财富的基础量不能为空", trigger: "blur" }
        ],
        style: [
          { required: true, message: "CSS样式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询内容主列表 */
    getList() {
      this.loading = true;
      TotalList(this.queryParams).then(response => {
        this.TotalList = response.rows;
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
        parentId: null,
        cateId: null,
        moduleId: null,
        projectId: null,
        siteId: null,
        title: null,
        dateline: null,
        lastdate: null,
        sort: null,
        status: null,
        hidden: null,
        hits: null,
        tpl: null,
        seoTitle: null,
        seoKeywords: null,
        seoDesc: null,
        tag: null,
        attr: null,
        replydate: null,
        userId: null,
        identifier: null,
        integral: null,
        style: null
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
      this.title = "添加内容主";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getList(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改内容主";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateList(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addList(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除内容主编号为"' + ids + '"的数据项？').then(function() {
        return delList(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/list/export', {
        ...this.queryParams
      }, `list_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
