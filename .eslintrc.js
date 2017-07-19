module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true,
  },
  "rules": {
    "strict": 0,
    "no-console": 0,
    "global-require": 0,
    "jsx-a11y/href-no-hash": 0,
    "react/forbid-prop-types": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    'max-len': ["error", 120],
    "import/extensions": 0,
    "react/prefer-stateless-function": 0,
    "react/prop-types": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "react/require-default-props": 0,
    "react/no-array-index-key": 0,
    "no-unused-vars": 0,
    "eol-last": 0,
    "no-plusplus": 0,
  },
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "globals": {
    "DEBUG": true,
  }
};
