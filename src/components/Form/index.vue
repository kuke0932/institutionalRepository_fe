<template>
  <div class="container">
    <el-container>
      <el-aside span="12" class="sortable_container" style="width: 40%">
        <Form :label-width="100" class="b-a">
          <draggable :clone="cloneData" :list="form_list" :options="dragOptions1">
            <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
              <renders v-for="(element,index) in form_list" :key="index" :ele="element.ele" :obj="element.obj || {}"></renders>
            </transition-group>
          </draggable>
        </Form>
      </el-aside>
      <el-main span="12" class="sortable_item">
        <Form ref="formValidate" class="b-a" :label-width="100" :model="formData" @submit.native.prevent style="position: relative;">
          <!-- <Alert style="margin: 15px 15px 0" type="warning" show-icon>未绑定数据字典控件无效</Alert> -->
          <draggable :list="sortable_item" :options="dragOptions2">
            <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
              <renders @handleRemoveEle="removeEle" @handleConfEle="confEle" @changeVisibility="changeVisibility"
                       v-for="(element,index) in sortable_item" :key="index"
                       :index="index" :ele="element.ele" :obj="element.obj || {}"
                       :data="formData" @handleChangeVal="val => handleChangeVal(val,element)"
                       :sortableItem="sortable_item" :config-icon="true">
              </renders>
            </transition-group>
          </draggable>
          <FormItem class="formItem">
            <Button type="primary" @click="handleSubmit()">保存</Button>
            <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
        <el-dialog title="表单提交详情" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="表单名称" :label-width="formLabelWidth">
              <!--<el-input v-model="createForm.databaseFormName" @blur="verifyName" placeholder="请输入英文名称"></el-input>-->
              <el-input v-model="createForm.databaseFormName" placeholder="请输入英文名称"></el-input>
            </el-form-item>
            <el-form-item label="表单详情" :label-width="formLabelWidth">
              <el-input type="textarea" autosize placeholder="请输入内容" v-model="createForm.formDescription">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="formSubmit()">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
      <Modal v-model="showModal" :title="'配置' + modalFormData.modalTitle + '属性'" :mask-closable="false">
        <Form class="form_content" :label-width="96" :model="modalFormData" ref="modalFormData">
          <FormItem label="控件名称：" v-if="typeof modalFormData.label !== 'undefined'">
            <i-input v-model="modalFormData.label" placeholder="请输入控件名称" :maxlength="10"></i-input>
          </FormItem>
          <FormItem label="创建字段：" v-if="typeof modalFormData.fieldName !== 'undefined'">
            <Select v-model="selectedVale" filterable @on-change="handleDataDictChange" style="width: 72%" v-show="isShow" ref="sele">
              <!-- value绑定json字符串的原因是，需要用到parent_name，当handleDataDictChange触发，赋值到modalFormData -->
              <Option :disabled="dataDictSelected.indexOf(item.id) >= 0" v-for="item in dropDownBoxValue" :value="JSON.stringify(item.dictKey)" :key="item.id">{{ item.dictKey }}</Option>
            </Select>
            <i-input v-model="setupData" placeholder="" style="width:69%" v-show="isHidden"></i-input>
            <Button @click="transForm()" v-show="isShow">创建数据字典</Button>
            <Button @click="saveForm(modalFormData)" v-show="isHidden">保存</Button>
            <Button @click="returnBth()" v-show="isHidden">返回</Button>
          </FormItem>
          <FormItem label="字段英文名称：" v-if="typeof modalFormData.fieldName !== 'undefined'">
            <i-input v-model="nameInput" placeholder="" disabled v-show="isShow"></i-input>
            <i-input v-model="nameAttribute" placeholder="请输入英文字母" v-show="isHidden"></i-input>
          </FormItem>
          <FormItem label="添加单选：" v-if="modalFormData.modalTitle === '单选框'" v-show="isChoose">
            <div class="searchBth" style="width: 51%">
              <i-input placeholder="请输入单选框名称" style="width: 100%" v-model="inputValue"></i-input>
            </div>
            <Button @click="addBtn()">添加单选框</Button>
            <Button @click="deleteBtn()">删除单选框</Button>
          </FormItem>
          <FormItem label="添加多选：" v-if="modalFormData.modalTitle === '多选框'" v-show="isChoose">
            <div class="searchBth" style="width: 51%">
              <i-input placeholder="请输入多选框名称" style="width: 100%" v-model="multiSelect"></i-input>
            </div>
            <Button @click="addMultipleBtn()">添加多选框</Button>
            <Button @click="deleteMultipleBtn()">删除多选框</Button>
          </FormItem>
          <FormItem label="关联数据：" v-if="typeof modalFormData.relation !== 'undefined'">
            <!-- 当绑定name并且当前relationList存在数据时候才可以关联字段 -->
            <Checkbox :disabled="!modalFormData.name || !relationList.length" v-model="modalFormData.relation">是否关联字段</Checkbox>
          </FormItem>
          <FormItem label="关联配置：" v-if="typeof modalFormData.relation !== 'undefined' && modalFormData.relation">
            <Select v-model="modalFormData.relation_name" class="inline-block" style="width: 150px" @on-change="_=>modalFormData.relation_value = ''">
              <Option :disabled="item.obj.name === modalFormData.name" v-for="(item,index) in relationList" :key="index" :value="item.obj.name">{{item.obj.label}}</Option>
            </Select>
            <p class="inline-block padder-sm">等于</p>
            <Select v-model="modalFormData.relation_value" class="inline-block" style="width: 150px">
              <Option v-for="(item,index) in relationValue" :key="index" :value="item.labelValue">{{item.labelName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="placeholder：" v-if="typeof modalFormData.placeholder !== 'undefined'">
            <i-input v-model="modalFormData.placeholder" placeholder="请输入placeholder"></i-input>
          </FormItem>
          <FormItem label="最大长度：" v-if="typeof modalFormData.maxLength !== 'undefined'">
            <InputNumber v-model="modalFormData.maxLength" placeholder="请输入文本限制最大长度">
            </InputNumber>
          </FormItem>
          <FormItem label="最大限制：" v-if="typeof modalFormData.maxSize !== 'undefined'">
            <InputNumber :formatter="value => `${value}kb`" :parser="value => value.replace('kb', '')" v-model="modalFormData.maxSize" placeholder="请输入上传文件最大限制">
            </InputNumber>
          </FormItem>
          <FormItem label="上边距：" v-if="typeof modalFormData.marginTop !== 'undefined'">
            <InputNumber :formatter="value => `${value}px`" :parser="value => value.replace('px', '')" v-model="modalFormData.marginTop" placeholder="请输入标签上边距">
            </InputNumber>
          </FormItem>
          <FormItem label="下边距：" v-if="typeof modalFormData.marginBottom !== 'undefined'">
            <InputNumber :formatter="value => `${value}px`" :parser="value => value.replace('px', '')" v-model="modalFormData.marginBottom" placeholder="请输入标签下边距">
            </InputNumber>
          </FormItem>
          <FormItem label="详细地址：" v-if="typeof modalFormData.details_address !== 'undefined'">
            <Checkbox v-model="modalFormData.details_address">是否需要详细地址</Checkbox>
          </FormItem>
          <FormItem label="是否必填：" v-if="typeof modalFormData.require !== 'undefined'">
            <Checkbox v-model="modalFormData.require">必填</Checkbox>
          </FormItem>
          <FormItem label="校验错误：" v-if="typeof modalFormData.ruleError !== 'undefined'">
            <i-input v-model="modalFormData.ruleError" placeholder="请输入校验错误提示"></i-input>
          </FormItem>
          <FormItem label="是否多选：" v-if="typeof modalFormData.multiple !== 'undefined' && modalFormData.type !== 'address'">
            <Checkbox v-model="modalFormData.multiple">多选</Checkbox>
          </FormItem>
          <FormItem label="时间格式：" v-if="typeof modalFormData.format !== 'undefined'">
            <RadioGroup v-model="modalFormData.format">
              <Radio label="yyyy年MM月dd日"></Radio>
              <Radio label="yyyy-MM-dd HH:mm"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="行内元素：" v-if="typeof modalFormData.inlineBlock !== 'undefined'">
            <Checkbox v-model="modalFormData.inlineBlock">是</Checkbox>
          </FormItem>
          <FormItem label="作为流程变量：" v-if="typeof modalFormData.processize !== 'undefined'">
            <Checkbox v-model="modalFormData.processize">是</Checkbox>
          </FormItem>
          <FormItem label="数据展示：" v-if="typeof modalFormData.dataShow !== 'undefined'">
            <Checkbox v-model="modalFormData.dataShow">是</Checkbox>
          </FormItem>
          <FormItem label="显示行数：" v-if="typeof modalFormData.maxRows !== 'undefined'">
            <Slider v-model="modalFormData.maxRows" :min="2" :max="10"></Slider>
          </FormItem>
          <FormItem label="标题大小：" v-if="typeof modalFormData.level !== 'undefined'">
            <InputNumber :max="6" :min="1" v-model="modalFormData.level"></InputNumber>
          </FormItem>
          <FormItem label="字体颜色：" v-if="typeof modalFormData.color !== 'undefined'">
            <ColorPicker v-model="modalFormData.color" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="handleCancel">取消</Button>
          <Button type="primary" :loading="modalFormData.loading" @click="handleOk(modalFormData.modalTitle)">确定</Button>
        </div>
      </Modal>
    </el-container>
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import draggable from 'vuedraggable'
  import { cascade } from '@/api/cascade'
  import { createForm, dropDownBox, verifyName, editForm } from '@/api/createForm'
  import { saveData } from '@/api/dataDictionary'
  import form_list from './custom_form/FormList'
  export default {
    components: { draggable },
    props: ['editFormData', 'editFormName', 'editDescription'],
    data() {
      return {
        form_list: form_list,
        sortable_item: this.editFormData || [],
        showModal: false,
        // 深拷贝对象，防止默认空对象被更改
        // 颜色选择器bug，对象下color不更新
        modalFormData: {
          color: '',
          loading: false
        },
        formData: {},
        dataDict: [],
        createForm: {
          databaseFormName: '',
          formDescription: '',
          createFormInputs: [],
          createFormSelects: [],
          createFormRadios: [],
          createFormCheckboxs: [],
          createFormDatepickers: [],
          createFormCascaders: [],
          createFormAddress: [],
          createFormUploads: {},
          createFormTexts: [],
          createFormHrs: [],
          createFormTitles: {},
          createFormPS: []
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
        isShow: true,
        isHidden: false,
        isChoose: false,
        inputValue: '',
        multiSelect: '',
        setupData: '',
        nameAttribute: '',
        dropDownBoxValue: '',
        nameInput: '',
        arrIndex: '',
        selectedVale: '',
        option: '',
        casData: '',
        verify: true,
        formId: '',
        choiceBox: ''
      }
    },
    watch: {
      editFormName(val) {
        this.createForm.databaseFormName = val
      },
      editDescription(val) {
        this.createForm.formDescription = val
      },
      showModal(val) {
        if (!val) {
          this.handleCancel()
        }
      }
    },
    mounted() {
      this.formId = this.$route.query.formId
      this.cas()
    },
    methods: {
      // 获取级联数据
      cas() {
        cascade().then(resp => {
          this.casData = resp.data.data
        })
      },
      fetchData(type) {
        return dropDownBox(
          type
        )
      },
      empty() {
        this.createForm.formDescription = ''
        this.createForm.databaseFormName = ''
        this.createForm.createFormInputs = []
        this.createForm.createFormSelects = []
        this.createForm.createFormRadios = []
        this.createForm.createFormCheckboxs = []
        this.createForm.createFormDatepickers = []
        this.createForm.createFormCascaders = []
        this.createForm.createFormAddress = []
        this.createForm.createFormUploads = {}
        this.createForm.createFormTexts = []
        this.createForm.createFormHrs = []
        this.createForm.createFormTitles = {}
        this.createForm.createFormPS = []
      },
      switchFrom() {
        saveData(this.setupData, this.nameAttribute, this.option.elementType, this.choiceBox).then(resp => {
          this.$message({
            message: resp.data.message,
            type: 'warning'
          })
          if (resp.data.status === 200) {
            this.fetchData(this.sortable_item[this.arrIndex].obj.elementType).then(resp => {
              this.dropDownBoxValue = resp.data.data
            })
          }
        })
        this.isShow = !this.isShow
        this.isChoose = !this.isChoose
        this.isHidden = !this.isHidden
        this.setupData = ''
        this.nameAttribute = ''
      },
      // 克隆表单提交事件
      handleSubmit() {
        for (let i = 0; i < this.sortable_item.length; i++) {
          if (this.sortable_item[i].obj.fieldName === '') {
            this.$message({
              message: '表单创建字段未填写',
              type: 'warning'
            })
            return
          }
        }
        this.dialogFormVisible = true
      },
      // 点击创建单选按钮
      addBtn() {
        if (this.inputValue.trim() !== '') {
          this.choiceBox.push({
            'labelName': this.inputValue,
            'labelValue': this.choiceBox.length + 1
          })
        } else {
          this.$message.error('输入值不能为空')
        }
        this.inputValue = ''
      },
      // 点击删除单选按钮
      deleteBtn() {
        this.sortable_item.forEach((a) => {
          if (a.ele === 'radio') {
            a.obj.items.pop()
          }
        })
      },
      // 点击添加多选按钮
      addMultipleBtn() {
        if (this.multiSelect.trim() !== '') {
          this.choiceBox.push({
            'labelName': this.multiSelect,
            'labelValue': this.choiceBox.length + 1
          })
        } else {
          this.$message.error('输入值不能为空')
        }
        this.multiSelect = ''
      },
      // 点击删除多选按钮
      deleteMultipleBtn() {
        this.sortable_item.forEach((a) => {
          if (a.ele === 'checkbox') {
            a.obj.items.pop()
          }
        })
      },
      // 创建数据字典搜索框切换
      transForm() {
        this.choiceBox = []
        this.setupData = ''
        this.nameAttribute = ''
        this.isChoose = !this.isChoose
        this.isShow = !this.isShow
        this.isHidden = !this.isHidden
      },
      // 创建表单元素
      formSubmit() {
        if (this.createForm.formDescription === '' || this.createForm.databaseFormName === '') {
          this.$message({
            message: '输入内容不能为空',
            type: 'warning'
          })
        } else {
          const reg = /^[a-zA-Z_]+$/
          if (!reg.test(this.formDescription)) {
            this.$message({
              message: '请输入正确的表单名称',
              type: 'warning'
            })
          } else {
            localStorage.setItem('template_form', JSON.stringify(this.sortable_item))
            this.sortable_item.forEach((v, index) => {
              switch (v.ele) {
                case 'input':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormInputs.push(v.obj)
                  break
                case 'select':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormSelects.push(v.obj)
                  break
                case 'radio':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormRadios.push(v.obj)
                  break
                case 'checkbox':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormCheckboxs.push(v.obj)
                  break
                case 'datepicker':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormDatepickers.push(v.obj)
                  break
                case 'cascader':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormCascaders.push(v.obj)
                  break
                case 'address':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormAddress.push(v.obj)
                  break
                case 'uploads':
                  v.obj.items = JSON.stringify(v.obj.items)
                  v.obj.index = index
                  this.createForm.createFormUploads = v.obj
                  break
                case 'text':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items) || []
                  this.createForm.createFormTexts.push(v.obj)
                  break
                case 'hr':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items)
                  this.createForm.createFormHrs.push(v.obj)
                  break
                case 'title':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items) || []
                  this.createForm.createFormTitles = v.obj
                  break
                case 'p':
                  v.obj.index = index
                  v.obj.items = JSON.stringify(v.obj.items) || []
                  this.createForm.createFormPS.push(v.obj)
                  break
              }
            })
            if (this.verify) {
              if (this.formId) {
                editForm(this.createForm, this.formId).then((resp) => {
                  if (resp.data.status === 200) {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.handleReset()
                    this.empty()
                  } else {
                    this.$message.error(resp.data.message)
                    this.empty()
                  }
                })
              } else {
                createForm(this.createForm).then((resp) => {
                  if (resp.data.status === 200) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.handleReset()
                    this.empty()
                  } else {
                    this.$message.error(resp.data.message)
                    this.handleReset()
                    this.empty()
                  }
                })
              }
            } else {
              return
            }
            this.dialogFormVisible = false
          }
        }
      },
      verifyName() {
        verifyName(this.formId, this.createForm.databaseFormName).then(resp => {
          if (resp.data.status !== 200) {
            this.$message({
              message: resp.data.message,
              type: 'warning'
            })
            this.verify = false
          } else {
            this.verify = true
          }
        })
      },
      // 数据字典保存按钮
      saveForm(option) {
        this.option = option
        const itemsList = this.choiceBox.length
        if (this.setupData.trim() !== '' && this.nameAttribute.trim() !== '') {
          if (option.elementType === 'radio' || option.elementType === 'checkbox') {
            if (this.dropDownBoxValue === null) {
              if (itemsList <= 1) {
                this.$message.error('至少添加两个选择框')
              } else {
                this.switchFrom()
              }
            } else {
              let throttle = 0
              this.dropDownBoxValue.forEach(i => {
                if (this.setupData.trim() === i.dictKey || this.nameAttribute.trim() === i.dictValue) throttle = 1
              })
              if (throttle === 1) {
                this.$message.error('该属性已创建')
                return
              } else {
                if (itemsList <= 1) {
                  this.$message.error('至少添加两个选择框')
                } else {
                  this.switchFrom()
                }
              }
            }
          } else {
            if (this.dropDownBoxValue === null) {
              this.switchFrom()
            } else {
              let throttle = 0
              this.dropDownBoxValue.forEach(i => {
                if (this.setupData.trim() === i.dictKey || this.nameAttribute.trim() === i.dictValue) throttle = 1
              })
              if (throttle === 1) {
                this.$message.error('该属性已创建')
                return
              } else {
                this.switchFrom()
              }
            }
          }
        } else {
          this.$message.error('输入值不能为空')
        }
      },
      // 创建数据表单返回按钮
      returnBth() {
        this.isChoose = !this.isChoose
        this.isShow = !this.isShow
        this.isHidden = !this.isHidden
      },
      // 清空克隆表单
      handleReset() {
        this.sortable_item = []
      },
      // modal内数据字典选项发生改变触发事件
      handleDataDictChange(val) {
        if (val) {
          const arr = []
          const newStr = val.split('"')
          val = newStr.join('')
          this.dropDownBoxValue.forEach((v) => {
            if (v.dictKey === val) {
              if (v.elementType === 'checkbox' || v.elementType === 'cascader') {
                arr.push(v.dictKey)
                this.sortable_item[this.arrIndex].obj.elementValue = arr
              } else {
                this.sortable_item[this.arrIndex].obj.elementValue = v.dictKey
              }
              this.nameInput = v.dictValue
              this.sortable_item[this.arrIndex].obj.items = v.listItems
              this.sortable_item[this.arrIndex].obj.fieldName = v.dictValue
              this.sortable_item[this.arrIndex].obj.visibilityHidden = v.visibilityHidden
            }
          })
        }
      },
      // 控件回填数据
      handleChangeVal(val, element) {
        this.$set(this.formData, element.obj.name, val)
      },
      // https://github.com/SortableJS/Vue.Draggable#clone
      // 克隆,深拷贝对象
      cloneData(original) {
        // 添加一个modal标题
        original.obj.modalTitle = original.obj.label || ''
        // 深拷贝对象，防止默认空对象被更改
        return JSON.parse(JSON.stringify(original))
      },
      // modal点击取消执行事件，清空当前modal内容
      handleCancel() {
        this.showModal = false
        this.selectedVale = ''
        setTimeout(_ => {
          this.modalFormData = {
            color: '',
            loading: false
          }
        }, 500)
      },
      // 显示modal,配置被克隆控件
      confEle(index) {
        this.nameInput = ''
        this.arrIndex = index
        this.fetchData(this.sortable_item[index].obj.elementType).then(resp => {
          this.dropDownBoxValue = resp.data.data
          if (this.dropDownBoxValue === null) {
            return
          } else {
            for (let i = 0; i < this.dropDownBoxValue.length; i++) {
              const e = this.dropDownBoxValue[i]
              if (e.dictValue === this.sortable_item[index].obj.fieldName) {
                this.selectedVale = JSON.stringify(e.dictKey)
                this.modalFormData.fieldName = e.dictValue
                this.nameInput = e.dictValue
                break
              }
            }
          }
        })
        // 点击设置按钮清空选框
        const list_temp = Object.assign({}, this.sortable_item[index])
        for (const i in list_temp.obj) {
          this.modalFormData[i] = list_temp.obj[i]
        }
        // 配置项中未找到color，删除modalFormData中自带color属性
        if (!list_temp.obj['color']) delete this.modalFormData.color
        // 设置被配置控件的index，便于完成配置找到相应对象赋值
        this.modalFormData.listIndex = index
        // Vue 不能检测到对象属性的添加或删除
        this.modalFormData = Object.assign({}, this.modalFormData)
        this.showModal = true
        if (this.isHidden) {
          this.returnBth()
        }
      },
      // modal点击确定执行事件
      handleOk(modalTitle) {
        if (modalTitle === '标题' || modalTitle === '文本标签' || modalTitle === '') {
          const index = this.modalFormData.listIndex
          this.modalFormData.items = this.sortable_item[this.arrIndex].obj.items
          this.sortable_item[index].obj = Object.assign({},
            this.sortable_item[index].obj,
            this.modalFormData,
          )
          this.handleCancel()
        } else {
          if (this.selectedVale === '') {
            this.$message.error('请选择数据字典')
          } else {
            const index = this.modalFormData.listIndex
            this.modalFormData.items = this.sortable_item[this.arrIndex].obj.items
            this.modalFormData.fieldName = this.sortable_item[this.arrIndex].obj.fieldName
            // this.modalFormData.elementValue = this.sortable_item[this.arrIndex].obj.elementValue
            this.modalFormData.elementValue = this.sortable_item[index].obj.visibilityHidden
            this.sortable_item[index].obj = Object.assign({},
              this.sortable_item[index].obj,
              this.modalFormData,
            )
            this.handleCancel()
          }
        }
      },
      // 删除克隆控件
      removeEle(index) {
        const name = this.sortable_item[index].obj.name
        this.sortable_item.splice(index, 1)
        if (!name) return
        for (const i in this.sortable_item) {
          // 当relation为true并且关联字段被确认
          if (this.sortable_item[i].obj.relation && this.sortable_item[i].obj.relation_name === name) {
            this.$set(this.sortable_item[i].obj, 'relation', false)
            this.$set(this.sortable_item[i].obj, 'relation_name', '')
            this.$set(this.sortable_item[i].obj, 'relation_value', '')
            break
          }
        }
      },
      // 更改当前渲染字段是否显示
      changeVisibility(index, visibility) {
        this.$set(this.sortable_item[index].obj, 'visibility', visibility)
      }
    },
    computed: {
      // 数据字典已选择项
      dataDictSelected() {
        return this.sortable_item.map(v => {
          const obj = JSON.parse(v.obj.dict || '{}')
          return obj.id || -1
        })
      },
      // 对应控件的数据字典
      dataDictList() {
        return this.dataDict.filter(v => {
          return v.type === this.modalFormData.type
        })
      },
      // 拖拽表单1
      dragOptions1() {
        return {
          animation: 0,
          ghostClass: 'ghost',
          // 分组
          group: {
            name: 'shared',
            pull: 'clone',
            revertClone: false
          },
          // 禁止拖动排序
          sort: false
        }
      },
      // 拖拽表单2
      dragOptions2() {
        return {
          animation: 0,
          ghostClass: 'ghost',
          group: {
            // 只允许放置shared的控件,禁止pull
            put: ['shared']
          }
        }
      },
      // 被关联字段列表
      relationList() {
        // 只有type内三项可作为被关联字段
        const type = ['select', 'radio', 'checkbox']
        const arr = this.sortable_item.filter(k => {
          return type.indexOf(k.ele) >= 0 && !!k.obj.name
        })
        return arr
      },
      // 被关联字段数据
      relationValue() {
        const name = this.modalFormData.relation_name
        let items = []
        if (!name) return items
        for (const i in this.sortable_item) {
          if (this.sortable_item[i].obj.name === name) {
            items = this.sortable_item[i].obj.items
          }
        }
        return items
      }
    },
    created() {
      this.$http.get('/static/form/label.json').then(d => {
        this.dataDict = d.data.items
      })
    }
  }
