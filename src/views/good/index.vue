<template>
  <div class="goods-list">
    <!-- 筛选条件 -->
    <div class="header-option">
      <div>
        <div class="item">
          <h4>商品名称</h4>
          <el-input v-model="query.name" placeholder="按商品名称模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>商家</h4>
          <el-input v-model="query.seller" placeholder="按商品品牌模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>品牌</h4>
          <el-input v-model="query.brand" placeholder="按商品品牌模糊查询"></el-input>
        </div>
        <div class="item">
          <h4>商品类别</h4>
          <el-cascader
            placeholder="请选择商品类别"
            :options="typeList"
            v-model="queryTypeSelectedOption"
          ></el-cascader>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="danger" @click="handlePublishGoods">添加</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 93%; margin: 20px auto;">
      <el-table-column
        label="id"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.id }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="列表图片"
        align="center"
        width="150">
        <template slot-scope="scope">
          <img style="width:130px;height:90px;" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.name }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="品牌"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.brand }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商家"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.seller }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.type }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="价格"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.price }} </div>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.tag }} </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditList(scope.$index, scope.row)">查看</el-button>
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
      :current-page.sync="page"
      :page-count="total_page">
    </el-pagination>
    <!-- 编辑弹出层 -->
    <el-dialog :title="dialogTitle" :fullscreen="true" :visible.sync="publicDialog" center @close="dialogClose">
      <el-form class="public-form" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" :model="updateDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="商品名称" prop="name">
            <el-input v-model="updateDialog.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="商品品牌" prop="brandId">
            <el-select v-model="updateDialog.brandId" filterable placeholder="请选择商品品牌">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商家名称" prop="sellerId">
            <el-select v-model="updateDialog.sellerId" filterable placeholder="请选择商家">
              <el-option
                v-for="item in sellerList"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="dialog-input" label="商品类别">
            <el-cascader
              :options="typeList"
              placeholder="请选择商品分类"
              @change="handleTypeSelectedChange"
              v-model="updateDialog.typeSelectedOption"
            ></el-cascader>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商品价格" prop="price">
            <el-input v-model="updateDialog.price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item class="dialog-input" label="商品标签">
            <el-input v-model="updateDialog.tag" placeholder="请输入商品标签"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商品简图" prop="img">
            <img v-if="updateDialog.img" style="width:130px;height:90px;" :src="updateDialog.img" alt="">
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
          <el-form-item class="dialog-input" label="商品简介">
            <el-input v-model="updateDialog.introduce" placeholder="请输入商品简介"></el-input>
          </el-form-item>
        </div>
        <div class="ueditor">
          <h2>商品详情</h2>
          <wang-editor v-if="publicDialog" class="wangUeitors"
          :editorDefault="editorDefault"
          :nameid="nameid"
          ref="wangUeitors"></wang-editor>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="publicDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看弹出层 -->
    <el-dialog title="商品详情" :fullscreen="true" :visible.sync="listDialog" center>
      <el-form class="public-form" label-position="left" label-width="100px" :model="showDialog">
        <div class="item">
          <el-form-item class="dialog-input" label="商品">
            <div>{{showDialog.name}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="品牌">
            <div>{{showDialog.brand}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="商家">
            <div>{{showDialog.seller}}</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="类别">
            <div>{{showDialog.type}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="价格">
            <div>{{showDialog.price}}元</div>
          </el-form-item>
          <el-form-item class="dialog-input" label="标签">
            <div>{{showDialog.tag}}</div>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item class="dialog-input" label="简图">
            <img v-if="showDialog.img" style="width:130px;height:90px;" :src="showDialog.img" alt="">
          </el-form-item>
          <el-form-item class="dialog-input" label="简介">
            <div>{{showDialog.introduce}}</div>
          </el-form-item>
        </div>
        <div class="ueditor">
          <h2>商品介绍</h2>
          <div class="show-content" v-html="showDialog.detail"></div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="listDialog = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { upload, pagination, wangEditorNameid } from '@/mixins';
import WangEditor from '@/components/WangEditor';
import { getGoods, publicGood, modeifyGood, goodsInfoUpdateList, categoryList } from '@/api/goods';

let initUpdateDialog = {
    brandId: '',
    genreId: '',
    sellerId: '',
    name: "",
    brand: "",
    price: "",
    tag: "",
    introduce: "",
    img: "",
    seller: "",
    type: "",
    detail: "",
    typeSelectedOption: [],
};

export default {
  name: 'goods',
  mixins: [upload, pagination, wangEditorNameid],
  data () {
    return {
      query: {
        name: '',
        seller: '',
        brand: '',
        typeId: '',
      },
      queryTypeSelectedOption: [],
      formData: [],
      showDialog: {},
      fileList: [],
      updateDialog: {
        brandId: '',
        genreId: '',
        sellerId: '',
        name: "",
        brand: "",
        price: "",
        tag: "",
        introduce: "",
        img: "",
        seller: "",
        type: "",
        detail: "",
        typeSelectedOption: [],
      },
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        brandId: [
          {required: true, message: '请选择商品品牌', trigger: 'change'}
        ],
        sellerId: [
          {required: true, message: '请选择商家', trigger: 'change'}
        ],
        typeSelectedOption: [
          {required: true, message: '请选择商品类别', trigger: 'change'}
        ],
        price: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ]
      },
      dialogTitle: '修改商品信息',
      brandList: [],   //商品品牌列表
      sellerList: [],  // 商家列表
      typeList: [],    // 商品类型列表
      editorDefault: '',
      publicDialog: false,
      page: 1,
      listDialog: false,
    }
  },
  components: {
    WangEditor
  },
  async mounted() {
    await this.init();
    await this.categoryList();
  },
  methods: {
    handleEditList(index, item) {
      this.showDialog = item;
      this.listDialog = true;
    },
    async handleEdit(index, item) {
      console.log(item)
      this.updateDialog  = item;
      this.editorDefault = item.detail;
      this.dialogTitle = '修改商品信息';
      this.dialogType = 'modeify';
      await this.handleGetQueryList();
      // 获取分类id
      let selectedArr = [];
      if(this.updateDialog.tree.indexOf('_') == -1 && this.updateDialog.tree === '0') {
        selectedArr.push(this.updateDialog.tree);
      }else {
        selectedArr = this.updateDialog.tree.split('_');
        selectedArr.push(item.genreId);
      }
      this.updateDialog.typeSelectedOption = selectedArr.map((item, index) => {
        return Number(item);
      });
      this.publicDialog = true;
    },
    // 关闭发布对话框
    dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      this.updateDialog = initUpdateDialog;
    },
    // 发布商品
    async handlePublishGoods() {
      this.updateDialog = {...initUpdateDialog};
      this.editorDefault = '';
      this.dialogTitle = '添加商品';
      this.dialogType = 'publish';
      await this.handleGetQueryList();
      // 获取分类id

      this.publicDialog = true;
    },
    // 查询商品
    async handleQuery() {
      let typeId = this.queryTypeSelectedOption.length ? this.queryTypeSelectedOption[this.queryTypeSelectedOption.length-1] : '';
      this.query.typeId = typeId;
      await this.init();
    },
    // 修改和发布商品信息
    handlePublic(formName) {
      this.updateDialog.detail = this.$refs.wangUeitors.getwangUditorHtml();
      if(!this.updateDialog.detail) {
        this.$message.error('请填写文章内容，用于展示商品详情');
        return;
      }
      if(this.dialogType === 'publish') {
        // 确定发布商品
        if(!this.uploadImgUrl){
          this.$message.error('请上传活动简图');
          return;
        }else {
          this.updateDialog.img = this.uploadImgUrl;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            // brandId, genreId, name, price, tag, introduce, img, sellerId, detail
            let params = {
              brandId: this.updateDialog.brandId,
              genreId: this.updateDialog.genreId,
              name: this.updateDialog.name,
              price: this.updateDialog.price,
              tag: this.updateDialog.tag,
              introduce: this.updateDialog.introduce,
              img: this.updateDialog.img,
              sellerId: this.updateDialog.sellerId,
              detail: this.updateDialog.detail
            }
            console.log(params)
            let res = await publicGood(params)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.publicDialog = false;
            }else {
              this.$message.error(res.data.msg);
            }
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      }else {
        // 确定修改信息
        console.log(`图片上传：${this.uploadImgUrl}，默认图片： ${this.updateDialog.img}`)
        this.updateDialog.img = this.uploadImgUrl ? this.uploadImgUrl : this.updateDialog.img;
        if(!this.updateDialog.img) {
          this.$message.error('请上传活动简图');
          return;
        }
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let params = {
              id: this.updateDialog.id,
              brandId: this.updateDialog.brandId,
              genreId: this.updateDialog.genreId,
              name: this.updateDialog.name,
              price: this.updateDialog.price,
              tag: this.updateDialog.tag,
              introduce: this.updateDialog.introduce,
              img: this.updateDialog.img,
              sellerId: this.updateDialog.sellerId,
              detail: this.updateDialog.detail
            }
            console.log(params)
            let res = await modeifyGood(params)
            if(res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              await this.init();
              this.publicDialog = false;
            }else {
              this.$message.error(res.data.msg);
            }
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      }

    },
    // 多级选择器change事件
    handleTypeSelectedChange(item) {
      console.log(item[item.length-1]);
      this.updateDialog.genreId = item[item.length-1];
    },
    // 根据typeId 递归层级id
    deepData() {
      let list = this.typeList;
      let id = this.updateDialog.genreId;
      let result = [];
      function deepById(list, id) {
        list.map( item => {
          if(item.value !== id && item.children) {
            deepById(item.children, id);
          }
          if(item.value === id) {
            result.unshift(item.value);
          }
        })
      }
      return result;
    },
    async init() {
      return new Promise( async(resolve, reject) => {
        let page = this.page;
        let query = { page, ...this.query, }
        let res = await getGoods(this.query);
        console.log(res);
        this.formData = res.data.list;
        this.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    },
    async handleGetQueryList() {
      return new Promise(async (resolve, reject) => {
        let res = await goodsInfoUpdateList();
        this.brandList = res.data.brandList;
        this.sellerList = res.data.sellerList;
        this.typeList = res.data.typeList;
        resolve();
      })
    },
    async categoryList() {
      return new Promise(async (resolve, reject) => {
        let res = await categoryList();
        this.typeList = res.data.result;
        this.typeList.unshift({value: '', label:'不选择'})
        resolve();
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.goods-list{
  padding: 30px 0;
}
.public-form{
  .item{
    display: flex;
    justify-content: center;
  }
  .dialog-input{
    width: 35%;
    margin-right: 50px;
  }
  .ueditor{
    >h2{
      text-align: center;
    }
    .wangUeitors{
      width: 80%;
      margin: 10px auto;
    }
  }
  .show-content{
    border: 1px solid #ccc;
    width: 680px;
    padding: 0 20px;
    margin: 10px auto;
    /deep/ img{
      width: 100%;
    }
  }
}
</style>
