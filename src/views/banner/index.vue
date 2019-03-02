<template>
  <div>
    <el-table
      :data="bannerData"
      :border="true"
      style="width: 80%; margin: 20px auto;">
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
          <div>{{scope.row.type == 0 ? scope.row.banner_path : '非外部链接'}}</div>
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
    <!-- 修改弹窗 -->
    <el-dialog title="banner信息修改" :center="true" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form>
        <el-form-item label="id" :label-width="formLabelWidth">
          <div>{{form.banner_id}}</div>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input style="width: 400px;" v-model="form.banner_name" ></el-input>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <img style="width: 100px;height: 60px;" :src="form.banner_url" alt="">
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
        <el-form-item label="类型选择" :label-width="formLabelWidth">
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
        <el-button type="primary" @click="bannerModify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from '@/config'
import { mapGetters } from 'vuex'
import { getBannerList, bannerModify } from '@/api/banner';

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
       fileList: [],
       dialogFormVisible: false,
       formLabelWidth: '160px',
       actionBaseUrl: '',
       uploadImgUrl: ''
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
      handleEdit(index, row) {
        this.form = row;
        this.dialogFormVisible = true;
      },
      dialogClose() {
        this.fileList = [];
      },
      async bannerModify() {
        // if(!this.uploadImgUrl) this.$message.error();;
        try{
          let res = await bannerModify({
            banner_id: this.form.banner_id,
            banner_url: this.uploadImgUrl ? this.uploadImgUrl : this.form.banner_url,
            banner_path: this.form.type != '0' ? null : this.form.banner_path,
            banner_name: this.form.banner_name,
            type: this.form.type,
            infoId: this.form.infoId
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
      }
   }
 }
</script>

<style lang='scss' scoped>

</style>
