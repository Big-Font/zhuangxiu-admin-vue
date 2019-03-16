<template>
  <div class="reply">
    <!-- 模糊搜索表头 from, to, type, title -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>消息</h4>
          <el-input v-model="query.from" placeholder="按消息模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>回复</h4>
          <el-input v-model="query.to" placeholder="按文本回复模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>链接标题</h4>
          <el-input v-model="query.title" placeholder="按链接标题模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>回复类型</h4>
          <el-select v-model="query.type" placeholder="按回复类型搜索">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="danger" @click="publicList">添加</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 93%; margin: 20px auto;">
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
          <el-button type="success" plain size="mini"  v-if="scope.row.delFlag != 0" @click="replyActive(scope.row, 0)">启用</el-button>
          <el-button type="danger" plain size="mini"  v-if="scope.row.delFlag == 0" @click="replyActive(scope.row, -1)">停用</el-button>
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
    <!-- 分页 -->
    <el-pagination
      style="width: 100%; text-align: center; margin-top: 20px;"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentPage"
      :current-page.sync="query.page"
      :page-count="total_page">
    </el-pagination>
    <!-- 查看和修改 -->
    <el-dialog width="60%" :title="dialogTitle" :center="true" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form class="form-part" ref="postForm" :model="dialogForm" :rules="rules">
        <el-form-item style="margin-bottom: 40px;" :label=" dialogType == 'cat' ? '接收到的文字:' : ''"  prop="replyFrom">
          <div v-if="dialogType == 'cat'">{{dialogForm.replyFrom}}</div>
          <MDinput v-else class="from-input" v-model="dialogForm.replyFrom" :maxlength="50" name="from" required>
            预置收到信息内容
          </MDinput>
        </el-form-item>
        <template v-if="dialogForm.type == 1">
          <el-form-item style="margin-bottom: 40px;" :label=" dialogType == 'cat' ? '回复的文本:' : ''" prop="replyTo">
            <div v-if="dialogType == 'cat'">{{dialogForm.replyTo}}</div>
            <MDinput v-else class="from-input" v-model="dialogForm.replyTo" :maxlength="50" name="to" required>
              填写回复文字
            </MDinput>
          </el-form-item>
        </template>
        <template v-if="dialogForm.type == 6">
          <el-form-item style="margin-bottom: 40px;" label-width="80px" label="标题" prop="title">
              <div v-if="dialogType == 'cat'">{{dialogForm.title}}</div>
              <el-input v-else :rows="1" maxlength="20" v-model="dialogForm.title" type="textarea" class="article-textarea" placeholder="请输入内容"/>
            </el-form-item>
          <el-form-item style="margin-bottom: 40px;" label-width="80px" label="描述:" prop="description">
            <div v-if="dialogType == 'cat'">{{dialogForm.description}}</div>
            <el-input v-else :rows="1" maxlength="20" v-model="dialogForm.description" type="textarea" class="article-textarea" placeholder="请输入内容"/>
            <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 40px;"  maxlength="250" :autosize="{ minRows: 2, maxRows: 6 }" label-width="80px" label="链接地址:" prop="url">
            <div v-if="dialogType == 'cat'">{{dialogForm.url}}</div>
            <el-input v-else :rows="1" v-model="dialogForm.url" type="textarea" class="article-textarea" autosize placeholder="请输入链接地址"/>
          </el-form-item>
          <el-form-item class="dialog-input" label="缩略图" prop="picUrl">
            <img v-if="dialogForm.picUrl" style="width:100px;height:100px;" :src="dialogForm.picUrl" alt="">
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pagination, upload } from '@/mixins';
import MDinput from '@/components/MDinput';
import clip from '@/utils/clipboard';
import { getALLReply, modifyWechatReply } from '@/api/wechat';

export default {
  name: 'reply',
  mixins: [pagination, upload],
  data () {
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
      formData: [],
      query: {
        from: '',
        to: '',
        type: '',
        title: '',
        page: 1
      },
      typeList: [
        {value: '', label: '全部'},
        {value: 1, label: '回复文字'},
        {value: 6, label: '回复链接'}
      ],
      dialogTitle: '修改消息策略',
      dialogFormVisible: false,
      dialogType: 'modify',
      dialogForm: {},
      rules: {
        url: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
    }
  },
  computed: {
    contentShortLength() {
      return this.dialogForm.description ? this.dialogForm.description.length : ''
    }
  },
  components: {
    MDinput
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // 查询
    async handleQuery() {
      await this.init();
    },
    // 修改消息策略提交按钮
    async handlePublic() {
      if(!this.dialogForm.replyFrom) {
        this.$message({
          message:'请填写收到的信息内容',
          type: 'error'
        })
        return;
      }
      if(this.dialogForm.type === 1) {
        if(!this.dialogForm.replyTo) {
          this.$message({
            message:'回复策略为回复文字时，回复文字必填',
            type: 'error'
          })
          return;
        }
      }else if(this.dialogForm.type === 6) {
        if(!this.dialogForm.title || !this.dialogForm.description || !this.dialogForm.url) {
          this.$message({
            message:'回复策略为回复链接时，标题、描述和链接地址必填',
            type: 'error'
          });
          return;
        }
        if(!validURL(this.dialogForm.url)) {
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
          this.dialogForm.picUrl = this.uploadImgUrl;
        }
      }

      // 提交
      await this.modifyWechatReply(this.dialogForm);

    },
    // 添加消息策略按钮
    publicList() {
      this.$router.push({
        name: 'addReply'
      })
    },
    // 修改按钮
    handleEdit(index, item) {
      this.dialogType = 'modify';
      this.dialogTitle = '修改消息策略';
      this.dialogForm = Object.assign({}, item);
      this.dialogFormVisible = true;
    },
    // 查看
    catEditList(index, item) {
      this.dialogType = 'cat';
      this.dialogTitle = '查看消息策略';
      this.dialogForm = Object.assign({}, item);
      this.dialogFormVisible = true;
    },
    async init() {
      return new Promise( async (resolve, reject) => {
        let res = await getALLReply(this.query);
        this.formData = res.data.list;
        this.query.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve()
      })
    },
    // 消息启用和停用
    async replyActive(item, code) {
      if(code == item.delFlag) return;
      let params = {...item, delFlag: code};
      await this.modifyWechatReply(params);
    },
    // 修改和删除消息接口
    modifyWechatReply(params) {
      return new Promise(async (resolve, reject) => {
        let res = await modifyWechatReply(params);
        if(res.data.code === 0) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          await this.init();
          this.dialogFormVisible = false;
        }else {
          this.$message({
            message: res.data.msg ? res.data.msg : res.msg,
            type: 'error'
          });
        }
        resolve(res);
      })
    },
    // 复制链接
    handleCopy(text, event) {
      clip(text, event)
    },
    // 关闭修改和查看弹窗
    dialogClose() {
      this.dialogForm = {};
    }
  }
}
</script>

<style lang='scss' scoped>
.reply{
  /deep/ .el-form-item__label{
    text-align: left;
  }
}
</style>
