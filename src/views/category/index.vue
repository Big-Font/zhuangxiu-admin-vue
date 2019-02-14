<template>
  <div>
    <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
import { categoryList } from '@/api/goods';

export default {
  data () {
    return {
      list: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  async mounted() {
    let res = await categoryList();
    console.log(res.data.result)
    this.list = res.data.result;
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    }
  }
}
</script>

<style lang='scss' scoped>


</style>
