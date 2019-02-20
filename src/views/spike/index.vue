<template>
 <div class="spike">
   <!-- 查询和添加 -->
  <div class="header-option">
    <div>
      <!-- <el-tag>活动显示位置</el-tag> -->
      <div class="item">
        <h4>秒杀活动位置</h4>
        <el-select v-model="query.place" placeholder="请选择">
          <el-option
            v-for="item in placeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <h4>秒杀活动状态</h4>
        <el-select v-model="query.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button style="margin-left: 50px;" class="btn" type="primary" @click="handleQuery">查询秒杀活动</el-button>
      <el-button class="btn" type="danger" @click="publicSpikeList">发布秒杀活动</el-button>
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
          <div>{{ scope.row.id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="秒杀名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="活动简图"
        align="center">
        <template slot-scope="scope">
          <img style="width: 100px;height: 60px;" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="活动位置"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.place == 1">首页推荐位</div>
          <div v-if="scope.row.place == 2">首页列表</div>
          <div v-if="scope.row.place == 3">其他位置</div>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.startTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.endTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="活动状态"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">未开始</el-tag>
          <el-tag type="success" v-if="scope.row.type == 2">进行中</el-tag>
          <el-tag type="info" v-if="scope.row.type == 3">已结束</el-tag>
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
      :current-page.sync="pageInfo.page"
      :page-count="pageInfo.total_page">
    </el-pagination>
    <!-- 修改的弹出框 -->
    <el-dialog :title="dialogTitle" :fullscreen="true" :visible.sync="spikeDialog" center @close="dialogClose">
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
          <h2>商品介绍</h2>
          <wang-editor v-if="spikeDialog" class="wangUeitors" ref="wangUeitors" :editorDefault="editorDefault"></wang-editor>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="spikeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看的弹出框 -->
    <el-dialog title="装修案例详情" :fullscreen="true" :visible.sync="listDialog" center>
      <el-form class="public-form" label-position="left" label-width="100px" :model="showDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="活动名称">
            <div>{{showDialog.name}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="产品价格" prop="price">
            <div>{{showDialog.price}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动介绍">
            <div>{{showDialog.activity}}</div>
            <!-- <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入活动介绍"
              :disabled="true"
              v-model="showDialog.activity">
            </el-input> -->
          </el-form-item>
          <el-form-item class="dialog-input" label="商家介绍">
            <div>{{showDialog.seller}}</div>
            <!-- <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入商家介绍"
              :disabled="true"
              v-model="showDialog.seller">
            </el-input> -->
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商品库存">
            <div>{{showDialog.stock}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="活动位置">
            <el-radio v-model="showDialog.place" label="1">首页推荐位</el-radio>
            <el-radio v-model="showDialog.place" label="2">首页列表</el-radio>
            <el-radio v-model="showDialog.place" label="3">其他位置</el-radio>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="开始时间">
            <div>{{showDialog.startTime}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="结束时间">
            <div>{{showDialog.endTime}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="活动简图" prop="img">
            <img v-if="showDialog.img" style="width:260px;height:180px;" :src="showDialog.img" alt="">
          </el-form-item>
          <div class="dialog-input"></div>
        </div>
        <div class="ueditor">
          <h2>商品介绍</h2>
          <div class="show-content" v-html="showDialog.goods"></div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="listDialog = false">关闭</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
import { upload } from '@/mixins';
import WangEditor from '@/components/WangEditor';
import { spikeActiveList, querySpikeDetail, spikeActivePublish, modifySpikeActive } from '@/api/spike';

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
       dialogType: 'publish',
       dialogTitle: '修改秒杀活动',
       query: {
        place: '0',
        type: '0',
        page: '1'
       },
       placeOptions: [
         { value: '0', label: '全部' },
         { value: '1', label: '首页推荐位' },
         { value: '2', label: '首页列表' },
         { value: '3', label: '其他位置' },
       ],
       typeOptions: [
         { value: '0', label: '全部' },
         { value: '1', label: '未开始' },
         { value: '2', label: '进行中' },
         { value: '3', label: '已结束' },
       ],
       bannerData: [],
       pageInfo: {
         total_page: 0,
         page: 0,
       },
       spikeDialog: false,
       listDialog: false,
       showDialog: {},
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
       },
       editorDefault: ''
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
     // 发布秒杀活动按钮，弹出弹窗
     publicSpikeList() {
        this.updateDialog  = publicDateInit;
        this.editorDefault = '';
        this.dialogTitle = '发布秒杀活动';
        this.dialogType = 'publish';
        this.spikeDialog = true;
     },
     // 查看秒杀活动
     async handleEditList(index, item) {
        let res = await querySpikeDetail({id: item.id});
        if(res.data.code === 0) {
          this.showDialog  = res.data.data;
          this.listDialog = true;
        }else {
          this.$message.error('获取秒杀活动详情失败');
        }
     },
     // 修改秒杀活动按钮,弹出弹窗
     async handleEdit(index, item) {
        let res = await querySpikeDetail({id: item.id});
        if(res.data.code === 0) {
          let data = res.data.data
          this.updateDialog  = data;
          this.editorDefault = data.goods;
          this.dialogTitle = '修改秒杀活动';
          this.dialogType = 'modeify';
          this.spikeDialog = true;
        }else {
          this.$message.error('获取秒杀活动详情失败');
        }
     },
     async handlePublic(formName) {
        this.updateDialog.goods = this.$refs.wangUeitors.getwangUditorHtml();
        if(!this.updateDialog.goods) {
          this.$message.error('请填写商品介绍，用于显示活动详情');
          return;
        }
       if(this.dialogType === 'publish') {
         //  发布秒杀活动
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
       }else {
         //  修改秒杀活动
          // 修改装修案例  this.dialogType === 'modeify'
        console.log(`图片上传：${this.uploadImgUrl}，默认图片： ${this.updateDialog.img}`)
        this.updateDialog.img = this.uploadImgUrl ? this.uploadImgUrl : this.updateDialog.img;
        if(!this.updateDialog.img) {
          this.$message.error('请上传活动简图');
          return;
        }

        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let query = {
              id: this.updateDialog.id,
              stock: this.updateDialog.stock,
              seller: this.updateDialog.seller,
              goods: this.updateDialog.goods,
              activity: this.updateDialog.activity,
              price: this.updateDialog.price,
              name: this.updateDialog.name,
              startTime: this.updateDialog.startTime,
              endTime: this.updateDialog.endTime,
              img: this.updateDialog.img,
              place: this.updateDialog.place,
            }
            let res = await modifySpikeActive(query)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.spikeDialog = false;
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
     async handleQuery() {
       await this.init();
     },
     dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      this.updateDialog = {...publicDateInit};
    },
    async handleCurrentPage() {
      this.query.page = this.pageInfo.page;
      await this.init();
    }
   }
 }
</script>

<style lang='scss' scoped>
.spike{
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
