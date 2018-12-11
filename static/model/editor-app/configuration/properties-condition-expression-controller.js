/*
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  $modal(opts);
}];

var KisBpmConditionExpressionPopupCtrl = ['$scope', '$translate', '$http', function ($scope, $translate, $http) {
  // 加载表格数据
  setTimeout(function(){
    jQuery('#table').bootstrapTable({
      url: KISBPM.URL.streamCondition(),
      method: 'GET',
      pagination: true,
      clickToSelect: true,
      sidePagination: "client",
      pageNumber:1, 
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      queryParams: 	function(params) {
        // params.pageSize = params.limit
        // params.pageNum = params.offset/params.pageSize + 1
        params.formName = $scope.search
        return params;
      },
      responseHandler: function(res) {
        return res.data;
      },
      columns: [{
            field: 'databaseFormName',
            title: '表名'
        }, {
            field: 'formDescription',
            title: '标题'
        }, {
            field: 'variableKey',
            title: '变量键'
        }, {
          field: 'elementType',
          title: '元素类型'
      }]
    })
  })
  $scope.streamSearch = function () {
    jQuery('#table').bootstrapTable('refresh', {});
  }
  // Put json representing condition on scope
  
  if ($scope.property.value !== undefined && $scope.property.value !== null) {

    $scope.conditionExpression = {value: $scope.property.value};

  } else {
    $scope.conditionExpression = {value: ''};
  }

  $scope.save = function () {
    $scope.property.value = $scope.conditionExpression.value;
    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.property.mode = 'read';
    $scope.$hide();
  };
}];
