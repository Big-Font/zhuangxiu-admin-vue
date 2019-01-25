<template>
 <div class="spike">
   <!-- 查询和添加 -->
  <div class="header-option">
    <div>
      <!-- <el-tag>活动显示位置</el-tag> -->
      <div class="item">
        <h4>秒杀活动位置</h4>
        <el-radio v-model="query.place" label="0">全部</el-radio>
        <el-radio v-model="query.place" label="1">首页推荐位</el-radio>
        <el-radio v-model="query.place" label="2">首页列表</el-radio>
        <el-radio v-model="query.place" label="3">其他位置</el-radio>
      </div>
      <div class="item">
        <h4>秒杀活动状态</h4>
        <el-radio v-model="query.type" label="0">全部</el-radio>
        <el-radio v-model="query.type" label="1">进行中</el-radio>
        <el-radio v-model="query.type" label="2">已结束</el-radio>
        <el-radio v-model="query.type" label="3">未开始</el-radio>
      </div>
    </div>

    <div>
      <el-button class="btn" type="primary" @click="handleQuery">查询秒杀活动</el-button>
      <el-button class="btn" type="danger" @click="spikeDialog = true;">发布秒杀活动</el-button>
    </div>
  </div>
   <!-- 秒杀活动列表 -->
   <el-table
      :data="bannerData"
      :border="true"
      style="width: 90%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.spike_id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="秒杀名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.spike_name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="活动简图"
        align="center">
        <template slot-scope="scope">
          <img style="width: 100px;height: 60px;" :src="scope.row.spike_img" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="活动位置"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.spike_place == 1">首页推荐位</div>
          <div v-if="scope.row.spike_place == 2">首页列表</div>
          <div v-if="scope.row.spike_place == 3">其他位置</div>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.spike_start_time}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.spike_end_time}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="活动状态"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.spike_type == 1">未开始</div>
          <div v-if="scope.row.spike_type == 2">进行中</div>
          <div v-if="scope.row.spike_type == 3">已结束</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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
      :total="pageInfo.total_page">
    </el-pagination>
    <!-- 修改的弹出框 -->
    <el-dialog title="发布秒杀活动" :fullscreen="true" :visible.sync="spikeDialog" center @close="dialogClose">
      <el-form class="public-form" label-position="left" :rules="rules" ref="ruleForm" label-width="80px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="活动名称" prop="name">
            <el-input v-model="updateDialog.name" placeholder="请输入秒杀活动名称"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="产品价格" prop="price">
            <el-input v-model="updateDialog.price" placeholder="请输入秒杀活动产品价格"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动介绍" prop="activity">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入活动介绍"
              v-model="updateDialog.activity">
            </el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="商家介绍" prop="seller">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入商家介绍"
              v-model="updateDialog.seller">
            </el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商品库存" prop="stock">
            <el-input v-model="updateDialog.stock" placeholder="请输入秒杀活动商品库存"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="活动位置" prop="place" >
            <el-radio v-model="updateDialog.place" label="1">首页推荐位</el-radio>
            <el-radio v-model="updateDialog.place" label="2">首页列表</el-radio>
            <el-radio v-model="updateDialog.place" label="3">其他位置</el-radio>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="开始时间" prop="startTime">
            <el-date-picker
              v-model="updateDialog.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="dialog-input" label="结束时间" prop="endTime">
            <el-date-picker
              v-model="updateDialog.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动简图" prop="img">
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
          <h2>商品介绍</h2>
          <wang-editor class="wangUeitors" ref="wangUeitors"></wang-editor>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="spikeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
import { upload } from '@/mixins';
import WangEditor from '@/components/WangEditor';
import { spikeActiveList, spikeActivePublish } from '@/api/spike';

const publicDateInit = {
        stock: '',
        seller: '',
        goods: '',
        activity: '',
        price: '',
        name: '',
        startTime: '',
        endTime: '',
        img: '',
        place: '3',
      }

 export default {
   name: 'spikeList',
   mixins: [upload],
   data () {
     return {
       query: {
        place: '0',
        type: '0',
        page: '1'
       },
       bannerData: [],
       pageInfo: {
         total_page: 0,
         page: 0,
       },
       spikeDialog: false,
       updateDialog: {
          stock: '',
          seller: '',
          goods: '',
          activity: '',
          price: '',
          name: '',
          startTime: '',
          endTime: '',
          img: '',
          place: '3',
       },
       rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ],
        activity: [
          {required: true, message: '请输入活动介绍', trigger: 'blur'}
        ],
        seller: [
          {required: true, message: '请输入活动介绍', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入活动介绍', trigger: 'blur'}
        ],
        startTime: [
          {required: true, message: '请选择活动开始时间', trigger: 'change' }
        ],
        endTime: [
          {required: true, message: '请选择活动结束时间', trigger: 'change' }
        ],
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
     async init() {
        return new Promise( async (resolve, reject) => {
          let res = await spikeActiveList(this.query);
          this.bannerData = res.data.list;
          this.pageInfo = { page: res.data.page, total_page: res.data.total_page };
          resolve()
        })
     },
     handleEdit(index, item) {
      //  this.updateDialog = item;
      //  this.spikeDialog = true;
     },
     async handlePublic(formName) {
        this.updateDialog.goods = this.$refs.wangUeitors.getwangUditorHtml();
        if(!this.updateDialog.goods) {
          this.$message.error('请填写商品介绍，用于显示活动详情');
          return;
        }
        if(!this.uploadImgUrl){
          this.$message.error('请上传活动简图');
          return;
        }else {
          this.updateDialog.img = this.uploadImgUrl;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let res = await spikeActivePublish(this.updateDialog)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init()
              this.spikeDialog = false;
            }else {
              this.$message.error(res.data.msg);
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
     },
     async handleQuery() {
       await this.init();
     },
     dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      this.updateDialog = publicDateInit;
    },
   }
 }
</script>

<style lang='scss' scoped>
.spike{
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
}

</style>
