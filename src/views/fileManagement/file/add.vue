<template>
  <el-form ref="addForm" :rules="rules" :model="form" label-width="100px">
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
      <tinymce id="tinymce" :value="form.fileContent" ></tinymce>
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
      <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
      <el-button @click="resetForm('addForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>


<script>
  import { addFile } from '@/api/file'
  import Tinymce from '@/components/Tinymce'
  import { getToken } from '@/utils/auth'
  import UUID from 'uuid'
  export default {
    name: 'addFolder',
    components: {
      Tinymce
    },
    props: {
      folder: {
        type: Object,
        required: true,
        default: { id: '', label: '' }
      }
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
    mounted() {
    },
    methods: {
      submitForm() {
        this.form.fileList = []
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            this.form.fileContent = window.tinymce.get('tinymce').getContent()
            this.attachmentList.forEach(v => {
              this.form.fileList.push(v.response.data)
            })
            addFile(
              this.folder.id,
              this.uploadData.folderName,
              this.form.fileRealName,
              this.form.fileDesc,
              this.form.fileTitle,
              this.form.fileContent,
              1,
              this.form.fileExtendParentPermission,
              this.form.fileSort,
              this.form.fileList).then(resp => {
              this.$message({
                type: 'success',
                message: resp.data.message,
                onClose: () => {
                  this.$refs['addForm'].resetFields()
                  this.$emit('closeDialog', 'add')
                  this.attachmentList = []
                }
              })
            })
          } else {
            return false
          }
        })
      },
      generateUUID() {
        this.uploadData.folderName = UUID.v1()
      },
      /* 文件上传成功后回调 */
      handleSuccess(response, file, fileList) {
        this.attachmentList = fileList
      },
      /* 上传之前对文件格式和大小做验证 */
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
            this.attachmentList = fileList
          }).catch((e) => {
            reject('cancle')
          })
        })
      },
      clearData() {
        this.$refs['addForm'].resetFields()
        this.attachmentList = []
      },
      resetForm() {
        this.$refs['addForm'].resetFields()
        window.tinymce.get('tinymce').setContent('')
      }
    }
  }
</script>
