import { useCallback, useReducer, useRef } from 'react';

import { useSafeDispatch } from './use-safe-dispatch';

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
const defaultInitialState = { status: 'idle', data: null, error: null };

export function useAsync(initialState) {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = useReducer((s, a) => ({ ...s, ...a }), initialStateRef.current);

  const safeSetState = useSafeDispatch(setState);

  const setData = useCallback((newData) => safeSetState({ data: newData, status: 'resolved' }), [safeSetState]);
  const setError = useCallback((newError) => safeSetState({ error: newError, status: 'rejected' }), [safeSetState]);
  const reset = useCallback(() => safeSetState(initialStateRef.current), [safeSetState]);

  const run = useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        );
      }
      safeSetState({ status: 'pending' });
      return promise.then(
        (dataResponse) => {
          setData(dataResponse);
          return dataResponse;
        },
        (newError) => {
          setError(newError);
          return Promise.reject(newError);
        },
      );
    },
    [safeSetState, setData, setError],
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}
