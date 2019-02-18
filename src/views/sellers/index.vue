<template>
  <div>
    <!-- 筛选功能 -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>商家名称</h4>
          <el-input v-model="query.name" placeholder="按商家名称模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>商家地址</h4>
          <el-input v-model="query.address" placeholder="按商家地址模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>联系电话</h4>
          <el-input v-model="query.tel" placeholder="按联系电话模糊查询"></el-input>
        </div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="danger" @click="handlePublishSeller">添加</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 90%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="门店照片"
        align="center"
        width="150">
        <template slot-scope="scope">
          <img style="width:130px;height:90px;" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="商家名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商家地址"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.address }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.tel }} </div>
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
        <el-form-item class="dialog-input" label="商家名称" prop="name">
          <el-input v-model="updateDialog.name" placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item class="dialog-input" label="商家地址" prop="address">
          <el-input v-model="updateDialog.address" placeholder="请输入商家地址"></el-input>
        </el-form-item>
        <el-form-item class="dialog-input" label="联系电话" prop="tel">
          <el-input v-model="updateDialog.tel" placeholder="请输入商家联系电话"></el-input>
        </el-form-item>
        <el-form-item class="dialog-input" label="门店照片" prop="img">
            <img v-if="updateDialog.img" style="width:130px;height:90px;" :src="updateDialog.img" alt="">
            <el-upload
              class="upload-demo"
              :action="actionBaseUrl"
              :file-list="fileList"
              :headers="authHeader"
              :multiple="false"
              :limit="1"
              :on-success="fileUpload"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
import { upload, pagination } from '@/mixins';
import { getSellersList, publicSellerInfo, modeifySellerInfo } from '@/api/goods';

let publicDateInit = {
  name: '',
  address: '',
  tel: '',
  img: ''
};

export default {
  name: 'sellersList',
  mixins: [upload, pagination],
  data () {
    return {
      query: {
        name: '',
        address: '',
        tel: ''
      },
      formData: [],
      updateDialog: {

      },
      rules: {
        name: [
          {required: true, message: '请输入商家名称', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入商家地址', trigger: 'blur'}
        ],
        tel: [
          { required: true, message: '请输入商家联系电话', trigger: 'blur'},
          { min: 7, max: 11, message: '请输入座机号码或者手机号码', trigger: 'blur' }
        ],
      },
      dialogFormVisible: false,
      dialogTitle: '修改商家信息',
      dialogType: 'modeify',
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // 修改和发布商品信息确定按钮
    handlePublic(formName) {
      if(this.dialogType === 'publish') {
        // 发布商家信息
        if(!this.uploadImgUrl){
          this.$message.error('请上传商家店面照片');
          return;
        }else {
          this.updateDialog.img = this.uploadImgUrl;
        }

        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let res = await publicSellerInfo(this.updateDialog);
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
        // 修改商家信息
        this.updateDialog.img = this.uploadImgUrl ? this.uploadImgUrl : this.updateDialog.img;
        if(!this.updateDialog.img) {
          this.$message.error('请上传活动简图');
          return;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let params = {
              img: this.updateDialog.img,
              id: this.updateDialog.id,
              name: this.updateDialog.name,
              address: this.updateDialog.address,
              tel: this.updateDialog.tel,
              del_flag: this.updateDialog.del_flag
            }
            let res = await modeifySellerInfo(params);
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
    //  修改商家信息
    handleEdit(index, item) {
      this.dialogTitle = '修改商家信息';
      this.dialogType = 'modeify';
      this.updateDialog = {...item};
      this.dialogFormVisible = true;
    },
    // 删除商家
    async handleDeleteList(index, item) {
      console.log(item)
      this.$confirm('请确定是否真的删除此条商家信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {

          if(item.del_flag != 0) {
            this.$message.error('此商家已被屏蔽，无法删除');
            return;
          }
          /*
          *   删除商家操作
          */
         let params = {
            img: item.img,
            id: item.id,
            name: item.name,
            address: item.address,
            tel: item.tel,
            del_flag: 1
          }
          let res = await modeifySellerInfo(params);
          if(res.data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            await this.init();
            this.dialogFormVisible = false;
          }else {
            this.$message.error(res.data.msg);
          }

        }).catch((err) => {
          this.$message({
            type: 'info',
            message: `已取消删除操作`
          });
        });
    },
    // 发布新商家信息
    handlePublishSeller() {
      this.dialogTitle = '添加商家信息';
      this.dialogType = 'publish';
      this.updateDialog = publicDateInit;
      this.dialogFormVisible = true;
    },
    // 模糊搜索
    async handleQuery() {
      await this.init();
    },
    async init() {
      return new Promise(async (resovle, reject) => {
        let page = this.page;
        let query = {page, ...this.query};
        let res = await getSellersList(query);
        this.formData = res.data.list;
        this.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resovle();
      })
    },
    // 关闭发布对话框
    dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      this.updateDialog = publicDateInit;
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
