module.exports = {
  ...require("@ionic/swiftlint-config"),
  excluded: [
    `${process.cwd()}/node_modules`,
    `${process.cwd()}/ios/Pods`,
    `${process.cwd()}/test-app/node_modules`,
    `${process.cwd()}/test-app/ios/App/Pods`,
  ],
  disabled_rules: ["identifier_name", "force_unwrapping", "type_body_length", "function_default_parameter_at_end"],
};
