<template>
  <div class="container">
    <el-form>
      <el-row>
        <el-form class="searchForm" :inline="true">
          <el-form-item label-width="70px" label="完成状态" style="float: left">
            <el-select v-model="completeState" clearable>
              <el-option v-for="item in state" :key="item.stateValue" :label="item.stateName" :value="item.stateValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="70px" label="流程名称">
            <el-input style='min-width:120px;' v-model="processName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="taskFlowListData"
          element-loading-text="拼命加载中"
          v-loading="listLoading"
          border
          highlight-current-row>
          <el-table-column
            prop="number"
            label="编号">
            <template slot-scope="scope">
              {{scope.row.deploymentId}}
            </template>
          </el-table-column>
          <el-table-column
            label="流程名称">
            <template slot-scope="scope">
              {{scope.row.key}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 0 ? '已挂起' : '未挂起'}}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createTime | resetTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="版本号">
            <template slot-scope="scope">
              {{scope.row.version}}
            </template>
          </el-table-column>
          <el-table-column
            label="流程说明">
            <template slot-scope="scope">
              {{scope.row.description}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="310">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="compose(scope.row)"
                type="primary"
                size="mini"
                v-if="scope.row.status === 1">
                启动流程
              </el-button>
              <el-button
                type="primary"
                size="mini"
                disabled
                v-else>
                启动流程
              </el-button>
              <el-button
                @click.native.prevent="listDataHangUpBtn(scope.row)"
                type="primary"
                size="mini"
                v-if="scope.row.status === 1">
                流程挂起
              </el-button>
              <el-button
                @click.native.prevent="listDataActivationBtn(scope.row)"
                type="primary"
                size="mini"
                v-else>
                流程激活
              </el-button>
              <el-button
                @click.native.prevent="handleProcess(scope.row.id)"
                type="primary"
                size="mini">
                办理流程图
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="填写表单"
          :visible.sync="dialogVisible"
          @close='closeDialog'
          width="35%">
          <div v-loading="fillOutAForm" element-loading-text="拼命加载中">
            <div style="margin-top: -30px;">
              <el-button type="primary" @click="submitBtn">提交</el-button>
              <el-button type="primary">挂起</el-button>
              <el-button type="primary">撤销</el-button>
              <el-button type="primary">表单打印预览</el-button>
              <el-button type="primary">刷新</el-button>
            </div>
            <el-form-item label-width="70px" label="优先级" style="margin-top: 10px;">
              <el-select v-model="priority" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-tabs v-model="activeName" type="border-card" style="min-height: 500px; margin-top: -10px;">
              <el-tab-pane label="表单填写" name="tableFormat">
                <Form :label-width="100" class="b-a" style="height: 500px">
                  <renders v-for="(element,index) in formList" :key="index" :ele="element.ele" :obj="element.obj || {}"></renders>
                </Form>
              </el-tab-pane>
              <el-tab-pane label="添加任务附件" name="addAttachments">
                <div>
                  <el-button type="primary" @click="toggleSelection()">下载</el-button>
                  <el-button type="danger" @click="toggleSelection()">删除</el-button>
                  <el-upload
                    style="margin-top: 30px"
                    class="upload-demo"
                    drag
                    action='/business/process/upload'
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-dialog>
        <el-dialog title="办理流程图" :visible.sync="dialogTableVisible" style="width: 100%;">
          <div style="width: 100%; overflow: hidden" ref='btnImg' id="picDiv"><img :src="src" @mousedown="mousedown($event)" @mouseup='mouseup($event)' :draggable="true"></div>
        </el-dialog>
        <el-pagination
          style="float:right; margin-top: 15px;"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="handleCurrentPageChange">
        </el-pagination>
      </el-row>
    </el-form>
  </div>
</template>
<script>
    import moment from 'moment'
    import { taskFlowList, search, startupProcess, listDataPopUpHangUp, listDataActivation, closePopUp } from '@/api/taskFlow'
    import { submit, transfer } from '@/api/documentDraft'
    export default {
      name: 'taskFlow',
      data() {
        return {
          dialogVisible: false,
          closeDialogVisible: false, // 是否调用关闭弹窗方法
          total: -1,
          pageNum: 1,
          pageSize: 10,
          state: [{
            stateValue: 0,
            stateName: '挂起'
          }, {
            stateValue: 1,
            stateName: '未挂起'
          }],
          options: [{
            value: '0',
            label: '普通'
          }, {
            value: '1',
            label: '加急'
          }, {
            value: '2',
            label: '特批'
          }],
          priority: '',
          completeState: '',
          processName: '',
          valuation: false,
          listLoading: true,
          searchLoading: false,
          fillOutAForm: false,
          taskFlowListData: [],
          routerVale: '',
          dialogTableVisible: false,
          src: null,
          activeName: 'tableFormat',
          listElement: {},
          formList: [],
          objNameArr: [],
          objValArr: []
        }
      },
      filters: {
        resetTime: function(value) {
          if (!value) return ''
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      mounted() {
        this.dataList()
      },
      methods: {
        fetchData(key, status, pageNum, pageSize) {
          return search(
            key,
            status,
            pageNum,
            pageSize
          )
        },
        /* 获取数据列表 */
        dataList() {
          this.searchLoading = true
          taskFlowList().then(resp => {
            this.taskFlowListData = resp.data.data.rows
            this.total = resp.data.data.total
            this.pageNum = resp.data.data.pageNum
            this.pageSize = resp.data.data.pageSize
            this.listLoading = false
            this.searchLoading = false
          })
        },
        /* table表格当前页事件 */
        handleCurrentPageChange(currentPage) {
          this.listLoading = true
          this.pageNum = currentPage
          this.fetchData(this.processName, this.completeState, this.pageNum, this.pageSize).then((resp) => {
            this.taskFlowListData = resp.data.data.rows
            this.total = resp.data.data.total
            this.pageNum = resp.data.data.pageNum
            this.pageSize = resp.data.data.pageSize
            this.listLoading = false
          })
        },
        /* 点击查询 */
        search() {
          this.searchLoading = true
          this.listLoading = true
          if (this.pageNum !== 1) {
            this.pageNum = 1
          } else {
            this.fetchData(this.processName, this.completeState, this.pageNum, this.pageSize).then((resp) => {
              this.taskFlowListData = resp.data.data.rows
              this.total = resp.data.data.total
              this.pageNum = resp.data.data.pageNum
              this.pageSize = resp.data.data.pageSize
              this.searchLoading = false
              this.listLoading = false
            })
          }
        },
        /* 启动流程按钮 */
        compose(obtainListData) {
          this.dialogVisible = true
          this.fillOutAForm = true
          this.formList = []
          startupProcess(obtainListData.key, obtainListData.name).then(resp => {
            this.routerVale = resp.data.data
            if (this.routerVale.formKey === null) {
              console.log('formKey为null')
            } else {
              transfer(this.routerVale.formKey, this.routerVale.taskId).then(resp => {
                this.listElement = resp.data.data
                if (this.listElement.length !== 0) {
                  this.listElement.forEach(e => {
                    e.elementValue = null
                    const Le = {
                      ele: '',
                      obj: {}
                    }
                    Le.ele = e.elementType
                    Le.obj = e
                    this.formList.push(Le)
                  })
                }
                this.fillOutAForm = false
              })
            }
          })
        },
        /* 办理流畅弹窗接口 */
        handleProcess(id) {
          this.dialogTableVisible = true
          this.src = '/business/model/img?id=' + id
        },
        mousedown: function(event) {
          const e = event || window.event
          const _target = e.target
          const startx = e.clientX
          const sb_bkx = startx - e.target.offsetLeft
          const ww = document.documentElement.clientWidth
          const wh = this.$refs.btnImg.innerHeight
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
          this.$refs.btnImg.onmousemove = function(ev) {
            const event = ev || window.event
            if (event.clientY < 0 || event.clientX < 0 || event.clientY > wh || event.clientX > ww) {
              return false
            }
            const endx = event.clientX - sb_bkx
            _target.style.left = endx + 'px'
            _target.style.position = 'relative'
          }
        },
        mouseup: function(e) {
          this.$refs.btnImg.onmousemove = null
        },
        // 点击提交按钮触发
        submitBtn() {
          this.closeDialogVisible = false
          this.objNameArr = []
          this.objValArr = []
          const templateValue = this.listElement
          const map = {}
          for (let i = 0; i < templateValue.length; i++) {
            switch (templateValue[i].elementType) {
              case 'input':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  map[templateValue[i].fieldName] = templateValue[i].elementValue
                }
                break
              case 'select':
                console.log(templateValue[i])
                break
              case 'radio':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  map[templateValue[i].fieldName] = templateValue[i].value
                }
                break
              case 'checkbox':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  if (templateValue[i].elementValue) {
                    map[templateValue[i].fieldName] = templateValue[i].elementValue.join(',')
                  }
                }
                break
              case 'datepicker':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  map[templateValue[i].fieldName] = templateValue[i].elementValue
                }
                break
              case 'cascader':
                console.log(templateValue[i])
                break
              case 'address':
                console.log(templateValue[i])
                break
              case 'uploads':
                console.log(templateValue[i])
                break
              case 'text':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  map[templateValue[i].fieldName] = templateValue[i].elementValue
                }
                break
              case 'hr':
                templateValue[i].fill = true
                break
              case 'title':
                templateValue[i].fill = true
                break
              case 'p':
                templateValue[i].fill = true
                break
            }
          }
          for (const i in map) {
            this.objValArr.push(i)
            if (map[i]) {
              this.objNameArr.push(map[i])
            }
          }
          if (this.objNameArr.length === this.objValArr.length) {
            this.valuation = true
          } else {
            this.$message({
              message: '请填写完整表单',
              type: 'warning'
            })
          }
          if (this.valuation === true && this.priority) {
            map['only_id'] = this.routerVale.onlyId
            submit(map, this.routerVale.formKey, this.routerVale.taskId, this.priority).then(resp => {
              if (resp.status === 200) {
                this.$message({
                  message: resp.data.message,
                  type: 'success'
                })
                this.closeDialogVisible = true
                this.dialogVisible = false
              } else {
                this.$message({
                  message: resp.data.message,
                  type: 'warning'
                })
              }
            })
          } else {
            this.$message({
              message: '请填写完整表单',
              type: 'warning'
            })
          }
        },
        // 关闭启动流程弹窗方法
        closeDialog() {
          if (this.closeDialogVisible) {
            return
          } else {
            closePopUp(this.routerVale.onlyId).then(resp => {
              console.log(resp)
            })
          }
        },
        /* 页面列表数据方法 dataList */
        // 文件激活按钮
        listDataActivationBtn(obtainId) {
          listDataActivation(obtainId.id).then(resp => {
            if (resp.data.status === 200) {
              this.$message({
                message: resp.data.message,
                type: 'success'
              })
              this.search()
            } else {
              this.$message({
                message: resp.data.message,
                type: 'warning'
              })
            }
          })
        },
        // 文件挂起按钮
        listDataHangUpBtn(obtainId) {
          listDataPopUpHangUp(obtainId.id).then(resp => {
            if (resp.data.status === 200) {
              this.$message({
                message: resp.data.message,
                type: 'success'
              })
              this.search()
            } else {
              this.$message({
                message: resp.data.message,
                type: 'warning'
              })
            }
          })
        }
      }
    }
</script>

<style scoped>
</style>
