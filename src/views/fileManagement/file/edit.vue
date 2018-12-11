<template>
  <el-form ref="editForm" :rules="rules" :model="form" label-width="100px">
    <el-form-item label="文件夹名" prop="folderName">
      <el-input v-model="form.folderName" readonly></el-input>
    </el-form-item>
    <el-form-item label="文件名" prop="fileRealName">
      <el-input v-model="form.fileRealName"></el-input>
    </el-form-item>
    <el-form-item label="文件标题" prop="fileTitle">
      <el-input v-model="form.fileTitle"></el-input>
    </el-form-item>
    <el-form-item label="文件简介" prop="fileDesc">
      <el-input type="textarea" v-model="form.fileDesc"></el-input>
    </el-form-item>
    <el-form-item label="文件内容" prop="fileContent">
      <tinymce id="tinymceEdit" :value="form.fileContent" ></tinymce>
    </el-form-item>
    <el-form-item label="文件顺序" prop="fileSort">
      <el-input v-model="form.fileSort" type="number"></el-input>
    </el-form-item>
    <el-form-item label="是否继承父文件夹权限" prop="fileExtendParentPermission">
      <el-tooltip :content="form.fileExtendParentPermission == 1 ? '是' : '否'" placement="top">
        <el-switch
          v-model="form.fileExtendParentPermission"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-tooltip>
    </el-form-item>
    <!--<el-form-item label="上传附件" prop="fileList">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleFileListChange"
        :file-list="form.fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>-->
    <el-form-item label="上传附件">
      <el-upload
        action="/system/admin/sysFile/uploadFile"
        :on-success="handleSuccess"
        :data="uploadData"
        :before-start="beforeStart"
        :before-remove="beforeRemove"
        :file-list="attachmentList"
        accept=".xls,.xlsx,.doc,.docx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.bmp"
        :headers="headers">
        <el-button  size="small" type="primary">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传 .xls,.xlsx,.doc,.docx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.bmp文件，且不超过10M</div>
      </el-upload>
    </el-form-item>
    <el-form-item class="btn_box">
      <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>


<script>
  import { updateFile, getFileById, listFileAttachment } from '@/api/file'
  import Tinymce from '@/components/Tinymce'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'addFolder',
    props: {
      folder: {
        type: Object,
        required: true,
        default: { id: '', label: '' }
      },
      fileId: {
        type: String,
        required: true
      }
    },
    components: {
      Tinymce
    },
    data() {
      return {
        headers: {
          'x-auth-token': getToken()
        },
        attachmentList: [],
        uploadData: {
          folderName: ''
        },
        form: {
          fileRealName: '',
          fileTitle: '',
          fileContent: '',
          fileDesc: '',
          folderName: this.folder.label,
          fileSort: '',
          fileExtendParentPermission: '0',
          fileList: []
        },
        rules: {
          fileRealName: [
            { required: true, message: '请输入文件名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
          ],
          fileTitle: [
            { required: true, message: '请输入文件标题', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在1到32个字符之间', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      fileId(cur, old) {
        this.$refs['editForm'].resetFields()
        getFileById(this.fileId).then(resp => {
          const sysFile = resp.data.data
          this.form.fileRealName = sysFile.fileRealName
          this.form.fileTitle = sysFile.fileTitle
          this.form.fileContent = sysFile.fileContent
          this.form.fileDesc = sysFile.fileDesc
          this.form.fileSort = sysFile.fileSort || ''
          this.form.fileExtendParentPermission = sysFile.fileExtendParentPermission + ''
          this.uploadData.folderName = sysFile.fileName
        })
        this.attachmentList = []
        listFileAttachment(this.fileId).then((resp) => {
          const attachmentList = resp.data.data
          attachmentList.forEach(e => {
            this.attachmentList.push({
              name: e.attachmentRealName,
              url: '',
              response: {
                data: e,
                message: 'ok!',
                status: 200
              }
            })
          })
        })
      }
    },
    mounted() {
      getFileById(this.fileId).then(resp => {
        const sysFile = resp.data.data
        this.form.fileRealName = sysFile.fileRealName
        this.form.fileTitle = sysFile.fileTitle
        this.form.fileContent = sysFile.fileContent
        this.form.fileDesc = sysFile.fileDesc
        this.form.fileSort = sysFile.fileSort || ''
        this.form.fileExtendParentPermission = sysFile.fileExtendParentPermission + ''
        this.uploadData.folderName = sysFile.fileName
      })
      this.attachmentList = []
      listFileAttachment(this.fileId).then((resp) => {
        const attachmentList = resp.data.data
        attachmentList.forEach(e => {
          this.attachmentList.push({
            name: e.attachmentRealName,
            url: '',
            response: {
              data: e,
              message: 'ok!',
              status: 200
            }
          })
        })
      })
    },

    methods: {
      submitForm() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            // id, fileFolderId, fileRealName, fileDesc, fileTitle, fileContent, fileStatus, fileExtendParentPermission, fileSort, attachmentList
            this.form.fileContent = window.tinymce.get('tinymceEdit').getContent()
            this.form.fileList = []
            this.attachmentList.forEach(v => {
              this.form.fileList.push(v.response.data)
            })
            updateFile(
              this.fileId,
              this.folder.id,
              this.form.fileRealName,
              this.form.fileDesc,
              this.form.fileTitle,
              this.form.fileContent,
              1,
              this.form.fileExtendParentPermission,
              this.form.fileSort,
              this.form.fileList
            ).then(resp => {
              this.$message({
                type: 'success',
                message: resp.data.message,
                onClose: () => {
                  this.$emit('closeDialog', 'edit')
                }
              })
            })
          } else {
            return false
          }
        })
      },
      /* 文件上传成功后回调 */
      handleSuccess(response, file, fileList) {
        this.attachmentList = fileList
      },
      beforeStart(file) {
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$message({
            type: 'warning',
            message: '上传文件大小不能超过 10MB!'
          })
        }
        return isLt2M
      },
      /* 删除已上传文件之前的回调 */
      beforeRemove(file, fileList) {
        return new Promise((resolve, reject) => {
          this.$confirm(`确定移除 ${file.name}？`).then(() => {
            resolve()
            this.attachmentList.forEach((e, i) => {
              if (e.uid === file.uid) {
                this.attachmentList.splice(i, 1)
              }
            })
          }).catch((e) => {
            reject('cancle')
          })
        })
      },
      clearData() {
        this.$refs['editForm'].resetFields()
        this.attachmentList = []
      },
      resetForm() {
        this.$refs['editForm'].resetFields()
        window.tinymce.get('tinymce').setContent('')
      }
    }
  }
</script>
