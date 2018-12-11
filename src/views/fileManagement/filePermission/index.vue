<template>
  <div class="container">
    <el-row>
      <div class="btn_box" style="margin-bottom: 15px;">
        <el-button class="el-button--primary" size="small" code="add" @click="goAddPermission">添加权限</el-button>
        <el-button class="el-button--primary" size="small" code="edit" :disabled="editDisabled" @click="goEditPermission">修改权限</el-button>
        <el-button class="el-button--danger" size="small" code="del" :disabled="editDisabled"  @click="deletePermission">删除权限</el-button>
        <el-dialog
          title="添加权限"
          :visible.sync="dialogVisible"
          width="40%"
          :before-close="handleClose">
          <el-popover
            ref="popoverTree"
            placement="bottom-start"
            title="权限列表"
            width="400"
            trigger="click">
            <el-tree
              :data="filePermissionTree"
              node-key="id"
              ref="treeAdd"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node='false'
              @node-click="addSelectParentPermission">
            </el-tree>
          </el-popover>
          <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
            <el-form-item label="权限名" prop="filePermissionName">
              <el-input v-model="addForm.filePermissionName"></el-input>
            </el-form-item>
            <el-form-item label="父权限" prop="parentPermission">
              <el-input v-popover:popoverTree readonly v-model="addForm.parentPermission"></el-input>
            </el-form-item>
            <el-form-item label="权限地址" prop="filePermissionUrl">
              <el-input v-model="addForm.filePermissionUrl"></el-input>
            </el-form-item>
            <el-form-item label="权限CODE" prop="filePermissionCode">
              <el-input v-model="addForm.filePermissionCode"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="filePermissionDesc">
              <el-input v-model="addForm.filePermissionDesc"></el-input>
            </el-form-item>
            <el-form-item label="权限顺序" prop="filePermissionSort">
              <el-input v-model="addForm.filePermissionSort"></el-input>
            </el-form-item>
            <el-form-item class="btn_box">
              <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <el-col :span="6">
        <h4 style="margin-top: 0;color:#606266">文件权限列表</h4>
        <el-tree
          :data="filePermissionTree"
          node-key="id"
          ref="tree"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-popover
          ref="popoverTree"
          placement="bottom-start"
          title="权限列表"
          width="400"
          trigger="click">
          <el-tree
            :data="filePermissionTree"
            node-key="id"
            ref="treeEdit"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node='false'
            @node-click="editSelectParentPermission">
          </el-tree>
        </el-popover>
        <el-form :disabled="editDisabled" ref="permissionForm" :model="permissionForm" :rules="rules" label-width="100px">
          <el-form-item label="权限名" prop="filePermissionName">
            <el-input :readonly="isReadonly" v-model="permissionForm.filePermissionName"></el-input>
          </el-form-item>
          <el-form-item v-show="!isReadonly" label="父权限" prop="parentPermission">
            <el-input v-popover:popoverTree readonly v-model="permissionForm.parentPermission"></el-input>
          </el-form-item>
          <el-form-item v-show="isReadonly" label="父权限" prop="parentPermission">
            <el-input readonly v-model="permissionForm.parentPermission"></el-input>
          </el-form-item>
          <el-form-item label="权限地址" prop="filePermissionUrl">
            <el-input :readonly="isReadonly" v-model="permissionForm.filePermissionUrl"></el-input>
          </el-form-item>
          <el-form-item label="权限CODE" prop="filePermissionCode">
            <el-input :readonly="isReadonly" v-model="permissionForm.filePermissionCode"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="filePermissionDesc">
            <el-input :readonly="isReadonly" v-model="permissionForm.filePermissionDesc"></el-input>
          </el-form-item>
          <el-form-item label="权限顺序" prop="filePermissionSort">
            <el-input :readonly="isReadonly" v-model="permissionForm.filePermissionSort"></el-input>
          </el-form-item>
          <el-form-item class="btn_box" v-show="isBtnShow">
            <el-button type="primary" @click="submitForm('permissionForm')">保存</el-button>
            <el-button @click="resetForm('permissionForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { treeFilePermission,
    addFilePermission,
    getPermissionById,
    updateFilePermission,
    removeFilePermission } from '@/api/filePermission'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'filePermission',
    data() {
      return {
        isReadonly: true,
        filePermissionTree: null,
        permissionId: null,
        dialogVisible: false,
        isBtnShow: false,
        editDisabled: false,
        permissionForm: {
          filePermissionName: null,
          parentPermission: null,
          filePermissionUrl: null,
          filePermissionDesc: null,
          filePermissionCode: null,
          filePermissionSort: null
        },
        addForm: {
          filePermissionName: null,
          parentPermission: null,
          filePermissionUrl: null,
          filePermissionDesc: null,
          filePermissionCode: null,
          filePermissionSort: null
        },
        rules: {},
        addRules: {
          filePermissionName: [
            { required: true, message: '请输入权限名', trigger: 'blur' }
          ],
          parentPermission: [
            { required: true, message: '请选择父权限' }
          ],
          filePermissionUrl: [
            { required: true, message: '请输入权限地址', trigger: 'blur' }
          ],
          filePermissionCode: [
            { required: true, message: '请输入权限CODE', trigger: 'blur' }
          ],
          filePermissionSort: [
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.initDepartmentTree()
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
    },
    methods: {
      /* 初始化文件权限树 */
      initDepartmentTree() {
        treeFilePermission().then(response => {
          this.filePermissionTree = response.data.data
        })
      },
      /*  树点击事件，拿当前node的id  */
      handleNodeClick(data, node) {
        if (data.id <= 4) {
          this.editDisabled = true
        } else {
          this.editDisabled = false
        }

        if (this.isBtnShow) {
          this.$confirm('尚未保存修改，要放弃修改吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isReadonly = true
            this.isBtnShow = false
            this.handleRules()
          }).catch(() => {
            return
          })
        }
        this.permissionId = data.id
        this.$refs['permissionForm'].resetFields()
        getPermissionById(this.permissionId).then(response => {
          const permission = response.data.data
          this.permissionForm.filePermissionName = permission.filePermissionName
          this.permissionForm.parentPermission = node.parent.data.label || '无'
          this.permissionForm.filePermissionUrl = permission.filePermissionUrl
          this.permissionForm.filePermissionDesc = permission.filePermissionDesc
          this.permissionForm.filePermissionCode = permission.filePermissionCode
          this.permissionForm.filePermissionSort = permission.filePermissionSort
        })
      },
      /*  打开添加窗口  */
      goAddPermission() {
        this.dialogVisible = true
      },
      /* 更改右侧为可编辑状态 */
      goEditPermission() {
        if (!this.permissionId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.isReadonly = false
        this.isBtnShow = true
        this.handleRules()
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
      /* 删除权限 */
      deletePermission() {
        if (!this.permissionId) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.$confirm('此操作将永久删除该权限，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeFilePermission(this.permissionId).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                const id = this.$refs['tree'].getCurrentNode().id
                this.iteratorTree(this.filePermissionTree, id)
              }
            })
          })
        })
      },
      /* 新增时的父权限点击事件 */
      addSelectParentPermission(node) {
        this.addForm.parentPermission = node.label
      },
      /* 修改时的父权限点击事件 */
      editSelectParentPermission(node) {
        this.permissionForm.parentPermission = node.label
      },
      /* 新增、修改的提交方法 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              addFilePermission(
                this.addForm.filePermissionName,
                this.$refs['treeAdd'].getCurrentKey(),
                this.addForm.filePermissionUrl,
                this.addForm.filePermissionDesc,
                this.addForm.filePermissionCode,
                this.addForm.filePermissionSort
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.initDepartmentTree()
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'permissionForm') {
              updateFilePermission(
                this.permissionId,
                this.permissionForm.filePermissionName,
                this.$refs['treeEdit'].getCurrentKey(),
                this.permissionForm.filePermissionUrl,
                this.permissionForm.filePermissionDesc,
                this.permissionForm.filePermissionCode,
                this.permissionForm.filePermissionSort
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    this.isReadonly = true
                    this.isBtnShow = false
                    this.handleRules()
                  }
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /*  重置表单  */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /*  手动关闭对话框  */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
        }).catch(() => {

        })
      },
      /* 只读状态下不显示验证 */
      handleRules() {
        if (!this.isReadonly) {
          this.rules = {
            filePermissionName: [
              { required: true, message: '请输入权限名', trigger: 'blur' }
            ],
            parentPermission: [
              { required: true, message: '请选择父权限' }
            ],
            filePermissionUrl: [
              { required: true, message: '请输入权限地址', trigger: 'blur' }
            ],
            filePermissionCode: [
              { required: true, message: '请输入权限CODE', trigger: 'blur' }
            ],
            filePermissionSort: [
              { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
            ]
          }
        } else {
          this.rules = {}
        }
      }
    }
  }
</script>

<style scoped>
</style>
