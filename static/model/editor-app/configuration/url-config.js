var KISBPM = KISBPM || {};

KISBPM.URL = {

  getModel: function (modelId) {
    return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/json';
  },

  getStencilSet: function () {
    return '/static/model/stencilset.json?version=' + Date.now();
  },

  putModel: function (modelId) {
    return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/save';
  },

  // 查询所有已经创建的表单
  getAllFormName: function() {
    return '/business/form/list'
  },
  // 查询已经创建的表单
  queryFormName: function() {
    return '/business/form/list'
  },
  // 分配用户弹窗代理人树
  assigneeTree: function() {
    return '/business/variable/tree'
  },
  // 分配用户弹窗代理人表单
  assigneeTable: function() {
    return '/business/variable/employee'
  },
  // 分配用户弹窗群组表单
  getAllList: function() {
    return '/business/variable/group'
  },
  // 流条件弹窗群组表单
  streamCondition: function() {
    return '/business/variable/variablekey'
  }
};
