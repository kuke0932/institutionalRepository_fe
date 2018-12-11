<template>
    <div class="container">
      <el-form>
        <el-row>
          <el-form class="searchForm" :inline="true">
            <el-row :gutter="20">
              <el-form-item label-width="70px" label="任务状态" style="float: left">
                <el-select v-model="completeState" clearable>
                  <el-option v-for="item in auditing" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="70px" label="任务标题">
                <el-input style='min-width:120px;' v-model="processName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">查询</el-button>
              </el-form-item>
            </el-row>
          </el-form>
          <el-table
            :data="taskQueryListData"
            v-loading="listLoading"
            element-loading-text="拼命加载中"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column label="任务编号">
              <template slot-scope="scope">
                {{scope.row.onlyId}}
              </template>
            </el-table-column>
            <el-table-column label="标题">
              <template slot-scope="scope">
                {{scope.row.title}}
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime | resetTime}}
              </template>
            </el-table-column>
            <el-table-column label="任务状态">
              <template slot-scope="scope">
                {{['未领取','待办','挂起'][scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column label="申请人">
              <template slot-scope="scope">
                {{scope.row.create_name}}
              </template>
            </el-table-column>
            <el-table-column label="优先级">
              <template slot-scope="scope">
                {{['普通','加急','特批'][scope.row.priority]}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status == 1" @click="datalistStartBtn(scope.row)" type="primary" size="mini">文件审批</el-button>
                <el-button v-if="scope.row.status == 0" @click="dataListGetBtn(scope.row)" type="primary"  size="mini">领取任务</el-button>
                <!-- <el-button @click="dataListActivateBtn(scope.row)" type="primary" size="mini">文件激活</el-button> -->
                <el-button v-if="scope.row.status == 2" @click="dataListActivateBtn(scope.row)" type="primary" size="mini">文件激活</el-button>
                <el-button @click="dataListTransactionBtn(scope.row.onlyId)" type="primary" size="mini">办理过程</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="文件审批" :visible.sync="dialogVisible" width="35%">
            <el-row>
              <div class="btn_box">
                <el-button type="primary" @click="popUpSubmitBtn">提交</el-button>
                <el-button type="primary" @click="popUpHangUpBtn">挂起</el-button>
                <el-button type="primary">撤销</el-button>
                <el-button type="primary">表单打印预览</el-button>
                <el-button type="primary">刷新</el-button>
              </div>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style="min-height: 500px; margin-top: 20px; width: 100%">
              <el-tab-pane label="文件审批" name="tableFormat">
                <el-form class="searchForm" :inline="true">
                  <el-row :gutter="20">
                    <el-form-item label-width="70px" label="优先级" style="float: left">
                      <el-select v-model="priority" clearable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                  <Form :label-width="100" class="b-a">
                    <renders v-for="(element,index) in formList" :key="index" :name="element.ele" :ele="element.ele" :obj="element.obj || {}"></renders>
                  </Form>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="办理过程" name="transact">
                <el-table
                  :data="tableData5">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="文件名称">
                          <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="审批人">
                          <span>{{ props.row.category }}</span>
                        </el-form-item>
                        <el-form-item label="经手时间">
                          <span>{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="审批时间">
                          <span>{{ props.row.desc }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name">
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="float:right;margin-top: 15px;"
                  background
                  layout="prev, pager, next">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane label="添加任务附件" name="addAttachments">
                <div>
                  <el-button type="primary" @click="toggleSelection()">上传</el-button>
                  <el-button type="primary" @click="downloadBtn()">下载</el-button>
                  <el-button type="danger">删除</el-button>
                </div>
                <el-table
                  :data="reportData"
                  border
                  style="width: 40%; margin-top: 30px"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="附件名称"
                    width="180">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="文件类型"
                    width="180">
                    <template slot-scope="scope">
                      {{ scope.row.type }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="上传时间">
                    <template slot-scope="scope">
                      {{ scope.row.time | resetTime }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <iframe id="fileDownFrame" :src="src" style="display:none;"></iframe>
          </el-dialog>
          <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
            <div style="width: 100%; overflow: hidden" ref='btnImg' id="picDiv"><img :src="src" @mousedown="mousedown($event)" @mouseup='mouseup($event)' :draggable="true"></div>
          </el-dialog>
          <el-pagination
            style="float:right;margin-top: 15px;"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handleCurrentPageChange"
            :current-page.sync="pageNum">
          </el-pagination>
        </el-row>
      </el-form>
    </div>
</template>

<script>
    import moment from 'moment'
    import { taskQueryList, search, receive, renderFromList, approvalSubmit, hangUp, activate } from '@/api/taskQuery'
    import { addReport, download } from '@/api/documentReadOver'
    // import { inspect } from '@/api/documentDraft'
    export default {
      name: 'register',
      data() {
        return {
          dialogVisible: false,
          total: -1,
          pageNum: 1,
          pageSize: 10,
          listLoading: false,
          searchLoading: false,
          auditing: [{
            value: '0',
            label: '未领取'
          }, {
            value: '1',
            label: '待办'
          }, {
            value: '2',
            label: '挂起'
          }],
          completeState: '',
          processName: '',
          taskQueryListData: [],
          dialogTableVisible: false,
          src: '',
          activeName: 'tableFormat',
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
          tableData5: [{
            name: '机要室起草',
            category: '赵四',
            address: '2018-8-29 08:11:01',
            desc: '2018-8-23 15:23:12'
          }, {
            name: '机要室起草',
            category: '赵四',
            address: '2018-8-29 08:11:01',
            desc: '2018-8-23 15:23:12'
          }, {
            name: '机要室起草',
            category: '赵四',
            address: '2018-8-29 08:11:01',
            desc: '2018-8-23 15:23:12'
          }, {
            name: '机要室起草',
            category: '赵四',
            address: '2018-8-29 08:11:01',
            desc: '2018-8-23 15:23:12'
          }],
          multipleSelection: [],
          reportData: [],
          formList: [],
          listElement: [],
          forname: '',
          onlyId: ''
        }
      },
      filters: {
        resetTime: function(value) {
          if (!value) return ''
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      mounted() {
        this.initialDataList()
      },
      beforeUpdate() {
        this.workerValue()
      },
      methods: {
        fetchData(title, status, pageNum, pageSize) {
          return search(
            title,
            status,
            pageNum,
            pageSize
          )
        },
        /* table表格当前页事件 */
        handleCurrentPageChange(currentPage) {
          this.listLoading = true
          this.pageNum = currentPage
          search(this.processName, this.completeState, this.pageNum, this.pageSize).then((resp) => {
            this.taskQueryListData = resp.data.data.rows
            this.total = resp.data.data.total
            this.pageNum = resp.data.data.pageNum
            this.pageSize = resp.data.data.pageSize
          })
        },
        // 搜索按钮
        search() {
          this.searchLoading = true
          this.listLoading = true
          if (this.pageNum !== 1) {
            this.pageNum = 1
          } else {
            search(this.processName, this.completeState, this.pageNum, this.pageSize).then((resp) => {
              this.taskQueryListData = resp.data.data.rows
              this.total = resp.data.data.total
              this.pageNum = resp.data.data.pageNum
              this.pageSize = resp.data.data.pageSize
              this.searchLoading = false
              this.listLoading = false
            })
          }
        },
        // 获取的提交人填写的数据展示到页面上
        workerValue() {
          const listAll = document.getElementsByClassName('ivu-form-item-content')
          console.log(listAll)
          const labelAll = document.querySelectorAll('label')
          labelAll.forEach(a => {
            const AText = a.innerHTML.substr(0, a.innerHTML.length - 1)
            this.formList.forEach(v => {
              if (v.obj.label === AText) {
                const brother4 = a.nextElementSibling.getElementsByClassName('ivu-input')
                if (brother4[0] !== undefined) {
                  if (brother4[0].value !== '') {
                    brother4[0].readOnly = true
                  }
                }
              }
            })
          })
        },
        // tab切换调用添加任务附件中的下载接口
        handleClick(tab, event) {
          if (tab.name === 'addAttachments') {
            addReport(this.$route.query.reportID).then(resp => {
              this.reportData = resp.data.data
            })
          }
        },
        // 选中的表格数据
        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        downloadBtn() {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            download(this.multipleSelection[i].url, this.multipleSelection[i].type, this.multipleSelection[i].name).then(resp => {
              this.src = resp.request.responseURL
            })
          }
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
        /* 列表  dataList */
        // 获取数据列表
        initialDataList() {
          taskQueryList().then(resp => {
            this.taskQueryListData = resp.data.data.rows
            this.total = resp.data.data.total
            this.pageNum = resp.data.data.pageNum
            this.pageSize = resp.data.data.pageSize
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '错了哦，这是一条错误消息',
              type: 'error'
            })
          })
        },
        // 文件审批 按钮  渲染form表单
        datalistStartBtn(data) {
          this.forname = data.formKey
          this.onlyId = data.onlyId
          this.dialogVisible = true
          this.formList = []
          renderFromList(data.formKey, data.status, data.onlyId, data.taskId).then(resp => {
            this.listElement = resp.data.data
            const templateValue = this.listElement[0].element
            if (templateValue.length !== 0) {
              templateValue.forEach(e => {
                const Le = {
                  ele: '',
                  obj: {}
                }
                Le.ele = e.elementType
                Le.obj = e
                this.formList.push(Le)
              })
            }
            // 数据回填
            const templateData = this.listElement[0].data
            for (let i = 0; i < templateValue.length; i++) {
              switch (templateValue[i].elementType) {
                case 'input':
                  for (const y in templateData) {
                    if (y === templateValue[i].fieldName) {
                      templateValue[i].value = templateData[y]
                      templateValue[i].fill = true
                    }
                  }
                  break
                case 'select':
                  console.log(templateValue[i])
                  break
                case 'radio':
                  for (const y in templateData) {
                    if (y === templateValue[i].fieldName) {
                      templateValue[i].elementValue = templateData[y]
                      templateValue[i].fill = true
                    }
                  }
                  break
                case 'checkbox':
                  for (const y in templateData) {
                    if (y === templateValue[i].fieldName) {
                      const arr = templateData[y].split(',')
                      templateValue[i].elementValue = arr
                      templateValue[i].fill = true
                    }
                  }
                  break
                case 'datepicker':
                  for (const y in templateData) {
                    if (y === templateValue[i].fieldName) {
                      templateValue[i].elementValue = templateData[y]
                      templateValue[i].fill = true
                    }
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
                  for (const y in templateData) {
                    if (y === templateValue[i].fieldName) {
                      templateValue[i].elementValue = templateData[y]
                      templateValue[i].fill = true
                    }
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
          })
        },
        // 文件激活 按钮
        dataListActivateBtn(obtainTaskId) {
          const taskId = obtainTaskId.taskId
          activate(taskId).then(resp => {
            console.log(resp.data.data.rows)
          })
        },
        // 文件领取 按钮
        dataListGetBtn(obtainListData) {
          receive(obtainListData.taskId, obtainListData.onlyId, obtainListData.form_name).then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '领取成功',
                type: 'success'
              })
              this.initialDataList()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '错了哦，这是一条错误消息',
              type: 'error'
            })
          })
        },
        // 办理过程 按钮
        dataListTransactionBtn(obtainOnlyId) {
          this.dialogTableVisible = true
          this.src = '/business/show/processimage?onlyId=' + obtainOnlyId
        },
        /* 文件审批弹窗  popUp */
        // 提交按钮
        popUpSubmitBtn() {
          const templateValue = this.listElement[0].element
          const Le = {}
          for (let i = 0; i < templateValue.length; i++) {
            switch (templateValue[i].elementType) {
              case 'input':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  Le[templateValue[i].fieldName] = templateValue[i].elementValue
                }
                break
              case 'select':
                console.log(templateValue[i])
                break
              case 'radio':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  Le[templateValue[i].fieldName] = templateValue[i].value
                }
                break
              case 'checkbox':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  Le[templateValue[i].fieldName] = templateValue[i].elementValue.join(',')
                }
                break
              case 'datepicker':
                if (templateValue[i].fill === true) {
                  break
                } else {
                  Le[templateValue[i].fieldName] = templateValue[i].elementValue
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
                  Le[templateValue[i].fieldName] = templateValue[i].elementValue
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
          approvalSubmit(this.onlyId, this.forname, Le).then(resp => {
            this.dialogVisible = false
          })
        },
        // 挂起按钮
        popUpHangUpBtn() {
          const taskId = this.listElement[0].data.task_id
          hangUp(taskId).then(resp => {
            console.log(resp)
          })
        }
      }
    }
</script>

<style scoped>

</style>
