<template>
  <el-row>
    <el-col :span="4">
      <ul class="itemList">
        <li @click="fileClicked()">正文</li>
        <li v-if="hasAttachment" v-for="attachment in attachmentList" @click="attachmentClicked(attachment)">{{attachment.attachmentRealName}}</li>
      </ul>
    </el-col>
    <el-col :span="18">
      <template v-if="clickedTarget == 'file'">
        <div v-html="file.fileContent"></div>
      </template>
      <template v-else="hasAttachment && clickedTarget == 'attachment'">
        <pdf-view ref="pdfView" :toPage="toPage" :src="attachmentPath" :fileSuffix="attachmentSuffix" v-on:updateToPage="updateToPage"></pdf-view>
      </template>

    </el-col>
  </el-row>
</template>

<script>
  import PdfView from '@/components/PdfView'
  import { listFileAttachment, getFileById } from '@/api/file'
  import { isOfficeFile } from '@/utils'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'preview',
    components: {
      PdfView
    },
    props: {
      fileId: {
        type: Number,
        required: true
      },
      hasAttachment: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        file: {},
        toPage: 1,
        clickedTarget: 'file',
        attachmentPath: '',
        attachmentSuffix: '',
        attachmentList: []
      }
    },
    created() {

    },
    watch: {
      fileId(val) {
        this.fetchData(this.fileId)
      }
    },
    mounted() {
      this.fetchData(this.fileId)
    },

    methods: {
      fileClicked() {
        this.clickedTarget = 'file'
      },
      fetchData(fileId) {
        getFileById(fileId).then((resp) => {
          this.file = resp.data.data
        })
        listFileAttachment(fileId).then((resp) => {
          this.attachmentList = resp.data.data
          // this.attachmentList[0] && this.attachmentClicked(this.attachmentList[0])
        })
      },
      attachmentClicked(attachment) {
        this.clickedTarget = 'attachment'
        let attachmentPath = attachment.attachmentPath
        if (isOfficeFile(attachmentPath)) {
          attachmentPath += '.pdf'
        }
        this.toPage = 1
        this.attachmentSuffix = attachment.attachmentSuffix || ''
        this.attachmentPath = '/system/admin/sysFile/preview?attachmentPath=' + attachmentPath +
          '&attachmentName=' + attachment.attachmentRealName +
          '&x=' + getToken()
        // 清除错误信息
        this.$refs['pdfView'] && this.$refs['pdfView'].resetError()
      },
      updateToPage(page) {
        this.toPage = page
      }
    }
  }
</script>
