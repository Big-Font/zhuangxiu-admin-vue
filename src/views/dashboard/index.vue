<template>
  <div class="dashboard-container">
    <!-- <UEditor style="marginTop:10px;" ref="ueditor"></UEditor> -->

    <el-row  style="marginTop:10px;">
        <el-col :span="4"><div class="searchTitle">标题</div></el-col>
        <el-col :span="12"><el-input class="" v-model="changeOptions.title" placeholder="请输入内容"></el-input></el-col>
    </el-row>

    <el-row  style="marginTop:10px;">
        <el-col :span="4"><div class="searchTitle">作者：</div></el-col>
        <el-col :span="12"><el-input class="" v-model="changeOptions.author" placeholder="请输入内容"></el-input></el-col>
    </el-row>

    <wang-editor ref="wangUeitors"></wang-editor>
    <el-row>
      <el-button type="primary" @click="publicContent">发布文章</el-button>
    </el-row>
    <br>
    <!-- 照片上传 -->
    <el-upload
      class="upload-demo"
      :action="actionBaseUrl"
      :file-list="fileList"
      :headers="authHeader"
      :multiple="true"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <!-- 获取文件显示 -->
    <div v-html="html"></div>
  </div>
</template>

<script>
import WangEditor from '@/components/WangEditor'
import { mapGetters } from 'vuex'
import { articlePublishApi, articleApi, articleListApi } from '@/api/article'
import { baseUrl } from '@/config'

export default {
  name: 'dashboard',
  data() {
    return {
      changeOptions: {
        title: '',
        author: '',
        content: ''
      },
      html: '',
      fileList: [],
      actionBaseUrl: ''
    }
  },
  components: {
    WangEditor
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ]),
    authHeader: function() {
      return {
        'authorization': `Bearer ${this.token}`
      }
    },
  },
  mounted() {
    this.actionBaseUrl = `${baseUrl}/admin/upload`
  },
  methods: {
    publicContent() {
      this.changeOptions.content = this.$refs.wangUeitors.getwangUditorHtml();
      articlePublishApi(this.changeOptions).then( res => {
        if(res.data.code != 0) {
          this.$message.error(res.data.message);

        }else {
          this.$message({
            message: '发布成功',
            type: 'success'
          });
          articleListApi().then(response => {
            console.log(response.data.list[response.data.list.length-1].artlist_id);
            articleApi({id: response.data.list[response.data.list.length-1].artlist_id}).then( resp => {
              this.html = resp.data.data.content;
            })
          })
        }
      })
    },
     handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
