import { baseUrl } from '@/config'
import { mapGetters } from 'vuex'

export const upload = {
  data () {
    return {
      fileList: [],
      actionBaseUrl: '',
      uploadImgUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    authHeader: function() {
      return {
        'authorization': `Bearer ${this.token}`
      }
    },
  },
  mounted() {
    this.actionBaseUrl = `${baseUrl}/upload`;
  },
  methods: {
    fileUpload(response, file, fileList) {
      if(response.code === 0) {
        this.uploadImgUrl = response.fileList[0];
      }else {
        this.$message.error('图片上传失败');
      }
    },
  }
}

export const pagination = {
  data() {
    return {
      total_page: 0,
      page: 1,
    }
  },
  methods: {
    async handleCurrentPage() {
      await this.init();
    },
  }
}
