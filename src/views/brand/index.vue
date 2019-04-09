<template>
  <div>
    <!-- 筛选条件 -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>品牌名称</h4>
          <el-input v-model="query.name" placeholder="按品牌名称模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>商家</h4>
          <el-input v-model="query.seller" placeholder="按商家模糊查询"></el-input>
        </div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="danger" @click="handlePublishSeller">添加</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 93%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="品牌名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商家"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.seller }} </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteList(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="width: 100%; text-align: center; margin-top: 20px;"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentPage"
      :current-page.sync="page"
      :page-count="total_page">
    </el-pagination>
    <!-- 修改和添加弹出框 -->
    <el-dialog :title="dialogTitle" :center="true" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form class="public-form" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" :model="updateDialog">
        <el-form-item class="dialog-input" label="品牌名称" prop="name">
          <el-input v-model="updateDialog.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item class="dialog-input" label="商家名称" prop="sellerId">
          <el-select v-model="updateDialog.sellerId" filterable placeholder="请选择商家名称">
            <el-option
              v-for="item in sellersList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pagination } from '@/mixins';
import { getBrandList, getSellersListNoPage, publicBrandInfo, modeifyBrandInfo } from '@/api/goods';

let publicDateInit = {
  name: '',
  sellerId: '',
  del_flag: ''
}

export default {
  name: 'brandList',
  mixins: [pagination],
  data () {
    return {
      query: {
        name: '',
        seller: '',
      },
      formData: [],
      updateDialog: {

      },
      rules: {
        name: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'}
        ],
        sellerId: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'}
        ],
      },
      sellersList: [],
      dialogTitle: '修改品牌信息',
      dialogType: 'modeify',
      dialogFormVisible: false,
    }
  },
  async mounted() {
    await this.init();
    getSellersListNoPage()
    .then( res => {
      this.sellersList = res.data.list;
    })
  },
  methods: {
    // 发布品牌按钮
    async handlePublic(formName) {
      if(this.dialogType == 'publish') {
        this.updateDialog.del_flag = 0;
        // 发布品牌信息
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let res = await publicBrandInfo(this.updateDialog);
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.dialogFormVisible = false;
            }else {
              this.$message.error(res.data.msg);
            }
          }else {
            console.log('error submit!!');
            return false;
          }
        })

      }else {
        // 修改品牌信息
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let params = {
              id: this.updateDialog.id,
              name: this.updateDialog.name,
              sellerId: this.updateDialog.sellerId,
              del_flag: this.updateDialog.del_flag
            }
            let res = await modeifyBrandInfo(params);
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.dialogFormVisible = false;
            }else {
              this.$message.error(res.data.msg);
            }
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    // 添加品牌
    handlePublishSeller() {
      this.dialogType = 'publish';
      this.dialogTitle = '新增品牌信息';
      this.updateDialog = {...publicDateInit};
      this.dialogFormVisible = true;
    },
    // 模糊筛选品牌列表
    async handleQuery() {
      await this.init();
    },
    // 修改品牌信息
    handleEdit(index, item) {
      this.dialogType = 'modeify';
      this.dialogTitle = '修改品牌信息';
      this.updateDialog = {...item};
      this.dialogFormVisible = true;
    },
    // 删除品牌
    handleDeleteList(index, item) {

    },
    async init() {
      return new Promise(async (resolve, reject) => {
        let query = {page: this.page, ...this.query};
        let res = await getBrandList(query);
        this.formData = res.data.list;
        this.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    },
    // 关闭弹窗
    dialogClose() {
      this.updateDialog = Object.assign({}, publicDateInit);
    }
  }
}
</script>

<style lang='scss' scoped>


</style>
