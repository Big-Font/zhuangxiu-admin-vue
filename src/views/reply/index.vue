<template>
  <div class="reply">
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 90%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center"
        width="40">
        <template slot-scope="scope">
          <div>{{ scope.row.id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="消息"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.replyFrom }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="回复类型"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1"><el-tag>回复文字</el-tag></div>
          <div v-if="scope.row.type == 6"><el-tag type="success">回复链接</el-tag></div>
        </template>
      </el-table-column>
      <el-table-column
        label="文本回复"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.replyTo }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="链接标题"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.title }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="链接描述"
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.description}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="缩略图"
        align="center"
        width="80">
        <template slot-scope="scope">
          <img style="width: 50px; height: 50px;" v-if="scope.row.picUrl" :src="scope.row.picUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="链接地址"
        align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.url" size="mini"  @click='handleCopy(scope.row.url,$event)'>复制链接</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.delFlag == 0">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.delFlag != 0">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="catEditList(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import clip from '@/utils/clipboard';
import { getALLReply } from '@/api/wechat';

export default {
  data () {
    return {
      formData: []
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    handleEdit() {

    },
    catEditList() {

    },
    async init() {
      return new Promise( async (resolve, reject) => {
        let res = await getALLReply();
        this.formData = res.data.list;
      })
    },
    // 复制链接
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
