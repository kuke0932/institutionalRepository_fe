<template>
  <div class="container">
    <el-row>
      <el-col :span="4">
        <h4 style="margin-top: 0;color:#606266">文件夹列表</h4>
        <el-tree
          :data="treeFolder"
          node-key="id"
          ref="tree"
          highlight-current
          :expand-on-click-node='false'
          @node-click="selectNode"
          :props="defaultProps">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="文件名">
                <el-input style='min-width:120px;' v-model="searchFileName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="100px" label="文件标题">
                <el-input style='min-width:120px;' v-model="searchFileTitle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary" @click="searchFile">查询</el-button>
            </el-col>
          </el-row>
          <div class="btn_box top">
            <el-button class="el-button--primary" code="addFile" @click="goAddFile">添加文件</el-button>
            <el-button class="el-button--primary" code="editFile" @click="goEditFile">修改文件</el-button>
            <el-button class="el-button--danger" code="removeFile" @click="deleteFile">删除文件</el-button>
            <el-button class="el-button--primary" code="copyFile" @click="copyFile">复制文件</el-button>
            <el-button class="el-button--primary" code="moveFile" @click="moveFile">移动文件</el-button>
            <el-button class="el-button--primary" code="setFilePermission" @click="setPermission">设置权限</el-button>
            <el-button class="el-button--primary" code="viewFilePermission" @click="viewPermission">查看权限</el-button>
          </div>
          <el-dialog
              title="添加文件"
              :visible.sync="addDialogVisible"
              width="60%"
              :before-close="handleClose">
              <add :folder="selectedFolder" ref="addFile" v-on:closeDialog="closeDialog"></add>
            </el-dialog>
            <el-dialog
              title="修改文件"
              :visible.sync="editDialogVisible"
              width="60%"
              :before-close="handleClose">
              <edit :folder="selectedFolder" :fileId="selectedFileId.toString()" v-on:closeDialog="closeDialog"></edit>
            </el-dialog>
            <el-dialog
              title="复制文件"
              :visible.sync="copyDialogVisible"
              width="60%"
              :before-close="handleClose">
              <copy :folder="selectedFolder" :fileIds="selectedFileIds" v-on:closeDialog="closeDialog"></copy>
            </el-dialog>
            <el-dialog
              title="移动文件"
              :visible.sync="moveDialogVisible"
              width="60%"
              :before-close="handleClose">
              <move :folder="selectedFolder" :fileIds="selectedFileIds" v-on:closeDialog="closeDialog"></move>
            </el-dialog>
            <el-dialog
              title="设置权限"
              :visible.sync="setPermissionVisible"
              width="80%"
              :before-close="handleClose">
              <set-permission :fileId="selectedFileId" ref="setPermission"
                              v-on:closeSetPermission="closeSetPermission"></set-permission>
            </el-dialog>
            <el-dialog
              title="查看权限"
              :visible.sync="viewPermissionVisible"
              width="80%"
              :before-close="handleClose">
              <view-permission :fileId="selectedFileId" ref="viewPermission"></view-permission>
            </el-dialog>
            <el-dialog
              title="预览"
              :visible.sync="previewVisible"
              width="80%"
              :before-close="handleClose">
              <preview :fileId="selectedFileId" ref="preview"></preview>
            </el-dialog>
          <el-table
            :data="tableData"
            border
            fit
            tooltip-effect="dark"
            highlight-current-row
            @row-click="rowClicked"
            @selection-change="selectionChange"
            style="width: 100%;margin-top: 20px;">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="fileRealName"
              label="文件名">
            </el-table-column>
            <el-table-column
              prop="folderName"
              label="文件夹名">
            </el-table-column>
            <el-table-column
              prop="fileTitle"
              label="文件标题">
            </el-table-column>
            <el-table-column
              prop="fileDesc"
              label="文件简介">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button style="margin-left: 10px;" type="primary" size="small" @click="download(scope.row.id, scope.row.fileRealName)">下载</el-button>
                <el-button type="primary" size="small" @click="previewAttachment(scope.row.id)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="float:right;margin-top: 15px;"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handleCurrentPageChange">
          </el-pagination>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { treeFolder } from '@/api/folder'
  import { listFile, removeFile } from '@/api/file'
  import Add from './add'
  import Edit from './edit'
  import Copy from './copy'
  import Move from './move'
  import ViewPermission from './viewPermission'
  import SetPermission from './setPermission'
  import Preview from './preview'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'file',
    components: {
      Add, Edit, Copy, Move, SetPermission, ViewPermission, Preview
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        treeVisible: false,
        addDialogVisible: false,
        editDialogVisible: false,
        copyDialogVisible: false,
        moveDialogVisible: false,
        setPermissionVisible: false,
        viewPermissionVisible: false,
        previewVisible: false,
        selectedFolder: null,
        selectedFileId: 0,
        selectedFileIds: '',
        searchFileName: null,
        searchFileTitle: null,
        multipleSelection: [],
        editForm: {
          fileName: '',
          folderId: '',
          folderName: '',
          fileSize: '',
          userName: '',
          fileExtension: ''
        },
        tableData: [],
        treeFolder: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      this.fetchTreeData()
    },
    methods: {
      fetchTreeData() {
        treeFolder().then(resp => {
          this.treeFolder = resp.data.data
        })
      },
      /* 树的点击事件 */
      selectNode(val) {
        this.selectedFolder = val
        this.fetchFileData(val.id, this.searchFileName, this.searchFileTitle, this.pageNum, this.pageSize)
      },
      /* 查询 */
      searchFile() {
        this.fetchFileData(this.selectedFolder.id, this.searchFileName, this.searchFileTitle, this.pageNum, this.pageSize)
      },
      /* 获取文件列表 */
      fetchFileData(folderId, fileRealName, fileTitle, pageNum, pageSize) {
        listFile(folderId, fileRealName, fileTitle, pageNum, pageSize).then(resp => {
          this.tableData = resp.data.data.rows
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
        })
      },
      selectionChange(val) {
        this.multipleSelection = val
      },
      rowClicked(val) {

      },
      goAddFile() {
        if (!(this.selectedFolder && this.selectedFolder.id)) {
          this.$message({
            message: '请选择左侧文件夹！',
            type: 'warning'
          })
        } else {
          this.addDialogVisible = true
          this.$nextTick(() => {
            this.$refs['addFile'].generateUUID()
          })
        }
      },
      goEditFile() {
        if (!this.isCheckedOne()) {
          return
        }
        this.selectedFileId = this.multipleSelection[0].id
        this.editDialogVisible = true
      },
      /* 打包下载文件 */
      download(fileId, fileName) {
        window.open('/system/admin/sysFile/downloadZip?fileId=' + fileId + '&fileName=' + fileName + '&x=' + getToken())
      },
      deleteFile() {
        if (this.isCheckedMany()) {
          const ids = this.multipleSelection.map(t => t.id).join(',')
          removeFile(ids).then(resp => {
            this.$message({
              type: 'success',
              message: resp.data.message,
              onClose: () => {
                listFile(this.selectedFolder.id, '', '', this.pageNum).then(resp => {
                  this.tableData = resp.data.data.rows
                  this.total = resp.data.data.total
                  this.pageNum = resp.data.data.pageNum
                })
              }
            })
          })
        }
      },
      copyFile() {
        if (this.isCheckedMany()) {
          this.selectedFileIds = this.multipleSelection.map(t => t.id).join(',')
          this.copyDialogVisible = true
        }
      },
      moveFile() {
        if (this.isCheckedMany()) {
          this.selectedFileIds = this.multipleSelection.map(t => t.id).join(',')
          this.moveDialogVisible = true
        }
      },
      /* 打开设置权限窗口 */
      setPermission() {
        if (!this.isCheckedOne()) {
          return
        }
        this.selectedFileId = this.multipleSelection[0].id
        this.setPermissionVisible = true
        this.$nextTick(() => {
          this.$refs.setPermission.fetchData()
        })
      },
      /* 打开预览窗口 */
      previewAttachment(id) {
        this.selectedFileId = id
        this.previewVisible = true
      },
      /* 关闭设置权限窗口 */
      closeSetPermission() {
        this.setPermissionVisible = false
      },
      /* 打开查看权限窗口 */
      viewPermission() {
        if (!this.isCheckedOne()) {
          return
        }
        this.selectedFileId = this.multipleSelection[0].id
        this.viewPermissionVisible = true
        this.$nextTick(() => {
          this.$refs.viewPermission.fetchData()
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      closeDialog(add) {
        listFile(this.selectedFolder.id, '', '').then(resp => {
          this.tableData = resp.data.data.rows
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
        })
        if (add === 'add') {
          this.addDialogVisible = false
        } else if (add === 'edit') {
          this.editDialogVisible = false
        } else if (add === 'copy') {
          this.copyDialogVisible = false
        } else if (add === 'move') {
          this.moveDialogVisible = false
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs.setPermission && this.$refs.setPermission.clearData()
          this.$refs.viewPermission && this.$refs.viewPermission.clearData()
          this.$refs.addFile && this.$refs.addFile.clearData()
        }).catch(() => {

        })
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchFileData(this.selectedFolder.id, this.searchFileName, this.searchFileTitle, this.pageNum, this.pageSize)
      },
      isCheckedOne() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return false
        }
        return true
      },
      isCheckedMany() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!'
          })
          return false
        }
        return true
      }
    }
  }
</script>

<style scoped>
</style>
