<template>
 <div>
   账号：<input type="text" v-model="phone"> <br>
   验证码： <input type="text" v-model="code">
   <div class="fr">
      <img :src="baseUrl+'/captcha'" alt="">
    </div>

    <div @click="reg">登录</div>
    <h1>发布找师傅</h1>
    <div @click="addWork">发布</div>
 </div>
</template>

<script>
import { fontBaseUrl } from '@/config'
import {registerAPI, loginAPI, addWorkerAPI} from '@/api/font';

 export default {
   data () {
     return {
        phone: '15133228953',
        code: '',
        baseUrl: ''
     }
   },
   mounted() {
      this.baseUrl = fontBaseUrl;
    },
   methods: {
     reg() {
       registerAPI({
         phone: this.phone,
         password: '123456',
         email: '396689144@qq.com',
          code: '67C0'
       })
       .then( res => {
         console.log(res)
       })
       .catch(err => {
         console.log(err)
       })
     },
     login() {
       loginAPI({
         capkey: this.code,
         phone: this.phone,
         password: '123456'
       })
       .then( res => {
         console.log(res)
       })
       .catch(err => {
         console.log(err)
       })
     },
     addWork() {

     }
   }
 }
</script>

<style lang='scss' scoped>


</style>
