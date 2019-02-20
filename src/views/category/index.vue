<template>
  <div class="category">
    <!-- 顶部添加框 -->
    <div class="header-option">
      <div>
        <div class="item">
          <el-input v-model="input" placeholder="添加分类的名字" style="margin-right: 20px;"></el-input>
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
        <span>
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
    <!-- <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
  </div>
</template>

<script>
import { categoryList, publicCategory, deleteCategory, modeifyCategory } from '@/api/goods';

export default {
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
        this.$confirm(`请确定是否添加此条类别至最高级别分类`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            label: this.input,
            pid: 0,
            tree: 0,
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
        this.$confirm(`请确定是否修改此条类别名称为${this.input}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            label: this.input,
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
        this.$confirm(`请确定是否添加此条类别至“${data.label}”分类下`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let params = {
            pid: data.value,
            label: this.input,
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
}
</style>
