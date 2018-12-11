<template>
  <div class="container" style="margin-top: 20px;">
    <div class="btn_box" style="margin-bottom:15px" v-if="name == 'admin'">
      <el-button type="primary" size="small" code="addFolder" @click="addFolder">添加文件夹</el-button>
      <el-button type="primary" size="small" code="updateFolderSort" @click="updateFolderSort">修改文件夹顺序</el-button>
      <el-button type="primary" size="small" code="folderRename" @click="folderRename">重命名文件夹</el-button>
      <el-button type="danger" size="small" code="removeFolder" :disabled="editDisabled" @click="removeFolder">删除文件夹</el-button>
      <el-button type="primary" size="small" code="setFolderPermission" @click="setFolderPermission">设置权限</el-button>
      <el-button type="primary" size="small" code="viewFolderPermission" @click="viewFolderPermission">查看权限</el-button>
    </div>
    <div class="btn_box top" style="margin-bottom:15px" v-else>
      <el-button type="primary" class="hidden" size="small" code="addFolder" @click="addFolder">添加文件夹</el-button>
      <el-button type="primary" class="hidden" size="small" code="updateFolderSort" @click="updateFolderSort">修改文件夹顺序</el-button>
      <el-button type="primary" class="hidden" size="small" code="folderRename" @click="folderRename">重命名文件夹</el-button>
      <el-button type="danger" class="hidden" size="small" code="removeFolder" :disabled="editDisabled" @click="removeFolder">删除文件夹</el-button>
      <el-button type="primary" class="hidden" size="small" code="setFolderPermission" @click="setFolderPermission">设置权限</el-button>
      <el-button type="primary" class="hidden" size="small" code="viewFolderPermission" @click="viewFolderPermission">查看权限</el-button>
    </div>

    <el-dialog
      title="添加文件夹"
      :visible.sync="addFolderVisible"
      width="80%"
      :before-close="handleClose">
      <add-folder :parentFolder="selectedFolder" ref="addFolder"
                  v-on:closeAddDialog="closeAddDialog"></add-folder>
    </el-dialog>
    <el-dialog
      title="设置权限"
      :visible.sync="setPermissionVisible"
      width="80%"
      :before-close="handleClose">
      <set-permission :parentFolder="selectedFolder" ref="setPermission"
                      v-on:closeSetPermission="closeSetPermission"></set-permission>
    </el-dialog>
    <el-dialog
      title="查看权限"
      :visible.sync="viewPermissionVisible"
      width="80%"
      :before-close="handleClose">
      <view-permission :parentFolder="selectedFolder" ref="viewPermission"></view-permission>
    </el-dialog>

    <el-row style="position:fixed;top:150px;width:80%">
      <el-col :span="5">
        <h4 style="margin-top: 0;color:#606266">文件夹列表</h4>
        <el-tree
          :data="treeFolder"
          node-key="id"
          ref="tree"
          :highlight-current='true'
          :props="defaultProps"
          :expand-on-click-node='false'
          :default-expanded-keys="defaultExpandedKeys"
          @node-click="selectNode">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-form ref="folderForm" :model="folderForm" :rules="rules" label-width="160px">
          <el-form-item label="文件夹名" prop="folderName">
            <el-input :readonly="!(updateType == 'folderRename')" v-model="folderForm.folderName"></el-input>
          </el-form-item>
          <el-form-item label="父文件夹" prop="fatherFloder">
            <el-input readonly="readonly" v-model="folderForm.parentFolderLabel"></el-input>
          </el-form-item>
          <el-form-item label="是否继承父文件夹权限" prop="folderExtendParentPermission">
            <el-tooltip :content="folderForm.folderExtendParentPermission == 1 ? '是' : '否'" placement="top">
              <el-switch
                v-model="folderForm.folderExtendParentPermission"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                :disabled="true"
                inactive-value="0">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="文件夹顺序" prop="folderSort">
            <el-input :readonly="!(updateType == 'updateFolderSort') " v-model="folderForm.folderSort"></el-input>
          </el-form-item>
          <el-form-item class="btn_box" v-show="isSaveShow">
            <el-button type="primary" @click="submitForm('folderForm')">保存</el-button>
            <el-button @click="resetForm('folderForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { treeFolderPermission, getFolderById, folderRename, updateFolderSort, removeFolder } from '@/api/folder'
  import AddFolder from './addFolder'
  import SetPermission from './setPermission.vue'
  import ViewPermission from './viewPermission'

  export default {
    name: 'folder',
    components: {
      AddFolder,
      SetPermission,
      ViewPermission
    },
    data() {
      return {
        folderId: null,
        isSaveShow: false,
        canUpdate: false,
        updateType: '',
        addFolderVisible: false,
        setPermissionVisible: false,
        viewPermissionVisible: false,
        selectedFolder: null,
        makeUpdate: false,
        editDisabled: false,
        folderForm: {
          folderName: '',
          parentFolderLabel: '',
          folderExtendParentPermission: '',
          folderSort: ''
        },
        rules: {

        },
        treeFolder: null,
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ])
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      /* 初始化文件夹树 */
      fetchData() {
        return treeFolderPermission().then(resp => {
          this.treeFolder = resp.data.data
        })
      },
      /* 点击左侧文件夹，右侧显示详情 */
      selectNode(val) {
        this.selectedFolder = val
        this.editDisabled = val.id === 1
        if (this.isSaveShow) {
          this.$confirm('尚未保存修改，要放弃修改吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isSaveShow = false
            this.canUpdate = false
          }).catch(() => {
            return
          })
        }
        const allButtons = document.querySelectorAll('.btn_box.top button')
        if (val.folderPrivate === 1) {
          allButtons && allButtons.forEach(b => {
            b.style.display = 'inline'
          })
        } else {
          allButtons && allButtons.forEach(b => {
            b.style.display = 'none'
          })
          val.permissionList && val.permissionList.forEach(e => {
            const buttons = document.querySelectorAll('button[code=\'' + e.filePermissionCode + '\']')
            buttons && buttons.forEach(b => {
              b.style.display = 'inline'
            })
          })
        }
        this.folderId = val.id

        getFolderById(val.id).then(resp => {
          const folder = resp.data.data
          this.folderForm.folderName = folder.folderName
          this.folderForm.parentFolderLabel = folder.parentFolder && folder.parentFolder.folderName
          this.folderForm.folderExtendParentPermission = folder.folderExtendParentPermission + ''
          this.folderForm.folderSort = folder.folderSort
        })
      },
      /* 打开添加窗口 */
      addFolder() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.addFolderVisible = true
      },
      /* 关闭添加窗口 */
      closeAddDialog(parentId) {
        this.addFolderVisible = false
        this.fetchData().then(_ => {
          this.defaultExpandedKeys = [parentId]
        })
      },
      /* 关闭设置权限窗口 */
      closeSetPermission() {
        this.setPermissionVisible = false
        // this.fetchData()
      },
      /* 文件夹重命名 */
      folderRename() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.updateType = 'folderRename'
        this.isSaveShow = true
        this.canUpdate = true
      },
      /* 修改文件夹顺序 */
      updateFolderSort() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.updateType = 'updateFolderSort'
        this.isSaveShow = true
        this.canUpdate = true
      },
      /* 修改顺序和重命名的提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let promise
            if (this.updateType === 'folderRename') {
              promise = folderRename(this.selectedFolder.id, this.folderForm.folderName)
            } else if (this.updateType === 'updateFolderSort') {
              promise = updateFolderSort(this.selectedFolder.id, this.folderForm.folderSort)
            }
            promise.then(resp => {
              this.canUpdate = false
              this.isSaveShow = false
              this.updateType = ''
              this.$message({
                type: 'success',
                message: resp.data.message,
                onClose: () => {
                  this.fetchData().then(_ => {
                    this.$refs['tree'].setCurrentKey(this.selectedFolder.id)
                    this.defaultExpandedKeys = [this.selectedFolder.parentId]
                  })
                }
              })
            }).catch(e => {
              this.canUpdate = false
              this.isSaveShow = false
              this.updateType = ''
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 删除树形数组里面的node */
      iteratorTree(data, id) {
        data.forEach(v => {
          if (v.id === id) {
            const index = data.indexOf(v)
            data.splice(index, 1)
          } else {
            if (!v.children) {
              return
            }
            this.iteratorTree(v.children, id)
          }
        })
      },
      /* 删除文件夹 */
      removeFolder() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.$confirm('此操作将永久删除该文件夹，并且与该文件夹有关的所有权限和该文件夹下的所有文件也将一并删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeFolder(this.folderId).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              onClose: () => {
                const id = this.$refs['tree'].getCurrentNode().id
                this.iteratorTree(this.treeFolder, id)
              }
            })
          })
        })
      },
      /* 打开设置权限窗口 */
      setFolderPermission() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.setPermissionVisible = true
        this.$nextTick(() => {
          this.$refs.setPermission.fetchData()
        })
      },
      /* 查看权限 */
      viewFolderPermission() {
        if (!this.folderId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.viewPermissionVisible = true
        this.$nextTick(() => {
          this.$refs.viewPermission.fetchData()
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs.addFolder && this.$refs.addFolder.clearData()
          this.$refs.setPermission && this.$refs.setPermission.clearData()
          this.$refs.viewPermission && this.$refs.viewPermission.clearData()
        }).catch((val) => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
