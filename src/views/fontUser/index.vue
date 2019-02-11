<template>
 <div class="m-user">
  <!-- 查询和添加 -->
  <div class="header-option">
    <div>
      <div class="item">
         <h4>手机号</h4>
         <el-input v-model="query.phone" placeholder="按手机号模糊查询"></el-input>
      </div>
      <div class="item">
        <h4>用户名</h4>
        <el-input v-model="query.username" placeholder="按用户名模糊查询"></el-input>
      </div>
      <div class="item">
        <h4>姓名</h4>
        <el-input v-model="query.name" placeholder="按姓名查询"></el-input>
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
      label="手机号"
      align="center">
      <template slot-scope="scope">
        <div>{{ scope.row.phone }} </div>
      </template>
    </el-table-column>
    <el-table-column
      label="真实姓名"
      align="center">
      <template slot-scope="scope">
        <div>{{ scope.row.name }} </div>
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
      label="用户昵称"
      align="center">
      <template slot-scope="scope">
        <div>{{ scope.row.username }} </div>
      </template>
    </el-table-column>
    <el-table-column
      label="性别"
      align="center">
      <template slot-scope="scope">
        <div>{{ scope.row.sex }} </div>
      </template>
    </el-table-column>
    <el-table-column
      label="年龄"
      align="center">
      <template slot-scope="scope">
        <div>{{ scope.row.age }} </div>
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

 </div>
</template>

<script>
import { pagination } from '@/mixins';
import { mUserList } from '@/api/user';

export default {
  name: 'mUser',
  mixins: [pagination],
  data () {
    return {
      query: {
        page: 1,
        phone: '',
        username: '',
        name: ''
      },
      formData: [],
      total_page: 1
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async handleQuery() {
      await this.init();
    },
    async init() {
      return new Promise( async (resolve, reject) => {
        let res = await mUserList(this.query);
        this.formData = res.data.list;
        this.query.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
