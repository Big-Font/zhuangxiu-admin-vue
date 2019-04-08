<template>
  <div class="worker">
    <!-- 头部模糊搜索  type, isOver, phone -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>注册手机</h4>
          <el-input v-model="query.userPhone" placeholder="按注册手机号模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>填写手机</h4>
          <el-input v-model="query.phone" placeholder="按填写手机号模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>类型</h4>
          <el-select v-model="query.type" placeholder="按类型搜索">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

      </div>
      <div>
        <div class="item">
          <h4>状态搜索</h4>
          <el-select v-model="query.isOver" placeholder="按状态搜索">
            <el-option
              v-for="item in isOverList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 是否催单 -->
        <div class="item">
          <h4>是否催单</h4>
          <el-select v-model="query.ishurry" placeholder="按状态搜索">
            <el-option
              v-for="item in ishurryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
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
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.title }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.address }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="注册手机号"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.userPhone }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="填写的手机号"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.phone }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.username }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1">安装</div>
          <div v-if="scope.row.type == 2">维修</div>
        </template>
      </el-table-column>
      <el-table-column
        label="催单"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.ishurry == -1">催单</el-tag>
          <el-tag type="info" v-if="scope.row.ishurry == 0">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isOver == 1">未结束</el-tag>
          <el-tag type="info" v-if="scope.row.isOver == 2">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope" class="handle-btn">
          <el-button
            size="mini"
            type="primary"
            @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="width: 100%; text-align: center; margin-top: 20px;"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentPage"
      :current-page.sync="query.page"
      :page-count="total_page">
    </el-pagination>
    <!-- 查看详情提示框 -->
    <el-dialog title="找师傅详情" :visible.sync="detailDialog" center @close="dialogClose">
      <el-form class="public-form" label-position="left" label-width="100px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="id">
            <div>{{updateDialog.id}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="标题">
            <div>{{updateDialog.title}}</div>
          </el-form-item>
        </div>
      </el-form>
      <el-form class="public-form" label-position="left" label-width="100px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="地址">
            <div>{{updateDialog.address}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="手机号">
            <div>{{updateDialog.userPhone}}&nbsp;&nbsp;或&nbsp;&nbsp;{{updateDialog.phone}}</div>
          </el-form-item>
        </div>
      </el-form>
      <el-form class="public-form" label-position="left" label-width="100px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="类型">
            <div v-if="updateDialog.type == 1">安装</div>
            <div v-if="updateDialog.type == 2">维修</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="状态">
            <el-tag type="success" v-if="updateDialog.isOver == 1">未结束</el-tag>
            <el-tag type="info" v-if="updateDialog.isOver == 2">已结束</el-tag>
          </el-form-item>
        </div>
      </el-form>
      <el-form class="public-form" label-position="left" label-width="100px" :model="updateDialog">
        <div class="item" >
          <el-form-item class="dialog-input" label="详情">
            <div v-html="updateDialog.details"></div>
          </el-form-item>
          <el-form-item class="dialog-input">
          </el-form-item>
        </div>
      </el-form>
      <el-form class="public-form-oneline" label-position="left" label-width="100px" :model="updateDialog">
        <div class="item" >
          <el-form-item class="dialog-input" label="照片">
            <div v-if="Array.isArray(updateDialog.imgs)" style="width: 100%;" class="clearfix">
              <viewer :images="updateDialog.imgs">
                <img class="fl" style="width:150px; height: 100px;" v-for="(item, index) in updateDialog.imgs" :key="index" :src="item" alt="" >
              </viewer>
            </div>
            <div v-else>
              <viewer :images="updateDialog.imgs">
                <img class="fl" style="width:150px; height: 100px;" :src="updateDialog.imgs" alt="" >
              </viewer>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="publicDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="detailDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pagination } from '@/mixins';
import { getFindWorkerList, handleWorkerType } from '@/api/worker';

export default {
  name: 'workerList',
  mixins: [pagination],
  data () {
    return {
      formData: [],
      query: {
        page: 1,
        type: '0',
        isOver: '0',
        ishurry: '99',
        phone: '',
        userPhone: ''
      },
      //  *   @params  type   类型：1-安装，2-维修  0-全部
    // *   @params  isOver 是否已经结束： 1-未结束，2-已结束  0-全部
      typeList: [
        {value: '0', label: '全部'},
        {value: '1', label: '安装'},
        {value: '2', label: '维修'}
      ],
      isOverList: [
        {value: '0', label: '全部'},
        {value: '1', label: '未结束'},
        {value: '2', label: '已结束'}
      ],
      ishurryList: [
        {value: '99', label: '全部'},
        {value: '0', label: '正常'},
        {value: '-1', label: '催单'}
      ],
      detailDialog: false,
      updateDialog: {

      }
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // 头部模糊搜索
    async handleQuery() {
      await this.init();
    },
    async init() {
      return new Promise( async (resolve, reject) => {
        let res = await getFindWorkerList(this.query);
        this.formData = res.data.list;
        this.query.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    },
    handleDetail(index, item) {
      console.log(item)
      this.updateDialog = item;
      this.detailDialog = true;
    },
    async handleEdit(index, item) {
      this.$confirm('请确定已经安排师傅上门修理再确定此条状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          if(item.isOver != 1) {
            this.$message.error('此条找师傅状态不是未结束,不能标记为已结束！');
            return;
          }
          let res = await handleWorkerType({
            id: item.id,
            state: item.isOver
          });
          if(res.data.code === 0) {
            await this.init();
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
          }else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
    },
    // 关闭弹出框
    dialogClose() {
      this.updateDialog = {}
    }
  }
}
</script>

<style lang='scss' scoped>
.handle-btn{
  display: flex;
  justify-content: center;
  align-items: center;
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
.public-form-oneline{
  .item{
    display: flex;
    justify-content: center;
  }
  .dialog-input{
    width: 85%;
  }
}
</style>
