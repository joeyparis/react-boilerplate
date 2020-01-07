/**
 * Container Generator
 */
 
const properCase = require('change-case').pascalCase;
const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: value => {
        if( (/\/\//).test(value) )  return "A parent directory cannot have two adjacent `/`"
        if( (/^\/|.+\/$/).test(value) ) return "A parent directory cannot start or end with a `/`"

        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: true,
      message:
        'Do you want an actions/constants/selectors/reducer tuple for this container?',
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    let filePath = data.name.split('/').map(properCase)
    const fullPath = filePath.join('/')
    const shortName = filePath.pop()
    filePath = filePath.join('/')

    const actions = [
      {
        type: 'add',
        path: `../../app/containers/${fullPath}/index.js`,
        templateFile: './container/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `../../app/containers/${fullPath}/tests/index.test.js`,
        templateFile: './container/test.js.hbs',
        abortOnFail: true,
      },
    ];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/messages.js`,
        templateFile: './container/messages.js.hbs',
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate the slice,
    // the selectors and the corresponding tests
    if (data.wantActionsAndReducer) {
      // Selectors
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/selectors.js`,
        templateFile: './container/selectors.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path:
          `../../app/containers/${fullPath}/tests/selectors.test.js`,
        templateFile: './container/selectors.test.js.hbs',
        abortOnFail: true,
      });

      // Slice
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/slice.js`,
        templateFile: './container/slice.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/tests/slice.test.js`,
        templateFile: './container/slice.test.js.hbs',
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/saga.js`,
        templateFile: './container/saga.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/tests/saga.test.js`,
        templateFile: './container/saga.test.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: `../../app/containers/${fullPath}/Loadable.js`,
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: `/containers${filePath ? `/${filePath}/` : '/'}`,
      name: shortName
    });


    return actions;
  },
};
