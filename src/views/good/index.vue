<template>
  <div class="goods-list">
    <!-- 表格 -->
    <el-table
      :data="formData"
      :border="true"
      style="width: 80%; margin: 20px auto;">
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
                :key="item.name"
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
                :key="item.seller"
                :label="item.seller"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="dialog-input" label="商品类别" prop="typeSelectedOption">
            <el-cascader
              :options="typeList"
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
          <wang-editor v-if="publicDialog" class="wangUeitors" :editorDefault="editorDefault" ref="wangUeitors"></wang-editor>
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
import { upload, pagination } from '@/mixins';
import WangEditor from '@/components/WangEditor';
import { getGoods, getBrandList, getSellersList, categoryList } from '@/api/goods';

export default {
  name: 'goods',
  mixins: [upload, pagination],
  data () {
    return {
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
  },
  methods: {
    handleEditList(index, item) {
      this.showDialog = item;
      this.listDialog = true;
    },
    async handleEdit(index, item) {
      this.updateDialog  = item;
      this.editorDefault = item.detail;
      this.dialogTitle = '修改商品信息';
      this.dialogType = 'modeify';
      await this.handleBrandList();
      await this.handleSellerList();
      await this.handleTypeList();
      // 获取分类id
      let selectedArr = this.updateDialog.tree.split('_');
      this.updateDialog.typeSelectedOption = selectedArr.map(item => {
        return Number(item);
      });
      this.publicDialog = true;
    },
    // 关闭发布对话框
    dialogClose() {
      this.fileList = [];
      this.uploadImgUrl = '';
      // this.updateDialog = publicDateInit;
    },
    // 修改和发布商品信息
    handlePublic(formName) {

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
        let res = await getGoods();
        console.log(res);
        this.formData = res.data.list;
        this.page = Number(res.data.page);
        this.total_page = Number(res.data.total_page);
        resolve();
      })
    },
    async handleBrandList() {
      return new Promise(async (resolve, reject) => {
        let res = await getBrandList();
        this.brandList = res.data.list;
        resolve();
      })
    },
    async handleSellerList() {
      return new Promise(async (resolve, reject) => {
        let res = await getSellersList();
        this.sellerList = res.data.list;
        resolve();
      })
    },
    async handleTypeList() {
      return new Promise(async (resolve, reject) => {
        let res = await categoryList();
        this.typeList = res.data.result;
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
