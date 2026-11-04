import { useEffect, useState } from 'react';

type RemoteState<T> = {
  load: (signal: AbortSignal) => Promise<T>;
  attempt: number;
  data: T | null;
  error: string | null;
};

export function useRemoteData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RemoteState<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setState({ load, attempt, data, error: null });
        }
      },
      () => {
        if (!controller.signal.aborted) {
          setState({
            load,
            attempt,
            data: null,
            error: 'We could not load this right now. Check your connection and try again.',
          });
        }
      },
    );

    return () => controller.abort();
  }, [load, attempt]);

  const current = state?.load === load && state.attempt === attempt ? state : null;

  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? null,
    retry: () => setAttempt((value) => value + 1),
  };
}
