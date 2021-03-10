/**
 * Redux store initializer.
 *
 * Initializes combined reducers,
 * and apply Saga middleware.
 *
 * Here you should import your reducers
 * and sagas/thunks/epics into combiners.
 *
 * @summary Redux store initializer.
 * @author Alvear Candia, Cristopher Alejandro <calvear93@gmail.com>
 *
 * Created at     : 2020-05-16 22:41:11
 * Last modified  : 2021-03-09 20:19:55
 */

import { combineReducers, createStore } from 'redux';
import { all } from 'redux-saga/effects';
import createMiddleware from './middleware';

/**
 * Retrieves a sagas combiner generator.
 *
 * @param {Array<Generator<any, any, any>>} sagas
 *
 * @returns {*}
 */
function combiner(sagas)
{
    return function* combineSagas()
    {
        yield all(sagas);
    };
}

/**
 * Creates a new Redux store with
 * Redux Saga as middleware.
 *
 * @param {object} config
 * @param {Array<any>} config.reducers reducers
 * @param {Array<Generator<any, any, any>>} config.sagas sagas
 * @param {boolean} config.debug if redux-logger is enabled
 *
 * @returns {any} redux store
 */
export default function({ reducers = {}, sagas = [], debug })
{
    // creates middleware.
    const [ middleware, saga ] = createMiddleware(debug);

    // creates the store with reducers and Saga middleware.
    const store = createStore(combineReducers(reducers), middleware);

    // runs saga root middleware.
    saga.run(combiner(sagas));

    return store;
}
