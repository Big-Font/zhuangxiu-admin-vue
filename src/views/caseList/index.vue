<template>
  <div class="case-list">
    <!-- 查找和添加 title, author, recommend, style, company -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>案例标题</h4>
          <el-input v-model="query.title" placeholder="按案例标题模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>作者</h4>
          <el-input v-model="query.author" placeholder="按作者模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>装修风格</h4>
          <el-input v-model="query.style" placeholder="按装修风格模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>装修公司</h4>
          <el-input v-model="query.company" placeholder="按装修公司模糊查询"></el-input>
        </div>
      </div>
      <div>
        <div class="item">
          <h4>推荐首页</h4>
          <el-radio v-model="query.recommend" label="">全选</el-radio>
          <el-radio v-model="query.recommend" label="1">推荐</el-radio>
          <el-radio v-model="query.recommend" label="0">不推荐</el-radio>
        </div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="danger" @click="publicCaseList">添加</el-button>
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
        label="标题"
        align="center"
        width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.title }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="图片地址"
        align="center"
        width="300">
        <template slot-scope="scope">
          <img style="width:260px;height:180px;" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.author}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.update_time}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否推荐"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.recommend == 0">不推荐</div>
          <div v-if="scope.row.recommend == 1">推荐</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditList(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 添加和发布 -->
    <el-dialog :title="dialogTitle" :fullscreen="true" :visible.sync="publicDialog" center @close="dialogClose">
      <el-form class="public-form" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="标题" prop="title">
            <el-input v-model="updateDialog.title" placeholder="请输入装修案例标题"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="作者" prop="author">
            <el-input v-model="updateDialog.author" placeholder="请输入装修案例作者"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="使用面积" prop="area">
            <el-input v-model="updateDialog.area" placeholder="请输入案例的使用面积"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="户型" prop="apartment">
            <el-input v-model="updateDialog.apartment" placeholder="请输入案例的户型"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="装修总花费" prop="spend">
            <el-input v-model="updateDialog.spend" placeholder="请输入案例的装修总花费"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="装修风格" prop="style">
            <el-input v-model="updateDialog.style" placeholder="请输入案例的装修风格"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="装修公司" prop="company">
            <el-input v-model="updateDialog.company" placeholder="请输入案例的装修公司"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="推荐首页" prop="recommend" >
            <el-radio v-model="updateDialog.recommend" label="0">推荐</el-radio>
            <el-radio v-model="updateDialog.recommend" label="1">不推荐</el-radio>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动简图" prop="img">
            <img v-if="updateDialog.img" style="width:260px;height:180px;" :src="updateDialog.img" alt="">
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
          <div class="dialog-input"></div>
        </div>
        <div class="ueditor">
          <h2>文章内容</h2>
          <wang-editor v-if="publicDialog" class="wangUeitors"
          :editorDefault="editorDefault"
          :nameid="nameid"
          ref="wangUeitors"></wang-editor>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="publicDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog title="装修案例详情" :fullscreen="true" :visible.sync="listDialog" center>
      <el-form class="public-form" label-position="left" ref="ruleForm" label-width="100px" :model="showDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="标题" prop="title">
            <div>{{showDialog.title}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="作者" prop="author">
            <div>{{showDialog.author}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="使用面积" prop="area">
            <div>{{showDialog.area}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="户型" prop="apartment">
            <div>{{showDialog.apartment}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="装修总花费" prop="spend">
            <div>{{showDialog.spend}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="装修风格" prop="style">
            <div>{{showDialog.style}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="装修公司" prop="company">
            <div>{{showDialog.company}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="推荐首页" prop="recommend" >
            <el-radio v-model="showDialog.recommend" label="0">推荐</el-radio>
            <el-radio v-model="showDialog.recommend" label="1">不推荐</el-radio>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动简图" prop="img">
            <img v-if="showDialog.img" style="width:260px;height:180px;" :src="showDialog.img" alt="">
          </el-form-item>
          <div class="dialog-input"></div>
        </div>
        <div class="ueditor">
          <h2>文章内容</h2>
          <div class="show-content" v-html="showDialog.content"></div>
          <!-- <wang-editor v-if="publicDialog" class="wangUeitors" :editorDefault="editorDefault" ref="wangUeitors"></wang-editor> -->
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="listDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upload, wangEditorNameid } from '@/mixins';
import WangEditor from '@/components/WangEditor';
import { caseList, fitupCasePublic, fitupcaseModify } from '@/api/caseList';

const publicDateInit = {
  title: '',
  author: '',
  recommend: '0',
  titleImg: '',
  area: '',
  apartment: '',
  spend: '',
  style: '',
  company: '',
  content: ''
}

export default {
  name: 'caseList',
  mixins: [upload, wangEditorNameid],
  data () {
    return {
      query: {
        title: '',
        author: '',
        recommend: '',
        style: '',
        company: ''
      },
      dialogTitle: '发布装修案例',
      editorDefault: '',
      dialogType: 'publish',
      listDialog: false,
      page: 1,
      total_page: 0,
      formData: [],
      publicDialog: false,
      showDialog: {
        title: '',
        author: '',
        recommend: '',
        titleImg: '',
        area: '',
        apartment: '',
        spend: '',
        style: '',
        company: '',
        content: '',
      },
      updateDialog: {
        title: '',
        author: '',
        recommend: '0',
        titleImg: '',
        area: '',
        apartment: '',
        spend: '',
        style: '',
        company: '',
        content: '',
      },
      rules: {
        title: [
          {required: true, message: '请输入装修案例标题', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '请输入装修案例作者', trigger: 'blur'}
        ],
        recommend: [
          {required: true, message: '请选择是否推荐', trigger: 'change' }
        ],
        area: [
          {required: true, message: '请输入案例的户型面积', trigger: 'blur'}
        ],
        apartment: [
          {required: true, message: '请输入装修案例的户型', trigger: 'blur'}
        ],
        spend: [
          {required: true, message: '请输入装修案例的总花费', trigger: 'blur'}
        ],
        style: [
          {required: true, message: '请输入装修案例的装修风格', trigger: 'blur'}
        ],
        company: [
          {required: true, message: '请输入装修案例的装修公司', trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    WangEditor
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // 模糊搜索
    async handleQuery() {
      await this.init();
    },
    async init() {
      return new Promise( async (resolve, reject) => {
        let query = {...this.query, page: this.page};
        let res = await caseList(query);
        this.formData = res.data.list;
        this.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    },
    // 发布装修案例
    async handlePublic(formName) {
      this.updateDialog.content = this.$refs.wangUeitors.getwangUditorHtml();
      if(!this.updateDialog.content) {
        this.$message.error('请填写文章内容，用于展示装修案例详情');
        return;
      }
      if(this.dialogType === 'publish') {
        // 发布装修案例   dialogType = 'publish';
        if(!this.uploadImgUrl){
          this.$message.error('请上传活动简图');
          return;
        }else {
          this.updateDialog.titleImg = this.uploadImgUrl;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let res = await fitupCasePublic(this.updateDialog)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.publicDialog = false;
            }else {
              this.$message.error(res.data.msg);
            }
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(this.dialogType === 'modeify') {
        // 修改装修案例  this.dialogType === 'modeify'
        console.log(`图片上传：${this.uploadImgUrl}，默认图片： ${this.updateDialog.img}`)
        this.updateDialog.titleImg = this.uploadImgUrl ? this.uploadImgUrl : this.updateDialog.img;
        if(!this.updateDialog.titleImg) {
          this.$message.error('请上传活动简图');
          return;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let res = await fitupcaseModify(this.updateDialog)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.publicDialog = false;
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
    // 关闭发布对话框
    dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      // this.updateDialog = publicDateInit;
    },
    // 发布装修案例
    publicCaseList() {
      this.updateDialog  = publicDateInit;
      this.editorDefault = '';
      this.dialogTitle = '发布装修案例';
      this.dialogType = 'publish';
      this.publicDialog = true;
    },
    // 修改装修案例
    handleEdit(index, item) {
      this.updateDialog  = item;
      this.editorDefault = item.content;
      this.dialogTitle = '修改装修案例';
      this.dialogType = 'modeify';
      this.publicDialog = true;
    },
    // 查看装修案例
    handleEditList(index, item) {
      this.showDialog  = item;
      this.listDialog = true;
    },
    async handleCurrentPage() {
      await this.init();
    }
  }
}
</script>

<style lang='scss' scoped>
.case-list{
  padding: 30px 0;
}
.public-form{
  .item{
    display: flex;
    justify-content: center;
  }
  .dialog-input{
    width: 35%;
    margin-right: 50px;
  }
  .ueditor{
    >h2{
      text-align: center;
    }
    .wangUeitors{
      width: 80%;
      margin: 10px auto;
    }
  }
  .show-content{
    border: 1px solid #ccc;
    width: 680px;
    padding: 0 20px;
    margin: 10px auto;
    /deep/ img{
      width: 100%;
    }
  }
}
</style>
