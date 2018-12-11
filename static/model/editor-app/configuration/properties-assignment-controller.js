/*
 * Assignment
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
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
    scope: $scope
  };
  // Open the dialog
  $modal(opts);
}];

var KisBpmAssignmentPopupCtrl = ['$scope', '$modal', function ($scope, $modal) {
  // $scope.assignment.assignee = "${userId}"
  // Put json representing assignment on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null
    && $scope.property.value.assignment !== undefined
    && $scope.property.value.assignment !== null) {
    $scope.assignment = $scope.property.value.assignment;
  } else {
    $scope.assignment = {};
  }

  if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
    $scope.assignment.candidateUsers = [{value: ''}];
  }

  // Click handler for + button after enum value 在枚举值之后单击handler for +按钮
  var userValueIndex = 1;
  $scope.addCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index + 1, 0, {value: 'value ' + userValueIndex++});
  };

  // Click handler for - button after enum value
  $scope.removeCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index, 1);
  };


  

  if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
    $scope.assignment.candidateGroups = [{value: ''}];
  }

  var groupValueIndex = 1;
  $scope.addCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index + 1, 0, {value: 'value ' + groupValueIndex++});
  };

  // Click handler for - button after enum value 在枚举值之后单击handler for -按钮
  $scope.removeCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index, 1);
  };

  $scope.save = function () {

    $scope.property.value = {};
    handleAssignmentInput($scope);
    $scope.property.value.assignment = $scope.assignment;

    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // 加载页面给Assignee 输入框赋值
  $scope.inputValue = function() {
    $scope.assignment.assignee = '${userId}'
    $scope.assignment.candidateUsers = ''
    $scope.assignment.candidateGroup = ''
  },
  // 点击代理人输入框
  $scope.modalAssigneeOpen = function() {
    // Config for the modal window
    var opts = {
      template: 'editor-app/configuration/properties/assignment-popup-assignee.html?version=' + Date.now(),
      scope: $scope
    };

    // Open the dialog
    $modal(opts);
  }

  // 点击用户输入框
  $scope.modalUserOpen = function() {
    // Config for the modal window
    var opts = {
      template: 'editor-app/configuration/properties/assignment-popup-user.html?version=' + Date.now(),
      scope: $scope
    };

    // Open the dialog
    $modal(opts);
  }

  // 点击群组输入框
  $scope.modalGroupsOpen = function() {
    // Config for the modal window
    var opts = {
      template: 'editor-app/configuration/properties/assignment-popup-groups.html?version=' + Date.now(),
      scope: $scope
    };

    // Open the dialog
    $modal(opts);
  }
  // Close button handler
  $scope.close = function () {
    handleAssignmentInput($scope);
    $scope.property.mode = 'read';
    $scope.$hide();
  };
  var handleAssignmentInput = function ($scope) {
    if ($scope.assignment.candidateUsers) {
      var emptyUsers = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
        if ($scope.assignment.candidateUsers[i].value != '') {
          emptyUsers = false;
        }
        else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
      }

      if (emptyUsers) {
        $scope.assignment.candidateUsers = undefined;
      }
    }

    if ($scope.assignment.candidateGroups) {
      var emptyGroups = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
        if ($scope.assignment.candidateGroups[i].value != '') {
          emptyGroups = false;
        }
        else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
      }

      if (emptyGroups) {
        $scope.assignment.candidateGroups = undefined;
      }
    }
  };
}];

// 代理人组件页面的方法
var KisBpmAssignmentPopupAssigneeCtrl = ['$scope', '$http', function ($scope, $http) {
  $scope.assigneeTree = function() {
    $http({
      method: 'GET',
      ignoreErrors: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      url: KISBPM.URL.assigneeTree()
    })
    .success(function (data, status, headers, config) {
      var treeData = data.data
      if (treeData != null && treeData.length > 0) {
        jQuery('#tree').treeview({data: treeData});
        jQuery('#tree').on('nodeSelected', function(event, data) {
          var params={
            pageSize: 5,
            pageNum: 1,
            depId: data.depId
          }
          $http({
            method: 'POST',
            data: params,
            ignoreErrors: true,
            url: KISBPM.URL.assigneeTable()
          })
          .success(function (data, status, headers, config){
            var arr = data.data.rows
            jQuery("#table").bootstrapTable('destroy');
            jQuery('#table').bootstrapTable({
              pagination: true,
              clickToSelect: true,
              sidePagination: "server",
              pageNumber:1, 
              pageSize: 5,
              pageList: [10, 25, 50, 100],
              columns: [{
                radio: true
                },{
                    field: 'id',
                    title: '部门ID'
                }, {
                    field: 'department_name',
                    title: '部门名称'
                }, {
                    field: 'user_id',
                    title: '用户ID'
                }, {
                    field: 'user_name',
                    title: '用户名称'
              }],
              data: arr
            })
          });
        })
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data)
    });
  };
  $scope.save2 = function () {
    
    var assignmentUserName = jQuery('#table').bootstrapTable('getAllSelections');
    if(assignmentUserName[0] === undefined) {
      vm.submitLose()
    } else {
      $scope.assignment.assignee = assignmentUserName[0].user_id
      if ($scope.assignment.assignee) {
        $scope.assignment.candidateUsers = ''
        $scope.assignment.candidateGroup = ''
      }
      $scope.$hide();
    }
  };
  $scope.close = function () {
    $scope.$hide();
  };
}];
// 用户组件页面的方法
// 存放bootstrap table 选中的数据
var overAllIds = new Array();
var KisBpmAssignmentPopupUserCtrl = ['$scope', '$http', function ($scope, $http) {
  $scope.userTree = function() {
    $http({
      method: 'GET',
      ignoreErrors: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      url: KISBPM.URL.assigneeTree()
    })
    .success(function (data, status, headers, config) {
      var treeData = data.data
      if (treeData != null && treeData.length > 0) {
        jQuery('#tree').treeview({data: treeData});
        jQuery('#tree').on('nodeSelected', function(event, data) {
          
          var params={
            pageSize: 5,
            pageNum: 1,
            depId: data.depId
          }
          $http({
            method: 'POST',
            data: params,
            ignoreErrors: true,
            url: KISBPM.URL.assigneeTable()
          })
          .success(function (data, status, headers, config){
            var arr = data.data.rows
            jQuery("#table").bootstrapTable('load',arr);
            jQuery('#table').bootstrapTable({
              pagination: true,
              clickToSelect: true,
              sidePagination: "server",
              pageNumber:1, 
              pageSize: 5,
              pageList: [10, 25, 50, 100],
              columns: [{
                checkbox: true,
                formatter: function (i,row) {           // 每次加载 checkbox 时判断当前 row 的 id 是否已经存在全局 Set() 里
                  if(jQuery.inArray(row.user_id,overAllIds)!=-1){// 因为 判断数组里有没有这个 id 
                      return {
                        checked : true               // 存在则选中
                      }
                    }
                  } 
                },{
                    field: 'id',
                    title: '部门ID'
                }, {
                    field: 'department_name',
                    title: '部门名称'
                }, {
                    field: 'user_id',
                    title: '用户ID'
                }, {
                    field: 'user_name',
                    title: '用户名称'
              }],
              data: arr
            })
            jQuery('#table').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
              var datas = jQuery.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
              examine(e.type,datas)
            });
          });
        })
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data)
    });
  };
  // 监听bootstrap table选中的数据存在数组中
  function examine(type,datas){
    if(type.indexOf('uncheck')==-1){    
      jQuery.each(datas,function(i,v){
        // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
        overAllIds.indexOf(v.user_id) == -1 ? overAllIds.push(v.user_id) : -1;
      });
    }else{
      jQuery.each(datas,function(i,v){
        overAllIds.splice(overAllIds.indexOf(v.user_id),1);    //删除取消选中行
      });
    }
  }
  // 点击保存把选中数据 填充到页面输入框中
  $scope.save1 = function () {
    if(overAllIds[0] === undefined) {
      vm.submitLose()
    } else {
      $scope.assignment.candidateUsers = overAllIds
      if ($scope.assignment.candidateUsers) {
        $scope.assignment.assignee = ''
        $scope.assignment.candidateGroup = ''
      }
      overAllIds = []
      $scope.$hide();
    }
  };
  // 点击取消按钮 隐藏显示框
  $scope.close = function () {
    $scope.$hide();
  };
}];

// 群组组件页面方法
var KisBpmAssignmentPopupGroupsCtrl = ['$scope', '$http', function ($scope, $http) {
  setTimeout(function() {
    jQuery('#table').bootstrapTable({
      url: KISBPM.URL.getAllList(),
      method: 'GET',
      pagination: true,
      clickToSelect: true,
      sidePagination: "client",
      pageNumber:1,
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      queryParams: 	function(params) {
        params.pageSize = params.limit
        params.pageNum = params.offset/params.pageSize
        params.groupName = $scope.description
        return params;
      },
      responseHandler: function(res) {
        return res.data;
      },
      columns: [{
        checkbox: true
      },{
        field: 'id',
        title: 'ID'
      }, {
        field: 'name',
        title: '组名'
      }, {
        field: 'type',
        title: '类型'
      }]
    })
  }, 0)
  // 点击搜索按钮
  $scope.customSearch = function() {
    jQuery('#table').bootstrapTable('refresh', {});
  }
  // 表单列表保存按钮   给表单名称搜索框赋值
  $scope.sever = function() {
    var listArr = []
    var getAllList= jQuery('#table').bootstrapTable('getSelections')
    if(getAllList[0] === undefined) {
      vm.submitLose()
    } else {
      for (var i=0; i<getAllList.length; i++) {
        listArr.push(getAllList[i].name)
      }
      $scope.assignment.candidateGroup = listString
      if ($scope.assignment.candidateGroup) {
        $scope.assignment.assignee = ''
        $scope.assignment.candidateUsers = ''
      }
      $scope.$hide()
    }
  }
  // 表单列表取消按钮
  $scope.cancel = function() {
    $scope.$hide()
  }
}];