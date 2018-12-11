<template>
  <div class="container">
    <el-row>
      <div class="btn_box">
        <el-button type="primary" @click="submitBtn">提交</el-button>
        <el-button type="primary">暂存</el-button>
        <el-button type="primary">撤销</el-button>
        <el-button type="primary">表单打印预览</el-button>
        <el-button type="primary">刷新</el-button>
      </div>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style="min-height: 500px; margin-top: 30px; width: 40%;">
      <el-tab-pane label="表单填写" name="tableFormat">
        <el-form class="searchForm" :inline="true" style="width: 100%; height: 665px">
          <el-row :gutter="20">
            <Form :label-width="100" class="b-a">
              <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
                <renders v-for="(element,index) in formList" :key="index" :ele="element.ele" :obj="element.obj || {}"></renders>
              </transition-group>
            </Form>
            <el-form-item label-width="70px" label="部门" style="float: left">
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
        </el-form>
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
            :on-change="handleChange"
            :on-remove="shanchu"
            :on-success="handleAvatarSuccess"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    // import moment from 'moment'
    import { submit, department, inspect, transfer } from '@/api/documentDraft'
    export default {
      name: 'documentDraft',
      data() {
        return {
          fileList: [],
          activeName: 'tableFormat',
          departmentContent: '',
          completeState: '',
          valuation: true,
          departmentArr: [],
          inspectData: [],
          listElement: {},
          formList: [],
          name: [],
          path: [],
          type: []
        }
      },
      mounted() {
        this.departmentList()
        this.transferData()
      },
      methods: {
        // 获取跳转页面请求的数据
        transferData() {
          transfer(this.$route.query.fromKey).then(resp => {
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
        // 获取部门下拉框数据
        departmentList() {
          department().then(resp => {
            for (let i = 0; i < resp.data.data[0].children.length; i++) {
              this.departmentArr.push(resp.data.data[0].children[i])
            }
          })
        },
        // 监听部门下拉框改变时触发
        departmentBtn(file) {
          inspect(file).then(resp => {
            this.inspectData = resp.data.data
          })
        },
        // 点击提交按钮触发
        submitBtn() {
          this.valuation = true
          const map = {}
          const id = this.$route.query.id
          const labelAll = document.querySelectorAll('label')
          const downId = {
            sectionID: this.departmentContent,
            userId: this.completeState
          }
          labelAll.forEach(a => {
            const AText = a.innerHTML.substr(0, a.innerHTML.length - 1)
            this.formList.forEach(v => {
              if (v.obj.label === AText) {
                const brother4 = a.nextElementSibling.getElementsByClassName('ivu-input')
                map[v.obj.fieldName] = brother4[0].value
              }
            })
          })
          map['only_id'] = id
          for (const i in map) {
            if (map[i] === '') {
              this.valuation = false
            }
          }
          if (this.valuation === true && this.departmentContent !== '' && this.completeState !== '') {
            submit(map, this.$route.query.key, this.$route.query.taskId, downId).then(resp => {
              this.$message({
                message: resp.data.message,
                type: 'warning'
              })
            })
          } else {
            this.$message({
              message: '请填写完整表单',
              type: 'warning'
            })
          }
        },
        handleChange(file, fileList) {
          this.fileList.push({
            'name': file.name,
            'url': file.url
          })
          this.fileList = fileList.slice(-3)
        },
        shanchu(file, fileList) {
          console.log(file)
          console.log(fileList)
        },
        handleAvatarSuccess(response, file, fileList) {
          for (let i = 0; i < response.data.length; i++) {
            this.name.push(response.data[i].name)
            this.type.push(response.data[i].type)
            this.path.push(response.data[i].path)
          }
        },
        handleClick(tab, event) {
          // console.log(tab, event)
        },
        formatter(row, column) {
          return row.address
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
    height: 500px;
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
    min-width: 265px;
    width: 35%;
  }
  textarea{
    width: 100%;
    height: 500px;
    border: none;
    outline:none;
    resize: none;
    padding-top: 10px;
    padding-left: 10px;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  /* .maskLayer {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.1);
    z-index: 100;
  } */
</style>
