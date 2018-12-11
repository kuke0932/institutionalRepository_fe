<template>
  <div class="container">
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="70px" label="登录名">
            <el-input style='min-width:120px;' v-model="searchLoginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label-width="80px" label="用户昵称">
            <el-input style='min-width:120px;' v-model="searchUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button style="margin-left: 20px;" type="primary" @click="searchUser" :loading="listLoading">查询</el-button>
        </el-col>
      </el-row>
      <div class="btn_box">
        <el-button class="el-button--primary" code="add" @click="goAddGroupUser">添加群组用户</el-button>
        <el-dialog
          title="添加群组用户"
          :visible.sync="dialogVisible"
          width="80%"
          append-to-body
          :before-close="handleClose">
          <el-row>
            <el-col :span="5">
              <el-button class="el-button--primary" size="small" code="save" @click="saveAddUser">保存</el-button>
              <h4 style="margin-top: 0;color:#606266">部门列表</h4>
              <el-tree
                :data="departmentTree"
                node-key="id"
                ref="tree"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
                @node-click="handleNodeClick">
              </el-tree>
            </el-col>
            <el-col :span="18">
              <el-form>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="70px" label="登录名">
                      <el-input v-model="searchUnLoginName" style='min-width:120px;'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="80px" label="用户昵称">
                      <el-input v-model="searchUnUserName" style='min-width:120px;'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button style="margin-left: 20px;" type="primary"  @click="searchUnUser" :loading="listLoading">查询</el-button>
                  </el-col>
                </el-row>
                <el-table
                  :data="userList"
                  v-loading.body="listLoading"
                  element-loading-text="拼命加载中"
                  border
                  fit
                  tooltip-effect="dark"
                  highlight-current-row
                  @selection-change="handleSelectionChange"
                  style="width: 100%;margin-top: 20px;">
                  <el-table-column
                    type="selection"
                    width="50">
                  </el-table-column>
                  <el-table-column label="登录名">
                    <template slot-scope="scope">
                      {{scope.row.loginName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="部门">
                    <template slot-scope="scope">
                      {{scope.row.departmentName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="用户昵称">
                    <template slot-scope="scope">
                      {{scope.row.userName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="手机号">
                    <template slot-scope="scope">
                      {{scope.row.mobile}}
                    </template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                      {{scope.row.status == 1 ? '正常' : '冻结'}}
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="float:right;margin-top: 15px;"
                  background
                  layout="prev, pager, next"
                  :total="unTotal"
                  :page-size="unPageSize"
                  @current-change="handleCurrentPageChangeUser">
                </el-pagination>
              </el-form>
            </el-col>
          </el-row>
        </el-dialog>
        <el-button class="el-button--danger" code="del" @click="deleteGroupUser">删除群组用户</el-button>
      </div>
      <el-table
        :data="groupUserList"
        v-loading.body="listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleRemoveSelection">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          width="180">
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{scope.row.departmentName}}
          </template>
        </el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">
            {{scope.row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.status == 1 ? '正常' : '冻结'}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float:right;margin-top: 15px;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentPageChangeGroup">
      </el-pagination>
    </el-form>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { showGroupUsers, removeUserFromGroup, addUserToGroup, listUser } from '@/api/group'
  import { treeDepartment } from '@/api/department'
  export default {
    name: 'checkUser',
    props: {
      groupId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        total: -1,
        unTotal: -1,
        pageNum: 1,
        pageSize: 10,
        unPageNum: 1,
        unPageSize: 10,
        userList: null,
        multipleSelection: [],
        removeSelection: [],
        departmentTree: null,
        searchLoginName: null,
        searchUserName: null,
        searchUnUserName: null,
        searchUnLoginName: null,
        groupUserList: null,
        listLoading: false,
        treeVisible: false,
        dialogVisible: false,
        addForm: {
          groupName: '',
          groupDes: ''
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      groupId(val) {
        this.fetchData(this.groupId, null, null, this.pageNum, this.pageSize)
        this.initDepartmentTree()
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData(this.groupId, null, null, this.pageNum, this.pageSize)
      this.initDepartmentTree()
    },
    methods: {
      /* 初始化用户列表 */
      fetchData(groupId, loginName, userName, pageNum, pageSize) {
        this.listLoading = true
        showGroupUsers(
          groupId,
          loginName,
          userName,
          pageNum,
          pageSize
        ).then(response => {
          this.groupUserList = response.data.data.rows
          this.groupUserList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 查询群组下用户 */
      searchUser() {
        this.fetchData(this.groupId, this.searchLoginName, this.searchUserName, this.pageNum, this.pageSize)
      },
      /* 查询未在群组下用户 */
      searchUnUser() {
        this.getUserList(this.groupId, this.departmentId, this.searchUnLoginName, this.searchUnUserName, 2, this.pageNum, this.pageSize)
      },
      /* 初始化部门树 */
      initDepartmentTree() {
        treeDepartment().then(response => {
          this.departmentTree = response.data.data
        })
      },
      /* 获取部门下用户信息 */
      getUserList(groupId, departmentId, loginName, userName, showOrAdd = 2, pageNum, pageSize) {
        this.listLoading = true
        listUser(
          groupId,
          departmentId,
          loginName,
          userName,
          showOrAdd,
          pageNum,
          pageSize
        ).then(response => {
          this.userList = response.data.data.rows
          this.userList.forEach((e, i) => { e['idx'] = i })
          this.unTotal = response.data.data.total
          this.unPageNum = response.data.data.pageNum
          this.unPageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 群组用户表格当前页事件 */
      handleCurrentPageChangeGroup(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.groupId, this.searchLoginName, this.searchUserName, this.pageNum, this.pageSize)
      },
      /* 添加用户列表 */
      handleCurrentPageChangeUser(currentPage) {
        this.pageNum = currentPage
        this.getUserList(this.groupId, this.departmentId, this.searchUnLoginName, this.searchUnUserName, 2, this.unPageNum, this.unPageSize)
      },
      /* 树点击事件，拿当前node的id */
      handleNodeClick(data) {
        this.departmentId = data.id
        if (!data.parentId) {
          this.departmentId = null
        }
        this.getUserList(this.groupId, this.departmentId, null, null, 2, this.unPageNum, this.unPageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 获取所勾选用户 */
      handleRemoveSelection(val) {
        this.removeSelection = val
      },
      /* 打开添加群组用户 */
      goAddGroupUser() {
        this.dialogVisible = true
        this.getUserList(this.groupId, this.departmentId, null, null, 2, this.unPageNum, this.unPageSize)
      },
      saveAddUser() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('确定保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          addUserToGroup(this.groupId, ids.join(',')).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功',
              duration: 2000,
              onClose: () => {
                this.fetchData(this.groupId, this.searchLoginName, this.searchUserName, this.pageNum, this.pageSize)
                this.dialogVisible = false
              }
            })
          })
        })
      },
      /* 删除群组用户 */
      deleteGroupUser() {
        if (this.removeSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该角色，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.removeSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          removeUserFromGroup(this.groupId, ids.join(',')).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData(this.groupId, this.searchLoginName, this.searchUserName, this.pageNum, this.pageSize)
              }
            })
          })
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
        }).catch(() => {

        })
      }
    }
  }
</script>
<style scoped>
</style>
