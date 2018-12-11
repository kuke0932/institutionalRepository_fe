<template>
  <div class="container">
    <el-tabs v-model="activeName" style="width: 100%" @tab-click="handleClick">
      <el-tab-pane label="角色" name="first">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="角色名">
                <el-input style='min-width:120px;' v-model="searchRoleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="80px" label="角色值">
                <el-input style='min-width:120px;' v-model="searchRoleValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary" @click="searchRole">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="roleData"
            border
            ref="role"
            fit
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;margin-top: 20px;">
            <el-table-column label="角色名" width="180">
              <template slot-scope="scope">
                {{scope.row.roleName}}
              </template>
            </el-table-column>
            <el-table-column label="角色值" width="180">
              <template slot-scope="scope">
                {{scope.row.roleValue}}
              </template>
            </el-table-column>
            <el-table-column label="角色描述">
              <template slot-scope="scope">
                {{scope.row.roleDesc}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="viewFilePermission('role', scope.row.id)">查看文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="部门" name="second">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="部门名">
                <el-input style='min-width:120px;' v-model="searchDepartmentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="80px" label="父部门">
                <el-input style='min-width:120px;' v-model="searchParentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary" @click="searchDepartment">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="departmentData"
            border
            ref="department"
            fit
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;margin-top: 20px;">
            <el-table-column label="部门名">
              <template slot-scope="scope">
                {{scope.row.departmentName}}
              </template>
            </el-table-column>
            <!--<el-table-column prop="fatherDepartment" label="父部门" width="180">
            </el-table-column>
            <el-table-column prop="departmentDes" label="部门描述">
            </el-table-column>-->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="viewFilePermission('department', scope.row.id)">查看文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="群组" name="third">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="群组名">
                <el-input style='min-width:200px;' v-model="searchGroupName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3"  style="margin-left: 20px;">
              <el-button type="primary" @click="searchGroup">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="groupData"
            border
            ref="group"
            fit
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;margin-top: 20px;">
            <el-table-column label="群组名称" width="180">
              <template slot-scope="scope">
                {{scope.row.groupName}}
              </template>
            </el-table-column>
            <el-table-column label="群组描述" width="180">
              <template slot-scope="scope">
                {{scope.row.groupDesc}}
              </template>
            </el-table-column>
            <el-table-column label="群组用户">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showUser(scope.row.id)">查看用户</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="viewFilePermission('group', scope.row.id)">查看文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="查看权限"
      :visible.sync="permissionDialog"
      width="40%"
      append-to-body
      :before-close="handleClose">
      <el-tree
        :data="treePermission"
        ref="treePermission"
        highlight-current
        show-checkbox
        check-strictly
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node='false'
        style="padding:0 50px;">
      </el-tree>
    </el-dialog>
    <el-dialog
      title="查看用户"
      :visible.sync="showUsersDialog"
      width="60%"
      append-to-body
      :before-close="handleClose">
      <el-table
        :data="groupUsersData"
        v-loading.body="listGroupUsersLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;margin-top: 20px;">
        <el-table-column label="用户名称" width="180">
          <template slot-scope="scope">
            {{scope.row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="用户手机号" width="180">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="用户部门">
          <template slot-scope="scope">
            {{scope.row.departmentName}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="display: flex;  justify-content: flex-end;"
        background
        layout="prev, pager, next"
        :total="groupUsersTotal"
        :page-size="pageSize"
        @current-change="groupUsersCurrentPageChange">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { showAllFileRole, showAllFileDepartment, showAllFileGroup } from '@/api/file'
  import { treeDisabledPermission } from '@/api/folder'
  import { showGroupUsers } from '@/api/group'
  export default {
    name: 'viewPermission',
    props: {
      fileId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        groupUsersTotal: -1,
        activeName: 'first',
        pageNum: 1,
        pageSize: 10,
        listRoleLoading: false,
        listDepartmentLoading: false,
        listGroupLoading: false,
        listGroupUsersLoading: false,
        searchRoleName: null,
        searchRoleValue: null,
        searchDepartmentName: null,
        searchParentName: null,
        searchGroupName: null,
        permissionDialog: false,
        showUsersDialog: false,
        groupId: null,
        treePermission: [],
        checkedPermission: {
          id: null,
          permissionType: null,
          role: {},
          department: {},
          group: {}
        },
        roleData: [],
        departmentData: [],
        groupData: [],
        groupUsersData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      treeDisabledPermission().then(resp => {
        this.treePermission = resp.data.data
      })
    },
    updated() {
      this.$refs['role'].doLayout()
      this.$refs['department'].doLayout()
      this.$refs['group'].doLayout()
    },
    methods: {
      /* tab按钮 */
      handleClick(tab, event) {

      },
      /* 获取数据，供父页面调用 */
      fetchData() {
        this.fetchRoleData(this.fileId, null, null)
        this.fetchDepartmentData(this.fileId, null, null)
        this.fetchGroupData(this.fileId, null)
      },
      /* 获取角色列表 */
      fetchRoleData(fileId, roleName, roleValue) {
        this.listRoleLoading = true
        showAllFileRole(fileId, roleName, roleValue).then(response => {
          this.roleData = response.data.data
          this.roleData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.role[v.id] = pIds
          })
          this.listRoleLoading = false
        })
      },
      /* 获取部门列表 */
      fetchDepartmentData(fileId, departmentName, parentName) {
        this.listDepartmentLoading = true
        showAllFileDepartment(fileId, departmentName, parentName).then(response => {
          this.departmentData = response.data.data
          this.departmentData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.department[v.id] = pIds
          })
          this.listDepartmentLoading = false
        })
      },
      /* 获取群组列表 */
      fetchGroupData(fileId, groupName) {
        this.listGroupLoading = true
        showAllFileGroup(fileId, groupName).then(response => {
          this.groupData = response.data.data
          this.groupData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.group[v.id] = pIds
          })
          this.listGroupLoading = false
        })
      },

      /* 获取群组用户信息 */
      fetchGroupUsers(loginName, userName, pageNum, pageSize) {
        this.listGroupUsersLoading = true
        showGroupUsers(this.groupId, loginName, userName, pageNum, pageSize).then(resp => {
          this.groupUsersData = resp.data.data.rows
          this.groupUsersTotal = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.listGroupUsersLoading = false
        })
        this.showUsersDialog = true
      },
      /* 查看群组用户 */
      showUser(groupId) {
        this.groupId = groupId
        this.fetchGroupUsers(null, null, this.pageNum, this.pageSize)
      },

      /* 打开查看权限窗口 */
      viewFilePermission(type, id) {
        this.permissionDialog = true
        let nodes = []
        if (type === 'role') {
          nodes = this.checkedPermission.role[id] || []
        } else if (type === 'department') {
          nodes = this.checkedPermission.department[id] || []
        } else if (type === 'group') {
          nodes = this.checkedPermission.group[id] || []
        }
        setTimeout(() => {
          this.$refs.treePermission.setCheckedNodes(nodes)
        }, 0)
      },

      searchRole() {
        this.fetchRoleData(
          this.fileId,
          this.searchRoleName,
          this.searchRoleValue
        )
      },
      searchDepartment() {
        this.fetchDepartmentData(
          this.fileId,
          this.searchDepartmentName,
          this.searchParentName
        )
      },
      searchGroup() {
        this.fetchGroupData(
          this.fileId,
          this.searchGroupName
        )
      },
      clearData() {
        this.activeName = 'first'
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
      },
      /* 查看群组用户表格当前页事件 */
      groupUsersCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchGroupUsers(null, null, this.pageNum, this.pageSize)
      }
    }
  }
</script>

<style scoped>
</style>
