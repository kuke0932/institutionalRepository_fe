/*
 * Form Properties
 */


var vm = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js.'
  },
  methods: {
    submitLose() {
      this.$message({
        message: '请选择一条数据',
        type: 'warning'
      });
    }
  }
})
var KisBpmFormNameCtrl = ['$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {
  // Config for the modal window 配置模式窗口
  var opts = {
    template: 'editor-app/configuration/properties/form-name-popup.html?version=' + Date.now(),
    scope: $scope
  }
  // Open the dialog 打开对话框
  $modal(opts)
}]
var KisBpmFormNamePopupCtrl = ['$scope', '$q', '$translate', '$timeout', '$http',
  function($scope, $q, $translate, $timeout, $http) {
    // 页面加载完成触发查询所有表名的事件
    setTimeout(function() {
      jQuery('#table').bootstrapTable({
        url: KISBPM.URL.getAllFormName(),
        method: 'GET',
        pagination: true,
        clickToSelect: true,
        sidePagination: "server",
        pageNumber:1, 
        pageSize: 5,
        pageList: [10, 25, 50, 100],
        queryParams: 	function(params) {
          params.pageSize = params.limit
          params.pageNum = params.offset/params.pageSize + 1
          params.name = $scope.description
          return params;
        },
        responseHandler: function(res) {
          return res.data;
        },
        columns: [{
          radio: true
          },{
              field: 'id',
              title: 'ID'
          }, {
              field: 'formName',
              title: '表名'
          }, {
              field: 'formDescription',
              title: '描述信息'
          }, {
              field: 'databaseFormName',
              title: '数据库表名'
        }]
        })
      }, 0)
    // 点击搜索按钮
    $scope.customSearch = function() {
      jQuery('#table').bootstrapTable('refresh', {});
    }
    // 表单列表保存按钮   给表单名称搜索框赋值
    $scope.sever = function() {
      var selectFormList= jQuery('#table').bootstrapTable('getSelections')
      if(selectFormList[0] === undefined) {
        vm.submitLose()
      } else {
        $scope.property.value = selectFormList[0].databaseFormName
        $scope.updatePropertyInModel($scope.property)
        $scope.$hide()
      }
    }
    // 表单列表取消按钮
    $scope.cancel = function() {
      $scope.$hide()
    }
  }]