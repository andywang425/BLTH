/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'selector-class-pattern': [
      '^[a-z][-a-z0-9]+(__[-a-z0-9]+)?(--[a-z0-9]+)?$',
      {
        message: (selector) => `Selector class ${selector} violates BEM Convention`,
        resolveNestedSelectors: true,
      },
    ],
  },
}
