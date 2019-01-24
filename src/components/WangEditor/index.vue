<template>
    <div>
        <div id="myWangEditor" ref="myWangEditor">
        </div>
    </div>
</template>

<script>
import wangEditor from 'wangeditor';  //引入刚npm安装的wangeditor插件
import { baseUrl } from '@/config'

export default({
    name:"MyWangEditor",
    data(){
        return {
            editorContent : "", //内容,
            editor: ""
        }
    },
    mounted(){
        var _this = this;
        this.editor = new wangEditor(this.$refs.myWangEditor); //实例化wangeditor

            this.editor.customConfig = {
　　　　　　　　　　　　onchange : (html) =>{this.editorContent = html;} ,
　　　　　　　　　　　　uploadImgMaxSize : 3 * 1024 * 1024 ,  // 将图片大小限制为 3M
　　　　　　　　　　　　uploadImgMaxLength : 1 , // 限制一次最多上传 1 张图片
　　　　　　　　　　　　uploadFileName : 'myFileName' , //设置上传图片文件的时候，后台接受的文件名，files.myFileName;
　　　　　　　　　　　　withCredentials : true , //跨域上传中如果需要传递 cookie 需设置 withCredentials
　　　　　　　　　　　　uploadImgTimeout : 10000 , //自定义 timeout 时间，这里是设置的3秒
　　　　　　　　　　　　uploadImgServer : `${baseUrl}/wangeditor/upload`, //上传到后台的接口
　　　　　　　　};
        　　　　　　　/*editor.customConfig.uploadImgParams = {//如果要自定义传一些参数，就在这里；
            　　　　　　　　// 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
            　　　　　　　　// 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
            　　　　　　　　img_name:_this.img_name,
            　　　　　　　　token: 'abcdef12345'
        　　　　　　};*/
        this.toListenUp(this.editor);//监听上传的各个阶段
        this.editor.create();
    },
    methods:{
        getwangUditorHtml() {
            return this.editor.txt.html();
        },
        getwangUditorText() {
            return this.editor.txt.text();
        },
        toListenUp:function(editor){ //监听上传图片的几个阶段，和做相应的处理
            var _this = this;
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                    // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                    // return {
                    //     prevent: true,
                    //     msg: '放弃上传'
                    // }
                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                },

                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    var url = result.data[0]   //获取后台返回的图片路径
                    insertImg(url) //把图片路径展示在编辑器里面
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
                }
            }
        }

})
</script>

<style>

</style>
