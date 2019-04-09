<template>
  <div>
    <!-- 表头 -->
    <div class="header-option">
      <div>
        <el-button type="primary" icon="el-icon-edit" @click="addBanner">添加banner</el-button>
      </div>
    </div>
    <el-table
      :data="bannerData"
      :border="true"
      style="width: 93%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.banner_id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.banner_name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="图片地址"
        align="center"
        width="300">
        <template slot-scope="scope">
          <img style="width:260px;height:180px;" :src="scope.row.banner_url" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">外部链接</div>
          <div v-if="scope.row.type == 1">装修案例</div>
          <div v-if="scope.row.type == 2">秒杀活动</div>
          <div v-if="scope.row.type == 3">装修资讯</div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型id"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.infoId}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="跳转链接"
        align="center"
        width="180">
        <template slot-scope="scope">
          <div>{{scope.row.type === '0' ? scope.row.banner_path : '非外部链接'}}</div>
          <el-button v-if="scope.row.type === '0'" type="success" size="mini"  @click='handleCopy(scope.row.banner_path,$event)'>复制链接</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.banner_update_time.split(' ')[0]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 发布和修改弹窗 -->
    <el-dialog :title="dialogTitle" :center="true" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form :rules="rules" ref="ruleForm" :model="form">
        <el-form-item label="id" :label-width="formLabelWidth" v-if="form.banner_id">
          <div>{{form.banner_id}}</div>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="banner_name">
          <el-input style="width: 400px;" v-model="form.banner_name" ></el-input>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <viewer  v-if="form.banner_url" :images="form.banner_urls">
          <img style="width: 100px;height: 60px;" :src="form.banner_url" alt="">
          </viewer>
          <el-upload
            class="upload-demo"
            :on-remove="dialogClose"
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
        <el-form-item label="类型选择" :label-width="formLabelWidth" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type != '0'" label="内部链接跳转id" :label-width="formLabelWidth">
          <el-input style="width: 400px;" v-model="form.infoId" ></el-input>
        </el-form-item>
        <el-form-item v-else label="跳转链接" :label-width="formLabelWidth">
          <el-input style="width: 400px;" v-model="form.banner_path" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from '@/config'
import { mapGetters } from 'vuex'
import { getBannerList, bannerModify, bannerPublic } from '@/api/banner';
import clip from '@/utils/clipboard';

let formInit = {
  banner_name: '',
  banner_url: '',
  type: '0',
  infoId: null,
  banner_path: null,
}

 export default {
   data () {
     return {
       typeOptions: [
          { value: '0', label: '外部链接'},
          { value: '1', label: '装修案例'},
          { value: '2', label: '秒杀活动'},
          { value: '3', label: '装修资讯'},
       ],
       bannerData: [],
       form: {},
       rules: {

       },
       fileList: [],
       dialogFormVisible: false,
       formLabelWidth: '160px',
       actionBaseUrl: '',
       uploadImgUrl: '',
       dialogTitle: 'banner信息修改'
     }
   },
   computed: {
    ...mapGetters([
      'token'
    ]),
    authHeader: function() {
      return {
        'authorization': `Bearer ${this.token}`
      }
    },
  },
   async mounted() {
     this.actionBaseUrl = `${baseUrl}/upload/banner`;
     this.bannerData = await this.init();
   },
   methods: {
      async init() {
        return new Promise( async (resolve, reject) => {
          try{
            let res = await getBannerList();
            resolve(res.data.list)
          }catch(err) {
            this.$message.error(err);
            reject(err);
          }
        })
      },
      // 修改按钮
      handleEdit(index, row) {
        this.form = {...row};
        this.dialogFormVisible = true;
        this.dialogTitle = 'banner信息修改';
      },
      // 添加按钮
      addBanner() {
        this.form = {...formInit};
        this.dialogFormVisible = true;
        this.dialogTitle = '添加banner';
      },
      dialogClose() {
        this.fileList = [];
        this.uploadImgUrl = '';
      },
      async dialogConfirm() {
        if(!this.form.banner_name) {
          this.$message.error('请填写banner的名称');
          return;
        }
        if(this.form.type === '0') {
          // 外部链接，必须填写 链接地址
          if(!this.form.banner_path) {
            this.$message.error('您选择的是外部类型，必须填写外部链接的地址');
            return;
          }
        }else if(this.form.type === '1' || this.form.type === '2') {
          // 秒杀活动 、 装修工案例 必须填写对应的id
          if(!this.form.infoId) {
            this.$message.error('您选择的是内部链接，必须填写内部链接跳转id');
            return;
          }
        }else {
            this.$message.error('目前系统暂时没有上线装修咨询，请选择其他类型');
            return;
          }
        if(this.dialogTitle === 'banner信息修改') {
          // 修改banner
          try{
            let res = await bannerModify({
              banner_id: this.form.banner_id,
              banner_url: this.uploadImgUrl ? this.uploadImgUrl : this.form.banner_url,
              banner_path: this.form.type != '0' ? null : this.form.banner_path,
              banner_name: this.form.banner_name,
              type: this.form.type,
              infoId: this.form.infoId ? this.form.infoId : null
            });
            this.$message({
              message: res.data.msg,
              type: 'success',
              center: true
            });
            this.bannerData = await this.init();
            this.dialogFormVisible = false;
          }catch(err) {
            this.$message.error(err);
          }
        }else if(this.dialogTitle === '添加banner') {
          // 发布banner
          if(!this.uploadImgUrl) {
            this.$message.error('请上传图片，作为banner的背景图');
            return;
          }else {
            this.form.banner_url = this.uploadImgUrl;
          }
          let params = {
            url: this.form.banner_url,
            path: this.form.banner_path,
            name: this.form.banner_name,
            type: Number(this.form.type),
            infoId: this.form.infoId ? this.form.infoId : null
          }
          let res = await bannerPublic(params);
          if(res.data.code === 0) {
            this.$message({
              message: res.data.msg,
              type: 'success',
              center: true
            });
            this.bannerData = await this.init();
            this.dialogFormVisible = false;
          }else {
            this.$message.error(res.data.msg);
            return;
          }
        }
      },
      fileUpload(response, file, fileList) {
        if(response.code === 0) {
          this.uploadImgUrl = response.fileList[0];
        }else {
          this.$message.error('图片上传失败');
        }
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      // 复制链接
      handleCopy(text, event) {
        clip(text, event)
      },
   }
 }
</script>

<style lang='scss' scoped>

</style>
