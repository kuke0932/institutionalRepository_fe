<template>
  <div>
    <template v-if="_isImageFile(fileSuffix)">
      <img :src="src">
    </template>
    <template v-else="">
      <div class="num_pages" style="text-align: center">
        <el-button size="mini" @click="prePage">上一页</el-button>
        <span>第</span>
        <input type="number"
               class="current_page"
               v-model="page"
               style="width:40px;border-radius: 5px;border: 1px solid #ddd;"
               onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
               onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
               @change="watchValue">
        <span>页，</span>共<span>{{numPages}}</span>页
        <el-button size="mini" @click="nextPage">下一页</el-button>
      </div>
      <template v-if="errorDetail">
        {{errorDetail}}
      </template>
      <template v-else="">
        <pdf id="pdf"  ref="pdf"
             :src="src"
             :page="Number.parseInt(page)"
             :rotate="rotate"
             @password="password"
             @error="error"
             @loaded="loaded"
             @num-pages="numPages = $event"></pdf>
      </template>

    </template>
  </div>
</template>


<script>
  import pdf from 'vue-pdf'
  import { isImageFile } from '@/utils'
  export default {
    name: 'PdfView',
    components: {
      pdf
    },
    props: {
      src: {
        type: String,
        required: true
      },
      fileSuffix: {
        type: String,
        required: true
      },
      toPage: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        page: this.toPage,
        numPages: 0,
        rotate: 0,
        errorDetail: '',
        loadingInstance: null
      }
    },
    watch: {
      toPage(val) {
        this.page = val
      }
    },
    created() {

    },
    mounted() {
      this.loadingInstance = this.$loading({
        target: document.querySelector('#pdf'),
        fullscreen: false,
        lock: true,
        text: '正在加载'
      })
    },
    methods: {
      _isImageFile(p) {
        return isImageFile(p)
      },
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
      },

      password(updatePassword, reason) {
        updatePassword(prompt('password is "test"'))
      },
      loaded() {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close()
        })
      },
      error(err) {
        this.errorDetail = err.details
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close()
        })
      },
      resetError() {
        this.errorDetail = ''
      },
      watchValue() {
        const val = document.getElementsByClassName('current_page')[0].value
        if (val <= 0) {
          this.page = 1
          this.$message({
            message: '已经是第一页啦！',
            type: 'warning'
          })
        }
        if (val > this.numPages) {
          this.page = this.numPages
          this.$message({
            message: '已经是最后一页啦！',
            type: 'warning'
          })
        }
        this.$emit('updateToPage', this.page)
      },
      prePage() {
        this.page = this.page - 1
        if (this.page <= 0) {
          this.page = 1
          this.$message({
            message: '已经是第一页啦！',
            type: 'warning'
          })
        }
        this.$emit('updateToPage', this.page)
      },
      nextPage() {
        this.page = this.page + 1
        if (this.page > this.numPages) {
          this.page = this.numPages
          this.$message({
            message: '已经是最后一页啦！',
            type: 'warning'
          })
        }
        this.$emit('updateToPage', this.page)
      },
      choseAccessory() {
        this.page = 1
      }
    }
  }
</script>

<style scoped>
  .box-card{
    width:60%;
    margin-top: 10px;
    cursor: pointer;
  }
  .text h3{
    margin: 0;
  }
  .text p{
    margin-bottom: 0;
  }
  .itemList li{
    margin-top: 5px;
    font-size: 15px;
    cursor: pointer;
  }
  .itemList li:hover{
    color:#999;
  }
</style>
