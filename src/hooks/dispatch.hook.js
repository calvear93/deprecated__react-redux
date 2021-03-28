import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Returns an action dispatcher.
 *
 * @dependency useEffect and useState from react,
 *  useDispatch from react-redux.
 *
 * @param {any} type action type (from partition definition).
 *
 * @returns {Function} dispatcher with payload as parameter.
 */
export function useActionDispatch(type)
{
    const dispatch = useDispatch();
    // dispatcher function.
    const [ action, setAction ] = useState(() => (payload) => dispatch({ type, payload }));

    useEffect(() =>
    {
        // sets dispatcher function.
        setAction(() => (payload) => dispatch({ type, payload }));
    }, [ type, dispatch ]);

    return action;
}
