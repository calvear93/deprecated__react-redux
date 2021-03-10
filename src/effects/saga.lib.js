/**
 * Shared generator patterns for Saga.
 *
 * @summary Shared generator patterns for Saga.
 * @author Alvear Candia, Cristopher Alejandro <calvear93@gmail.com>
 *
 * Created at     : 2020-05-16 22:43:58
 * Last modified  : 2021-03-10 18:48:48
 */

import { race, take, delay, put } from 'redux-saga/effects';

/**
 * Dispatches an action.
 *
 * @param {string} type action type.
 * @param {any} payload action payload.
 *
 * @yields {Array<any>}
 */
export function* putAction(type, payload)
{
    yield put({ type, payload });
}

/**
 * Waits for any action type to occur n times.
 *
 * @param {Array} types action types (from partitions definitions).
 * @param {number} times times for wait each action type.
 * @param {number} [timeout] timeout in milliseconds (0 no timeout).
 *
 * @yields {Array<any>}
 *
 * @returns {IterableIterator<any>} actions results.
 */
export function* takeAny(types, times, timeout = 0)
{
    // stores every result of action intercepted.
    let results = [];
    // waits for every dispatch (whether action belongs to types array).
    while (times-- > 0)
    {
        results.push(
            yield race(
                types.reduce((awaiter, actionType) =>
                {
                    awaiter[actionType] = take(actionType);

                    return awaiter;
                },
                timeout === 0 ? {} : { timeout: delay(timeout) })
            )
        );
    }

    return results;
}
