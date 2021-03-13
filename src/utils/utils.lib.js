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
 * Makes action types of partition handler unique.
 *
 * @param {any} partition partition action types.
 *
 */
export function packagePartitionHandler(partition)
{
    for (const key of Object.keys(partition.Type))
        partition.Type[key] = `${partition.Key}:${key}`;
}
