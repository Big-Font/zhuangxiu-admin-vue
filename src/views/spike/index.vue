<template>
 <div>
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
          <img :src="scope.row.spike_img" alt="">
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
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
 </div>
</template>

<script>
import { spikeActiveList } from '@/api/spike';

 export default {
   data () {
     return {
       bannerData: []
     }
   },
   async mounted() {
     let res = await spikeActiveList({
       place: 0,
       type: 0,
       page: 1
      });
      this.bannerData = res.data.list;
   },
   methods: {

   }
 }
</script>

<style lang='scss' scoped>


</style>
