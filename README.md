# React Redux

React library for eases Redux initialization for React SPA application.
Is preconfigured and included helpful libraries as redux-logger and reselect.

## Structure 📋

```bash
├── README.md
├── LICENCE.md
├── CHANGELOG.md
├── .vscode/ # vscode shared development config
├── src/
│   ├── effects/ # extra saga effects
│   ├── hooks/ # extra redux hooks
│   ├── reselect/ # reselect export bypass
│   ├── utils/ # action types utils
│   ├── middleware.js # middleware loader
│   ├── store.js # createStore
│   └── index.js
├── package.json
├── jsconfig.js
├── .babelrc
├── .eslintrc.json
└── .prettierrc.json
```

- **store.js**: exports createStore wrapper function and StoreProvider.
- **middleware.js**: initializes middleware, redux-logger.

## How To Use 💡

Should be initialized with StoreProvider on App.jsx like:
```javascript
import { StoreProvider } from '@calvear/react-redux';
import store from 'store';

export default function App()
{
    return (
        <StoreProvider store={ store }>
            <h1>Welcome to My App!</h2>
        </RouterProvider>
    );
}
```

So, you can create your first reducer, for example in store folder:
```bash
├── ...
├── store/
│   ├── sample/
│   │   │   ├── sample.partition.js # contains actions types and partition/store states
│   │   │   ├── sample.reducer.js # reducer
│   │   │   └── sample.saga.js # saga middleware
│   └── index.js # exports default store
├── App.jsx
└── index.js
```

Define your partition definition, containing
partition key and actions types in sample.partition.js:
```javascript
export default {
    // partition key
    Key: 'SAMPLE',

    // action types
    Type: {
        EXEC: 'EXEC',
        COMMIT: 'COMMIT',
        ROLLBACK: 'ROLLBACK'
    },

    // partition states
    State: {
        PREPARING: 'PREPARING',
        EXECUTING: 'EXECUTING',
        READY: 'READY',
        FAILED: 'FAILED'
    }
};
```

Define your reducer in sample.reducer.js:
```javascript
import SamplePartition from './sample.partition';

export default function SampleReducer(store = {}, action)
{
    const { type, payload } = action;

    switch (type)
    {
        // executes the action.
        case SamplePartition.Type.EXEC:
            return {
                ...store,
                state: SamplePartition.State.EXECUTING,
                data: payload
            };

        // action is successful.
        case SamplePartition.Type.COMMIT:
            return {
                ...store,
                state: SamplePartition.State.READY
            };

        // action was finished with errors.
        case SamplePartition.Type.ROLLBACK:
            return {
                ...store,
                state: SamplePartition.State.FAILED,
                error: payload
            };

        // default doesn't changes the store,
        // so, components won't re-renders.
        default:
            return store;
    }
}
```

Finally (optional) your middleware saga in sample.saga.js:
```javascript
import { all, call, takeLatest, putAction } from '@calvear/react-redux/effects';
import SamplePartition from './sample.partition';
import Service from 'adapters/service';

function* exec({ payload })
{
    try
    {
        const data = yield call(Service.GetData);

        // Success action.
        yield putAction(
            SamplePartition.Type.COMMIT,
            data
        );
    }
    catch (e)
    {
        yield putAction(
            SamplePartition.Type.ROLLBACK,
            {
                stacktrace: e,
                message: 'Operation cannot be completed'
            }
        );
    }
}

export default function* run()
{
    yield all([ // use all only if exists two or more listeners.
        takeLatest(SamplePartition.Type.EXEC, exec)
    ]);
}

```

Finally, your store/index.js file should looks like:

```javascript
import { createStore } from '@calvear/react-redux';
import { SamplePartition, SampleReducer, SampleSaga } from './sample';

// whether redux-logger is enabled.
const debug = process.env.REACT_APP_DEBUG === 'true';

const reducers ={
    [SamplePartition.Key]: SampleReducer
};

const sagas = [
    SampleSaga()
];

export default createStore({ reducers, sagas, debug });
```

### Hooks

TODO

### Saga Effects

TODO

## Linting 🧿

Project uses ESLint, for code formatting and code styling normalizing.

- **eslint**: JavaScript and React linter with Airbnb React base config and some other additions.
- **prettier**: optional Prettier config.

For correct interpretation of linters, is recommended to use [Visual Studio Code](https://code.visualstudio.com/) as IDE and install the plugins in .vscode folder at 'extensions.json', as well as use the config provided in 'settings.json'

## Changelog 📄

For last changes see [CHANGELOG.md](CHANGELOG.md) file for details.

## Built with 🛠️

- [React](https://reactjs.org/) - the most fabulous JavaScript framework.
- [Redux](https://redux.js.org/) - most popular frontend state handler.
- [React Redux](https://react-redux.js.org/) - perfect React Redux integration.
- [Redux Saga](https://redux-saga.js.org/) - powerfull Redux middleware.
- [Redux Logger](https://github.com/LogRocket/redux-logger) - impressive logger for Redux actions.
- [reselect](https://github.com/reduxjs/reselect) - redux memoized selectors library.

## License 📄

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) file for details.

---

⌨ by [Alvear Candia, Cristopher Alejandro](https://github.com/calvear93)
