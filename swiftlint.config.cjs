module.exports = {
  ...require('@ionic/swiftlint-config'),
  excluded: [ `${process.cwd()}/node_modules`, `${process.cwd()}/ios/Pods` ],
  disabled_rules: [
    'identifier_name',
    'force_unwrapping',
    'type_body_length',
    'function_default_parameter_at_end'
  ]
};
