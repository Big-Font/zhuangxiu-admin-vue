<template>
  <div class="category">
    <div>
      <div class="header-option">
        <div>
          <div class="item">
            <el-input v-model="input" placeholder="添加分类的名字" style="margin-right: 20px;"></el-input>
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="actionBaseUrl"
              :headers="authHeader"
              :file-list="fileList"
              :limit="1"
              :multiple="false"
              :on-success="fileUpload"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="primary" @click="handlePublicParent">添加最高分类</el-button>
          </div>
        </div>
      </div>

      <el-tree
        :data="list"
        node-key="value"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span style="display: flex; ">
            <img :src="node.data.img" alt="">
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              <template>
                <el-button type="text">添加子分类</el-button>
              </template>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => modeify(data)">
              <template>
                <el-button type="text">修改分类名称</el-button>
              </template>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              <el-button type="text">删除当前分类</el-button>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 说明 -->
    <div class="content">
      <h4>使用说明</h4>
      <strong>1.添加分类:</strong> <br />
      ① 第一级分类： 在顶端输入框输入需要添加的分类名称，并上传图片，然后点击顶端的添加最高级按钮。<br />
      ② 子集分类：在顶端输入框中输入需要添加的分类名称,并上传图片，然后点击需要添加到的上一级分类后面的 <i>添加子集分类</i> 按钮 <br />
      <strong>2.修改分类信息:</strong> <br />
      和添加分类操作相同，在顶端输入框输如修改后的分类名，上传更换的图片，并点击需要修改的分类后的 <i>修改分类名称</i><br />
      <strong>3.删除分类:</strong> <br />
      同上！
    </div>
    <!-- 顶部添加框 -->

    <!-- <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
  </div>
</template>

<script>
import { upload } from '@/mixins';
import { categoryList, publicCategory, deleteCategory, modeifyCategory } from '@/api/goods';

export default {
  name: 'category',
  mixins: [upload],
  data () {
    return {
      input: '',
      list: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // 添加最高级别分类
    async handlePublicParent() {
      if(!!this.input) {
        if(!this.uploadImgUrl){
          this.$message.error('请上传分类图标');
          return;
        }
        this.$confirm(`请确定是否添加此条类别至最高级别分类`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            label: this.input,
            pid: 0,
            tree: 0,
            img: this.uploadImgUrl
          }
          console.log(params)
          let res = await publicCategory(params);
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
      }else {
        this.$message.error('请在顶端输入框中填写需要添加分类的名称');
      }
    },
    // 修改当前分类名称
    async modeify(data) {
      if(!!this.input) {
        if(!this.uploadImgUrl){
          this.$message.error('请上传分类图标');
          return;
        }
        this.$confirm(`请确定是否修改此条类别名称为${this.input}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            label: this.input,
            img: this.uploadImgUrl,
            id: data.value
          }
          console.log(params)
          let res = await modeifyCategory(params);
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
      }else {
        this.$message.error('请在顶端输入框中填写修改后的分类名称');
      }
    },
    // 添加分类
    async append(data) {
      if(!!this.input) {
        if(!this.uploadImgUrl){
          this.$message.error('请上传分类图标');
          return;
        }
        this.$confirm(`请确定是否添加此条类别至“${data.label}”分类下`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            pid: data.value,
            label: this.input,
            img: this.uploadImgUrl,
            tree: data.tree === '0' ? data.value : `${data.tree}_${data.value}`
          }
          console.log(data, params)
          let res = await publicCategory(params);
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
      }else {
        this.$message.error('请在顶端输入框中填写需要添加分类的名称');
      }
    },
    async remove(node, data) {
      this.$confirm('请确定是否删除此条类别', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            id: data.value
          }
          console.log(`删除要上传的数据为`, params)
          let res = await deleteCategory(params);
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
    // 页面初始化
    async init() {
      return new Promise( async (resolve, reject) => {
        this.uploadImgUrl = '';
        this.fileList.length = 0;
        this.input = '';
        this.$refs.upload.clearFiles();
        let res = await categoryList();
        this.list = res.data.result;
        resolve()
      })
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
}
</script>

<style lang='scss' scoped>
.category{
  padding: 30px 0;
  display: flex;
  justify-content: space-between;

  .content{
    background: rgba(66,185,131,.1);
    border-radius: 2px;
    padding: 1rem;
    line-height: 1.6rem;
    word-spacing: .05rem;
    width: 30%;
    margin-right: 60px;
    height: 500px;
  }
  .upload-demo{
    margin-right: 20px;
    // width: 60px;
    // height: 60px;
    /deep/ .el-upload--picture-card{
      width: 60px;
      height: 60px;
      line-height: 1;
    }
    /deep/ .el-upload--picture-card i{
      line-height: 60px;
    }
    /deep/ .el-upload-list__item{
      width: 60px;
      height: 60px;
    }
  }
  /deep/ .custom-tree-node{
    display: flex;
    justify-content: center;
    align-items: center;
    >span{
      img{
        width: 50px;
        height: 50px;
        margin: 10px 30px;
      }
    }
  }
  /deep/ .el-tree-node__content{
    height: 70px;
  }

}
</style>
