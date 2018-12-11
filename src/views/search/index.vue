<template>
  <div class="container">
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="70px" label="搜索内容">
            <el-input style='min-width:120px;' v-model="query"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">开始检索</el-button>
        </el-col>
      </el-row>
      <div class="box-card" v-for="(search, idx) in searchList" >
        <div :key="idx" class="text">
          <h3 @click="fileClicked(search)">{{search.fileTitle}}</h3>
          <div class="content" @click="attachmentClicked(search)">{{search.attachmentContent || search.fileDesc}}</div>
        </div>
      </div>
      <el-dialog
        title=""
        :visible.sync="filePreviewVisible"
        width="60%"
        :before-close="handleClose">
        <file-preview :hasAttachment="hasAttachment" :fileId="selectedFileId" ></file-preview>
        <!-- <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
         </span>-->
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="attachmentPreviewVisible"
        width="60%"
        :before-close="handleClose">
        <template v-if="hasAttachment">
          <pdf-view ref="pdfView" :to-page="1" :src="attachmentPath" :fileSuffix="attachmentSuffix"></pdf-view>
        </template>
        <template v-else="">
          <file-preview :hasAttachment="hasAttachment" :fileId="selectedFileId" ></file-preview>
        </template>
      </el-dialog>
      <el-pagination
        style="float:right;margin: 15px 0 0 30px;"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-form>
  </div>
</template>

<script>
  import pdfView from '@/components/PdfView'
  import filePreview from '@/views/fileManagement/file/preview'
  import { search } from '@/api/search'
  import { getToken } from '@/utils/auth'
  import { isOfficeFile } from '@/utils'
  export default {
    name: 'search',
    components: {
      pdfView,
      filePreview
    },
    data() {
      return {
        total: 100,
        pageNum: 1,
        pageSize: 10,
        searchList: [],
        hasAttachment: false,
        query: null,
        selectedFileId: '',
        attachmentPath: '',
        attachmentSuffix: '',
        searchLoading: false,
        listLoading: false,
        filePreviewVisible: false,
        attachmentPreviewVisible: false
      }
    },
    created() {
    },
    mounted() {
      this.searchData(this.query, this.pageNum, this.pageSize)
    },
    methods: {
      search() {
        this.searchLoading = true
        this.searchData(this.query, this.pageNum, this.pageSize).then(() => {
          this.searchLoading = false
        })
      },
      fileClicked(search) {
        this.filePreviewVisible = true
        this.selectedFileId = search.fileId
        this.hasAttachment = !!search.attachmentId
      },
      attachmentClicked(search) {
        this.hasAttachment = !!search.attachmentId
        this.selectedFileId = search.fileId
        this.attachmentPreviewVisible = true
        let attachmentPath = search.attachmentPath
        if (isOfficeFile(attachmentPath)) {
          attachmentPath += '.pdf'
        }
        this.attachmentSuffix = search.attachmentSuffix || ''
        this.attachmentPath = '/system/admin/sysFile/preview?attachmentPath=' + attachmentPath +
          '&attachmentName=' + search.attachmentRealName +
          '&x=' + getToken()
        // 清除错误信息
        this.$refs['pdfView'] && this.$refs['pdfView'].resetError()
      },
      searchData(query, pageNum, pageSize) {
        return search(query, pageNum, pageSize).then((resp) => {
          this.pageNum = pageNum
          this.total = resp.data.data.total
          this.searchList = resp.data.data.rows
        })
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.listLoading = true
        this.searchData(this.query, this.pageNum, this.pageSize).then(() => {
          this.listLoading = false
        })
      },
      handleClose(done) {
        done()
        //        this.$confirm('确认关闭？')
        //          .then(_ => {
        //            done()
        //          })
        //          .catch(_ => {})
      }
    }
  }
</script>

<style scoped>
  .box-card{
    margin-top: 20px;
    cursor: pointer;
  }
  .text h3{
    margin: 0;
    font-size: 20px;
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
  .content {
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
  }
</style>
