import { shallowEqual, useSelector } from 'react-redux';
import { createPartitionSelector } from '../utils';

/**
 * Allows to query a store partition by a partition definition.
 *
 * @dependency useSelector from react-redux.
 *
 * @param {any} partition partition definition with action types.
 * @param {any} [equalityFunc] the function that will be used to determine equality.
 *
 * @returns {any} partition.
 */
export function usePartition(partition, equalityFunc = shallowEqual)
{
    return useSelector(createPartitionSelector(partition), equalityFunc);
}
