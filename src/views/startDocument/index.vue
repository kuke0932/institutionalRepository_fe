<template>
  <div class="container">
    <el-form>
      <el-row>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="value4" clearable placeholder="请选择完成状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style='min-width:120px;'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label-width="70px" label="流程">
            <el-input style='min-width:120px;'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button style="margin-left: 20px;" type="primary">查询</el-button>
        </el-col>
      </el-row>
      <el-col :span="3">
        <el-button type="primary">起草</el-button>
      </el-col>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 50px;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="number"
        label="编号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="name"
        label="流程名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="node"
        label="开始节点"
        width="200">
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="流程说明">
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
  </div>
</template>

<script>
    export default {
      name: 'index',
      data() {
        return {
          options: [{
            value: '选项1',
            label: '办理中'
          }, {
            value: '选项2',
            label: '已完成'
          }, {
            value: '选项3',
            label: '所有'
          }],
          value4: '',
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            explain: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            explain: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            explain: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            explain: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      }
    }
</script>

<style scoped>

</style>
