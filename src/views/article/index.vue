<template>
<div class="createPost-main-container">
  <div class="editor-container">
    <Tinymce ref="editor" :height="400" v-model="postForm.content" />
  </div>
</div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  data () {
    return {
      postForm: Object.assign({}, defaultForm),
    }
  },
  components: {
    Tinymce
  }
}
</script>

<style lang='scss' scoped>
.createPost-main-container {
  padding: 40px 45px 20px 50px;
  .editor-container {
    min-height: 500px;
    margin: 0 0 30px;
    .editor-upload-btn-container {
      text-align: right;
      margin-right: 10px;
      .editor-upload-btn {
        display: inline-block;
      }
    }
  }
}
</style>
