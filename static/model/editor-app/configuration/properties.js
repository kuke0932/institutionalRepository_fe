'use strict'
var KISBPM = KISBPM || {}
KISBPM.PROPERTY_CONFIG =
{
  'string': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/default-value-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/string-property-write-mode-template.html'
  },
  'boolean': {
    'templateUrl': 'editor-app/configuration/properties/boolean-property-template.html'
  },
  'text': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/default-value-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/text-property-write-template.html'
  },
  'kisbpm-multiinstance': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/default-value-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/multiinstance-property-write-template.html'
  },
  'oryx-formproperties-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/form-properties-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/form-properties-write-template.html'
  },
  'oryx-formkeydefinition-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/form-name-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/form-name-write-template.html'
  },
  'oryx-executionlisteners-multiplecomplex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/execution-listeners-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/execution-listeners-write-template.html'
  },
  'oryx-tasklisteners-multiplecomplex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/task-listeners-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/task-listeners-write-template.html'
  },
  'oryx-eventlisteners-multiplecomplex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/event-listeners-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/event-listeners-write-template.html'
  },
  'oryx-usertaskassignment-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/assignment-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/assignment-write-template.html'
  },
  'oryx-servicetaskfields-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/fields-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/fields-write-template.html'
  },
  'oryx-callactivityinparameters-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/in-parameters-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/in-parameters-write-template.html'
  },
  'oryx-callactivityoutparameters-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/out-parameters-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/out-parameters-write-template.html'
  },
  'oryx-subprocessreference-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/subprocess-reference-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/subprocess-reference-write-template.html'
  },
  'oryx-sequencefloworder-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/sequenceflow-order-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/sequenceflow-order-write-template.html'
  },
  'oryx-conditionsequenceflow-complex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/condition-expression-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/condition-expression-write-template.html'
  },
  'oryx-signaldefinitions-multiplecomplex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/signal-definitions-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/signal-definitions-write-template.html'
  },
  'oryx-signalref-string': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/default-value-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/signal-property-write-template.html'
  },
  'oryx-messagedefinitions-multiplecomplex': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/message-definitions-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/message-definitions-write-template.html'
  },
  'oryx-messageref-string': {
    'readModeTemplateUrl': 'editor-app/configuration/properties/default-value-display-template.html',
    'writeModeTemplateUrl': 'editor-app/configuration/properties/message-property-write-template.html'
  }
}
