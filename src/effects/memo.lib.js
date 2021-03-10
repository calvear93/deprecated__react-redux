/**
 * Shared generator patterns for Saga.
 *
 * @summary Shared generator patterns for Saga.
 * @author Alvear Candia, Cristopher Alejandro <calvear93@gmail.com>
 *
 * Created at     : 2020-05-16 22:43:58
 * Last modified  : 2021-03-10 19:29:50
 */

import { call } from 'redux-saga/effects';

/**
 * Browser storage types.
 */
export const storageType = {
    LOCAL_STORAGE: 'localStorage',
    SESSION_STORAGE: 'sessionStorage',
    MEMORY_STORAGE: 'memoryStorage'
};

// initializes memory storage.
window[storageType.MEMORY_STORAGE] = {};

/**
 * Writes a value to storage.
 *
 * @param {string} key item key.
 * @param {any} value value for store.
 * @param {string} [storageType] storage type. Default is localStorage.
 */
export function write(key, value, storageType = storageType.LOCAL_STORAGE)
{
    try
    {
        if (storageType.MEMORY_STORAGE)
        {
            window[storageType][key] = value;

            return;
        }

        if (!value)
            window[storageType].setItem(key, value);
        else
            window[storageType].setItem(key, JSON.stringify(value));
    }
    catch
    {
        window[storageType].clear();
    }
}

/**
 * Reads a value from storage.
 *
 * @param {string} key item key.
 * @param {string} [storageType] storage type. Default is localStorage.
 *
 * @returns {any} stored value.
 */
export function read(key, storageType = storageType.LOCAL_STORAGE)
{
    if (storageType.MEMORY_STORAGE)
        return window[storageType][key];

    const data = window[storageType].getItem(key);

    if (!data || data === 'null' || data === 'undefined' || data === '{}' || data === '[]')
        return null;

    return JSON.parse(data);
}

/**
 * Calculates the date in
 * next days.
 *
 * @param {number} days next days.
 *
 * @returns {Date} date in next days from now.
 */
function dateNextDays(days)
{
    if (!days)
        return null;

    const date = new Date();

    date.setDate(date.getDate() + days);

    return date;
}

/**
 * Persists the result from an generator
 * callback, storing it in browser storage.
 *
 * @param {string} key persisted value accessor.
 * @param {IterableIterator<any>} generator generator callback.
 * @param {string} [config] memo config.
 * @param {string} [config.storageType] storage type.
 * @param {number | null} [config.expirationInDays] cache duration days.
 * @param {Array} args generator function args.
 *
 * @yields {any}
 * @throws {Error} on non valid key.
 *
 * @returns {IterableIterator<any>} cached/persisted value or result.
 */
export function* memoCall(key, generator, { expirationInDays, storageType = storageType.LOCAL_STORAGE } = {}, ...args)
{
    const cache = read(key, storageType);

    // optimistic data refresh.
    if (cache?.expiration && new Date().getTime() > new Date(cache.expiration).getTime())
    {
        // delayed data refresh from source.
        (function* ()
        {
            const data = yield call(generator, ...args);
            write(key, { expiration: dateNextDays(expirationInDays), data }, storageType);
        })();
    }

    if (cache && cache !== 'undefined')
        return cache.data;

    const data = yield call(generator, ...args);
    write(key, { expiration: dateNextDays(expirationInDays), data }, storageType);

    return data;
}
