<template>
  <div class="add-reply">
    <!-- 步骤条 -->
    <el-steps :active="active" process-status="success" finish-status="success" simple style="margin-top: 20px">
      <el-step title="预置收到信息内容" ></el-step>
      <el-step title="选择回复方式" ></el-step>
      <el-step title="填写回复详情" ></el-step>
    </el-steps>

    <el-form class="form-part" ref="postForm" :model="params" :rules="rules">
      <!-- 第一步：填写回复文字 -->
      <div class="content" v-show="active === 0">
        <el-form-item style="margin-bottom: 40px;" prop="from">
          <MDinput class="from-input" v-model="params.from" :maxlength="50" name="from" required>
            预置收到信息内容
          </MDinput>
        </el-form-item>
      </div>
      <!-- 第二步：选择回复方式 -->
      <div class="content" v-show="active === 1">
        <el-select style="margin: 0 auto;display: block; width: 30%;" v-model="params.type">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 第三步：填写回复内容 -->
      <div class="content" v-show="active === 2">
        <!-- 恢复策略为文字 -->
        <template v-if="params.type === 1">
          <el-form-item style="margin-bottom: 40px;" prop="to">
            <MDinput class="from-input" v-model="params.to" :maxlength="50" name="to" required>
              填写回复文字
            </MDinput>
          </el-form-item>
        </template>
        <!-- 回复策略为链接 -->
        <template v-if="params.type === 6">
          <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="params.title" :maxlength="10" name="name" required>
                标题
              </MDinput>
            </el-form-item>
          <el-form-item style="margin-bottom: 40px;" label-width="80px" label="描述:" prop="description">
            <el-input :rows="1" v-model="params.description" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 40px;" label-width="80px" label="链接地址:" prop="url">
            <el-input :rows="1" v-model="params.url" type="textarea" class="article-textarea" autosize placeholder="请输入链接地址"/>
          </el-form-item>
          <el-form-item class="dialog-input" label="缩略图" prop="picUrl">
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
        </template>
      </div>
      <!-- 下一步和提交按钮 -->
      <div class="btn">
        <el-button type="primary" style="margin: 0 auto;display: block;" @click="goback">取消添加</el-button>
        <el-button type="danger" style="margin: 0 auto;display: block;" @click="next">{{active > 1 ? '提交': '下一步'}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput';
import { upload } from '@/mixins';
import { validURL } from '@/utils/validate';
import { publicWechatReply } from '@/api/wechat';

const paramsInit = {
  from: '',
  type: 1,
  to: '',
  title: '',
  description: '',
  url: '',
  picUrl: ''
}

export default {
  name: 'addReply',
  mixins: [upload],
  data () {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback()
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          // this.$message({
          //   message: '外链url填写不正确',
          //   type: 'error'
          // })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      active: 0,
      params: Object.assign({}, paramsInit),
      rules: {
        // to: [{ validator: validateRequire }],
        // from: [{ validator: validateRequire }],
        // title: [{ validator: validateRequire }],
        // description: [{ validator: validateRequire }],
        url: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      typeList: [
        {value: 1, label: '回复文字'},
        {value: 6, label: '回复链接'}
      ]
    }
  },
  computed: {
    contentShortLength() {
      return this.params.description.length
    }
  },
  components: {
    MDinput
  },
  methods: {
    async next() {
      if(this.active === 0) {
        if(!this.params.from) {
          this.$message({
            message:'请填写收到的信息内容',
            type: 'error'
          })
          return;
        }
      }else if(this.active === 2) {
        if(this.params.type === 1) {
          if(!this.params.to) {
            this.$message({
              message:'回复策略为回复文字时，回复文字必填',
              type: 'error'
            })
            return;
          }
        }else if(this.params.type === 6) {
          if(!this.params.title || !this.params.description || !this.params.url) {
            this.$message({
              message:'回复策略为回复链接时，标题、描述和链接地址必填',
              type: 'error'
            });
            return;
          }
          if(!validURL(this.params.url)) {
            this.$message({
              message:'外链url填写不正确',
              type: 'error'
            });
            return;
          }
          if(!this.uploadImgUrl){
            this.$message({
              message:'请上传缩略图',
              type: 'error'
            });
            return;
          }else {
            this.params.picUrl = this.uploadImgUrl;
          }
        }
      }

      if (this.active === 2) {
        // 提交发布请求
        let res = await publicWechatReply(this.params);
        if(res.data.code === 0) {
          this.$message({
            message:'微信消息回复策略发布成功',
            type: 'success'
          });
          this.$router.push({
            name: 'reply'
          })
        }else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }else {
        this.active ++;
      }
    },
    // 取消添加
    goback() {
      this.$router.push({
        name: 'reply'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.add-reply{
  padding: 0 15%;
  margin: 50px auto 30px;
  .form-part{
    width: 100%;
    .content{
      width: 100%;
      margin: 50px auto 30px;
      .from-input{
        width: 50%;
        margin: 0 auto;
      }
      .word-counter {
        width: 40px;
        position: absolute;
        right: -10px;
        top: 0px;
      }
      /deep/ .el-form-item__label{
        text-align: left;
      }
    }
  }
  .btn{
    display: flex;
  }
}
</style>
