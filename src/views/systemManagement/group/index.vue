<template>
  <div class="container">
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="70px" label="群组名">
            <el-input style='min-width:120px;' v-model="searchDepartmentName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="listLoading">查询</el-button>
        </el-col>
      </el-row>
      <div class="btn_box">
        <el-button class="el-button--primary hidden" code="add" @click="goAddGroup">添加群组</el-button>
        <el-button class="el-button--primary hidden" code="edit" @click="goEditGroup">修改群组</el-button>
        <el-button class="el-button--danger hidden" code="del" @click="deleteGroup">删除群组</el-button>
      </div>
      <el-dialog
        title="添加群组"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
          <el-form-item label="群组名" prop="groupName">
            <el-input v-model="addForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="groupDesc">
            <el-input type="textarea" v-model="addForm.groupDesc"></el-input>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="修改群组"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
          <el-form-item label="群组名" prop="groupName">
            <el-input v-model="editForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="groupDesc">
            <el-input type="textarea" v-model="editForm.groupDesc"></el-input>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="查看用户"
       :visible.sync="viewUserDialogVisible"
       width="80%"
       :before-close="handleClose">
        <view-user :groupId="selectedGroupId"></view-user>
      </el-dialog>
      <el-table
        :data="groupList"
        v-loading.body="listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="群组名称" width="200">
          <template slot-scope="scope">
            {{scope.row.groupName}}
          </template>
        </el-table-column>
        <el-table-column label="群组描述">
          <template slot-scope="scope">
            {{scope.row.groupDesc}}
          </template>
        </el-table-column>
        <el-table-column prop="groupUser" label="群组用户">
          <template slot-scope="scope">
            <el-button class="el-button--danger" code="viewUser" size="small" @click="checkUser(scope.row.id)">查看用户</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" code="add" size="small" @click="revampGroup(scope.row)">修改群组</el-button>
            <el-button type="danger" code="add" size="small" @click="removeGroup(scope.row)">删除群组</el-button>
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
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { listGroup, addGroup, updateGroup, removeGroup } from '@/api/group'
  import ViewUser from './viewUser'
  export default {
    name: 'group',
    components: {
      ViewUser
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        groupList: null,
        listLoading: false,
        treeVisible: false,
        searchDepartmentName: null,
        multipleSelection: [],
        dialogVisible: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        selectedGroupId: -1,
        addForm: {
          groupName: '',
          groupDesc: '',
          groupUser: ''
        },
        editForm: {
          groupName: '',
          groupDesc: '',
          groupUser: ''
        },
        rules: {
          groupName: [
            { required: true, message: '请输入群组名', tigger: 'blur' }
          ],
          groupDesc: [
            { required: true, message: '请输入群组描述', tigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData(null, this.pageNum, this.pagesize)
    },
    methods: {
      /* 初始化群组列表 */
      fetchData(groupName, pageNum, pageSize) {
        this.listLoading = true
        listGroup(
          groupName,
          pageNum,
          pageSize
        ).then(response => {
          this.groupList = response.data.data.rows
          this.groupList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
        this.pageNum = currentPage
        this.fetchData(this.searchDepartmentName, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.fetchData(this.searchDepartmentName, this.pageNum, this.pageSize)
      },
      /* 打开添加群组对话框 */
      goAddGroup() {
        this.dialogVisible = true
      },
      /* 打开修改角色对话框 */
      goEditGroup() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const group = this.multipleSelection[0]
        this.editForm.id = group.id
        this.editForm.groupName = group.groupName
        this.editForm.groupDesc = group.groupDesc
        this.editDialogVisible = true
      },
      /* 删除群组 */
      deleteGroup() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该群组，并且与该群组有关的所有权限也将一并删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          removeGroup(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData('', this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 行内修改群组 */
      revampGroup(group) {
        this.multipleSelection = []
        this.multipleSelection.push(group)
        this.editForm.groupName = group.groupName
        this.editForm.groupDesc = group.groupDesc
        this.editDialogVisible = true
      },
      /* 行内删除群组 */
      removeGroup(group) {
        this.$confirm('此操作将永久删除该群组，并且与该群组有关的所有权限也将一并删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          ids.push(group.id)
          removeGroup(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData('', this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 打开查看用户 */
      checkUser(groupId) {
        this.selectedGroupId = Number.parseInt(groupId)
        this.viewUserDialogVisible = true
        //  this.$router.push({ path: '/systemManagement/group/checkUser', query: { groupId: groupId }})
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              addGroup(
                this.addForm.groupName,
                this.addForm.groupDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.searchDepartmentName, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              const groupId = this.multipleSelection[0].id
              updateGroup(
                groupId,
                this.editForm.groupName,
                this.editForm.groupDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    const newList = Object.assign(
                      this.groupList[this.multipleSelection[0].idx],
                      {
                        id: groupId
                      },
                      this.editForm
                    )
                    this.editDialogVisible = false
                    this.$set(this.groupList, this.multipleSelection[0].idx, newList)
                    // this.fetchData(this.searchDepartmentName, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
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
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
