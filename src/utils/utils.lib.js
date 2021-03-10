/**
 * Creates a partition selector.
 *
 * @param {any} partition partition definition with action types.
 *
 * @returns {Function} partition selector.
 */
export function createPartitionSelector(partition)
{
    return ({ [partition.Key]: store }) => store;
}

/**
 * Makes object properties of an object unique.
 *
 * @param {string} prefix unique key prefix.
 * @param {object} obj dictionary with actions types for declare.
 */
export function makeTypesUnique(prefix, obj)
{
    for (const key of Object.keys(obj))
        obj[key] = `${prefix}:${key}`;
}
