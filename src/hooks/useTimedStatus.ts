import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimedStatus(defaultTimeoutMs: number) {
    const [status, setStatus] = useState('');
    const timerRef = useRef<number | null>(null);

    const clear = useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setStatus('');
    }, []);

    const schedule = useCallback(
        (message: string, timeoutMs = defaultTimeoutMs) => {
            setStatus(message);

            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }

            timerRef.current = window.setTimeout(() => {
                timerRef.current = null;
                setStatus('');
            }, timeoutMs);
        },
        [defaultTimeoutMs],
    );

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    return { status, schedule, clear };
}
