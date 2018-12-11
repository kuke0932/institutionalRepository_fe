<template>
  <div class="container">
    <el-row>
      <div class="btn_box">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button type="primary">暂存</el-button>
        <el-button type="primary">撤销</el-button>
        <el-button type="primary">表单打印预览</el-button>
        <el-button type="primary">刷新</el-button>
      </div>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style="min-height: 500px; margin-top: 20px; width: 40%">
      <el-tab-pane label="文件审批" name="tableFormat">
        <el-form class="searchForm" :inline="true">
          <el-row :gutter="20" v-if='this.$route.query.node ==="机要室"'>
            <el-form-item label-width="70px" label="部门" style="float: left" >
              <el-select v-model="departmentContent" clearable @change="departmentBtn(departmentContent)">
                <el-option v-for="item in departmentArr" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="70px" label="审批人" style="float: left">
              <el-select v-model="completeState" clearable>
                <el-option v-for="item in inspectData" :key="item.id" :label="item.userName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label-width="70px" label="审批人" style="float: left">
              <el-select v-model="completeState" clearable>
                <el-option v-for="item in dropdownData" :name="item.userName" :key="item.id" :label="item.userName" :value="item.id">
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
          <!--:total="total"
          :page-size="pageSize"
          @current-change="handleCurrentPageChangeGroup"-->
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
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import moment from 'moment'
  import { examineDropdown, addReport, download } from '@/api/documentReadOver'
  import { department, inspect } from '@/api/documentDraft'
  import { toExamine } from '@/api/taskQuery'
  export default {
    name: 'documentDraft',
    data() {
      return {
        activeName: 'tableFormat',
        completeState: '',
        options: '',
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
        dropdownData: '',
        departmentArr: [],
        inspectData: '',
        departmentContent: '',
        reportData: null,
        src: '',
        formList: [],
        listElement: ''
      }
    },
    filters: {
      resetTime: function(value) {
        if (!value) return ''
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    mounted() {
      this.dropdown()
      this.departmentList()
      this.formListData()
    },
    beforeUpdate() {
      this.workerValue()
    },
    methods: {
      // 机要室人员下拉框列表
      // 获取部门下拉框数据
      departmentList() {
        department().then(resp => {
          for (let i = 0; i < resp.data.data[0].children.length; i++) {
            this.departmentArr.push(resp.data.data[0].children[i])
          }
        })
      },
      formListData() {
        toExamine(this.$route.query.key).then(resp => {
          this.listElement = resp.data.data
          if (this.listElement.length !== 0) {
            this.listElement.forEach(e => {
              const Le = {
                ele: '',
                obj: {}
              }
              Le.ele = e.elementType
              Le.obj = e
              this.formList.push(Le)
            })
          }
        })
      },
      // 监听部门下拉框改变时触发
      departmentBtn(file) {
        inspect(file).then(resp => {
          this.inspectData = resp.data.data
        })
      },
      // 非机要室人员下拉框列表
      dropdown() {
        examineDropdown().then(resp => {
          this.dropdownData = resp.data.data
        })
      },
      // 提交按钮
      submit() {
        if (this.options === '' || this.completeState === '') {
          this.$message({
            message: '请提交完整表单',
            type: 'warning'
          })
        } else {
          if (this.departmentContent === '') {
            submitBtn(this.options, this.$route.query.key, this.$route.query.id, this.completeState).then(resp => {
              if (resp.status === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
              }
            })
          } else {
            submit(this.$refs.title.value,
              this.$refs.company.value,
              this.$refs.date.value,
              this.$refs.number.value,
              this.$refs.secret.value,
              this.$refs.content.value,
              this.$route.query.key,
              this.$route.query.id,
              this.departmentContent,
              this.completeState
            ).then(resp => {
              if (resp.status === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
              }
            })
          }
        }
      },
      // 获取启动流程中员工填写的数据
      workerValue() {
        Object.keys(this.formList).forEach(v => {
          if (this.formList[v].obj.fieldName !== undefined) {
            Object.keys(this.$route.query.listData).forEach(i => {
              if (i === this.formList[v].obj.fieldName) {
                this.formList[v].obj.value = this.$route.query.listData[i]
              }
            })
          }
        })
        const labelAll = document.querySelectorAll('label')
        labelAll.forEach(a => {
          const AText = a.innerHTML.substr(0, a.innerHTML.length - 1)
          this.formList.forEach(v => {
            if (v.obj.label === AText) {
              const brother4 = a.nextElementSibling.getElementsByClassName('ivu-input')
              if (brother4[0] !== undefined) {
                brother4[0].attr('readOnly', true)
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
      }
    }
  }
</script>

<style scoped>
  .listName{
    width: 15%;
  }
  table tr:first-child,table tr:nth-child(2),table tr:nth-child(3){
    height: 40px;
  }
  table tr:first-child input,table tr:nth-child(2) input,table tr:nth-child(3) input{
    width: 100%;
    height: 38px;
    border: none;
    padding-left: 10px;
    outline:none;
  }
  table tr:last-child,table tr:nth-child(4){
    height: 260px;
  }
  table tr td,table tr th{
    border: 1px solid #000;
    width: 25%;
    text-align: center;
    margin: 0;
    padding: 0;
  }
  table{
    border-collapse:collapse;
    width: 35%;
  }
  textarea{
    width: 100%;
    height: 260px;
    border: none;
    outline:none;
    resize: none;
    padding-top: 10px;
    padding-left: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
