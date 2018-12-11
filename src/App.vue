<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  export default{
    name: 'APP'
  }
</script>

<style>
  .hidden{
    display: none;
  }
  .container{
    margin: 50px;
  }
  .num_pages input{
    padding:0;
    text-align: center;
    height:30px;
    outline: 0;
  }
  .num_pages span{
    margin: 0 5px;
  }
  .num_pages button{
    margin: 0 20px;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }


  .container{
    margin: 15px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 20px;
    background: #ffffff;
    overflow: hidden;
  }

  .searchForm .el-row{
    padding-top: 10px;
    margin-bottom: 15px;
  }

  .container .el-table {
    width: 100%;
    margin-top: 10px;
  }

  .container .el-form-item__label {
    width: 100px;
    text-align: left;
  }

  .el-row{
    margin-left: 0;
    margin-right: 0;
    border-bottom: 1px solid #f6f6f6;
  }

  .el-dialog .el-form-item {
    margin-bottom: 20px;
  }

  .order .el-form-item {
    margin-top: 0px;
    margin-bottom: 12px;
  }
  .order .el-form-item__error {
    padding-top: 0px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-table--medium td, .el-table--medium th{
    padding: 0;
    height: 36px;
  }
  th{
    font-weight: normal;
  }
  .el-table th, .el-table tr{
    background: none;
  }
  .el-table thead{
    background: #f2f2f2;
    color: #666666;
  }
  .el-table--border, .el-table--group{
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    border-right: 0;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 1px solid #e6e6e6;
  }
  .el-table td, .el-table th.is-leaf{
    border-bottom: 1px solid #e6e6e6;
  }
  .el-input--medium .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
  .el-button--medium{
    padding: 7px 15px;
  }
  .el-button--mini, .el-button--small{
    font-size: 14px;
  }
  .el-button--small, .el-button--small.is-round{
    padding: 7px 15px;
  }
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    min-width: 20px;
  }
  .el-pager li{
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .el-pagination button, .el-pagination span:not([class*=suffix]){
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .el-tree{
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 0px;
    -webkit-box-shadow: 2px 0px 5px #f2f2f2;
    -moz-box-shadow: 2px 0px 5px #f2f2f2;
    box-shadow: 2px 0px 5px #f2f2f2;
  }
  .treeTitle{
    text-indent: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #56585c;
    font-family: "Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
    background: #f2f2f2;
    margin-bottom: 0;
    margin-top: 15px;
    -webkit-box-shadow: 2px 0px 5px #f2f2f2;
    -moz-box-shadow: 2px 0px 5px #f2f2f2;
    box-shadow: 2px 0px 5px #f2f2f2;

  }
  .treeDetail{
    text-indent: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #56585c;
    font-family: "Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
    border-bottom: 1px solid #e6e6e6;
  }
  .btn_box{
    margin-top: 15px;
    margin-bottom: 11px;
  }
  .el-button--mini, .el-button--small{
    font-size: 12px;
  }
  .el-button--medium{
    /*font-size: 12px;*/
    margin-top: 3px;
  }
  .popover-style {
    overflow: hidden; white-space: nowrap; text-overflow: ellipsis;width:150px;
  }
  .popover-style p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width:150px;
  }
  .icon-btn {
    padding: 0
  }
  .cell p{
    margin: 0;
  }
  .el-pagination .el-select .el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
  .scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .scrollbar {
  }
  .introduction {
    /*text-decoration:underline;*/
    cursor:default;
  }
  .el-popover img{
    width: 100%;
    height: auto;
  }
  .el-table--enable-row-transition .el-table__body {
    background: #fff;
  }
  .print_page_print-row {
    background: rgba(92, 162, 159, 0.61) !important;
  }
  /*用户管理和部门管理等有树的*/
  .my-container{
    min-width: 1100px;
  }
  .el-col-19{
    min-width: 515px;
    width: 77%;
  }
  .my-el-row{
    min-width: 822px;
  }
  .my-el-tree-col4{
    width:218px
  }

  /* 预览页样式 */
  #preview .items, .items *{
    cursor: auto!important;
  }
  #preview h3 {
    text-align: center;
  }
</style>
