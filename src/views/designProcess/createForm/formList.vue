<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="表名" label-width="63px">
          <el-input v-model="searchFormName"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="default" >重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary" code="edit" @click="goAddForm">添加</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditForm('no')">修改</el-button>
      <el-button class="el-button--danger hidden" code="del" :loading="removeLoading" @click="deleteForm(1)">删除</el-button>
      <el-button class="el-button--default hidden" code="detail" @click="goForDetail('no')">详情</el-button>
    </div>
    <el-table
      :data="formList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="表名">
        <template slot-scope="scope">
          {{scope.row.formName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.roleValue}}
        </template>
      </el-table-column>
      <el-table-column label="表单描述">
        <template slot-scope="scope">
          {{scope.row.formDescription}}
        </template>
      </el-table-column>
      <el-table-column label="数据库表名">
        <template slot-scope="scope">
          {{scope.row.databaseFormName}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" code="edit" size="mini" @click="goEditForm(scope.row.id)">修改</el-button>
          <el-button type="danger" code="del" size="mini" @click="deleteForm(2, scope.row)">删除</el-button>
          <el-button type="default" code="detail" size="mini" @click="goForDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 15px;"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :page-sizes="[10, 15, 20, 25, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { formList, removeForm } from '@/api/createForm'
  export default {
    name: 'formList',
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        formList: null,
        multipleSelection: [],
        searchFormName: null,
        searchRoleValue: null,
        listLoading: true,
        searchLoading: false, // 查询按钮
        loadingText: '拼命加载中......', // 提示的文字
        removeLoading: false, // 删除按钮
        rules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ],
          roleValue: [
            { required: true, message: '请输入角色值', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请选择角色描述', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.listLoading = true
      authMenuButton(location.hash.substring(2))
      this.fetchData(this.searchFormName, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化角色列表 */
      fetchData(name, pageNum, pageSize) {
        this.listLoading = true
        return formList(
          name,
          pageNum,
          pageSize
        ).then(resp => {
          this.formList = resp.data.data.rows
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchFormName, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        console.log(1)
        this.fetchData(this.searchFormName, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.fetchData(this.searchFormName, this.pageNum, this.pageSize).then((resp) => {
          this.searchLoading = false
        })
      },
      goAddForm() {
        this.$router.push({ path: '/designProcess/createForm/index' })
      },
      /* 打开修改角色对话框 */
      goEditForm(id) {
        if (id !== 'no') {
          this.$router.push({ path: '/designProcess/createForm/editForm', query: { formId: id }})
        } else {
          if (this.multipleSelection.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return
          }
          this.$router.push({ path: '/designProcess/createForm/editForm', query: { formId: this.multipleSelection[0].id }})
        }
      },
      /* 打开修改角色对话框 */
      goForDetail(id) {
        if (id !== 'no') {
          this.$router.push({ path: '/designProcess/createForm/formDetail', query: { formId: id }})
        } else {
          if (this.multipleSelection.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return
          }
          this.$router.push({ path: '/designProcess/createForm/formDetail', query: { formId: this.multipleSelection[0].id }})
        }
      },
      /* 删除表单 */
      deleteForm(type, item) {
        if (type === 1) {
          if (this.multipleSelection.length < 1) {
            this.$message({
              type: 'warning',
              message: '请至少选中一行再执行此操作',
              duration: 1500
            })
            return
          }
          this.$confirm('此操作将永久删除该表单，是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeLoading = true
            this.listLoading = true
            const rows = this.multipleSelection
            const ids = []
            for (let i = 0; i < rows.length; i++) {
              ids.push(rows[i].id)
            }
            removeForm(ids.join(',')).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(this.searchRoleName, this.pageNum, this.pageSize).then((resp) => {
                    this.removeLoading = false
                    this.listLoading = false
                  })
                }
              })
            }).catch(e => {
              this.removeLoading = false
              this.listLoading = false
            })
          })
        } else {
          this.$confirm('此操作将永久删除该表单，是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeLoading = true
            this.listLoading = true
            removeForm(item.id).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(this.searchRoleName, this.pageNum, this.pageSize).then((resp) => {
                    this.removeLoading = false
                    this.listLoading = false
                  })
                }
              })
            }).catch(e => {
              this.removeLoading = false
              this.listLoading = false
            })
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