</script>

<style>
  el-main {
    padding: 0px
  }

  .inline {
    display: inline-block
  }

  .m-l-lg {
    margin-left: 30px
  }

  .wrapper {
    padding: 15px
  }

  .inline-block {
    display: inline-block
  }

  .padder-sm {
    padding-right: 10px;
    padding-left: 10px
  }

  .b-a {
    border: 1px solid #ccc
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb
  }

  .form-list-group {
    min-height: 200px;
    padding: 20px !important
  }


  /* 设置items下所有鼠标样式为 move */

  .items,
  .items * {
    cursor: move
  }


  /* 配置按钮默认位置 */


  /* 例如P Hr Title按钮 */

  .items .item-icon {
    transition: all 1s ease;
    position: absolute;
    top: -18px;
    right: 0px;
    opacity: 0;
    max-height: 0;
    overflow: hidden
  }


  /* form控件下配置按钮位置 */

  .ivu-form-item.items .item-icon {
    top: -25px
  }


  /* 配置按钮样式 */

  .item-icon i {
    cursor: pointer !important;
    margin-right: 5px
  }

  .items .item-icon {
    transition: inherit;
    opacity: 1;
    max-height: 50px
  }


  /* 提交按钮下方无 margin-bottom */

  .form_content .ivu-form-item:last-child {
    margin-bottom: 0
  }
  .formItem {
    width: 100%;
    position: absolute;
    bottom: -85px;
    text-align: center;
  }
  .formItem .ivu-form-item-content {
    margin-left: 0!important;
  }

  /* 表单校验选项样式 */

  .ivu-form-item-required .ivu-form-item-label:before {
    content: ''
  }

  .items.sortable-items-required .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14
  }

  .sortable_container {
    width: 50%;
  }

  .searchBth {
    display: inline-block;
    width: 200px;
    margin: 0px;
    padding: 0px;
  }
</style>
