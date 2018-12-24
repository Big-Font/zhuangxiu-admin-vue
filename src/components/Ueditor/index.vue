<template>
  <div>
    <script id="editor" type="text/plain" ></script>
  </div>
</template>

<script>
  import '../../../static/ueditor/ueditor.config.js'
  import '../../../static/ueditor/ueditor.all.js'
  import '../../../static/ueditor/lang/zh-cn/zh-cn.js'

  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
    //   config: {
    //       type: Object
    //   }
    },
    data() {
      return {
        editor: null,
        config: {
            //可以在此处定义工具栏的内容
            toolbars: [
             [
                'source', //源代码
                '|',

                'undo', //撤销
                'redo', //重做
                '|',

                'bold', //加粗
                'italic', //斜体
                'underline', //下划线
                'fontborder', //字符边框
                'strikethrough', //删除线
                'subscript', //下标
                'superscript', //上标
                'removeformat', //清除格式
                'formatmatch', //格式刷 
                'autotypeset', //自动排版
                'blockquote', //引用
                'pasteplain', //纯文本粘贴模式
                '|',

                'forecolor', //字体颜色
                'backcolor', //背景色
                'insertorderedlist', //有序列表
                'insertunorderedlist', //无序列表
                'selectall', //全选
                'cleardoc', //清空文档
                '|',

                'rowspacingtop', //段前距
                'rowspacingbottom', //段后距
                'lineheight', //行间距
                
               ],
               [
                'customstyle', //自定义标题
                'paragraph', //段落格式
                'fontfamily', //字体
                'fontsize', //字号
                'directionalityltr', //从左向右输入
                'directionalityrtl', //从右向左输入
                'indent', //首行缩进
                '|',

                'justifyleft', //居左对齐
                'justifyright', //居右对齐
                'justifycenter', //居中对齐
                'justifyjustify', //两端对齐
                '|',

                'touppercase', //字母大写
                'tolowercase', //字母小写
                '|',

                'link', //超链接
                'unlink', //取消链接
                'anchor', //锚点
                '|',

                'imagenone', //默认
                'imageleft', //左浮动
                'imageright', //右浮动
                'imagecenter', //居中

               ],
               [
                'insertimage', //多图上传
                'emotion', //表情
                'scrawl', //涂鸦
                'attachment', //附件
                // 百度谷歌地图iframe

                'insertcode', //代码语言
                // 百度应用
                'pagebreak', //分页
                'template', //模板
                'background', //背景
                '|',

                'horizontal', //分隔线
                'date', //日期
                'time', //时间
                'spechars', //特殊字符
                'snapscreen', //截图
                'wordimage', //图片转存
                '|',

                'inserttable', //插入表格
                'deletetable', //删除表格
                'insertparagraphbeforetable', //"表格前插入行"
                'insertrow', //前插入行
                'deleterow', //删除行
                'insertcol', //前插入列
                'deletecol', //删除列
                '|',

                // 'edittip ', //编辑提示
                'mergecells', //合并多个单元格
                'mergeright', //右合并单元格
                'mergedown', //下合并单元格
                'splittocells', //完全拆分单元格
                'splittorows', //拆分成行
                'splittocols', //拆分成列
                'charts', // 图表
              ],
              [
                'print', //打印
                'preview', //预览
                'searchreplace', //查询替换
                'help', //帮助
                'drafts', // 从草稿箱加载
                
                
                'fullscreen', //全屏
                
                // 'webapp', //百度应用
                // 'music', //音乐
                // 'deletecaption', //删除表格标题
                // 'inserttitle', //插入标题
                // 'insertframe', //插入Iframe
                // 'simpleupload', //单图上传
                // 'edittable', //表格属性
                // 'edittd', //单元格属性
                // 'map', //Baidu地图
                // 'gmap', //Google地图
                // 'insertvideo', //视频
              ]
            ],
            zIndex: 1000,  // 编辑器的层级
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
            autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
            initialFrameWidth: null,
            initialFrameHeight: 450,
            BaseUrl: 'http://127.0.0.1:3000',
            UEDITOR_HOME_URL: '/static/Ueditor/'
          },
      }
    },
    mounted() {
      //初始化UE
      const _this = this;
      _this.editor = UE.delEditor("editor");
      _this.editor = UE.getEditor('editor',this.config);
    },
    destoryed() {
      this.editor.destory();
    },
    methods:{
      getUEContent: function(){
       return this.editor.getContent();
      },
      getContentTxt: function(){
        return this.editor.getContentTxt();
      },
      setContent: function(data) {
        return this.editor.setContent(data)
      },
    }
  }
</script>
