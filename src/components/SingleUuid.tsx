import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type ClipboardEvent,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { generateUuid } from '../lib/uuid';
import CopyButton from './CopyButton';
import { useUuidVersion } from './UuidVersionContext';

const PLACEHOLDER_UUID = '------------------------------------';
const SINGLE_STATUS_TIMEOUT = 2500;

const INPUT_CONFIG = [
    { maxLength: 8, flex: 2 },
    { maxLength: 4, flex: 1 },
    { maxLength: 4, flex: 1 },
    { maxLength: 4, flex: 1 },
    { maxLength: 12, flex: 3 },
];

export default function SingleUuid() {
    const { version } = useUuidVersion();
    const [singleUuid, setSingleUuid] = useState<string>(PLACEHOLDER_UUID);
    const [singleStatus, setSingleStatus] = useState('');
    const singleStatusTimer = useRef<number | null>(null);

    const handleRegenerate = useCallback(() => {
        setSingleUuid(generateUuid(version));
    }, [version]);

    useEffect(() => {
        handleRegenerate();

        return () => {
            if (singleStatusTimer.current)
                window.clearTimeout(singleStatusTimer.current);
        };
    }, [handleRegenerate]);

    const hasGeneratedSingle = useMemo(
        () => singleUuid !== PLACEHOLDER_UUID,
        [singleUuid],
    );

    const scheduleSingleStatus = (
        message: string,
        timeout = SINGLE_STATUS_TIMEOUT,
    ) => {
        setSingleStatus(message);
        if (singleStatusTimer.current)
            window.clearTimeout(singleStatusTimer.current);
        singleStatusTimer.current = window.setTimeout(
            () => setSingleStatus(''),
            timeout,
        );
    };

    useHotkeys(
        'g',
        (event) => {
            event.preventDefault();
            handleRegenerate();
        },
        {
            enableOnFormTags: false,
        },
        [handleRegenerate],
    );

    const copyButtonRef = useRef<HTMLButtonElement>(null);

    useHotkeys(
        'c',
        (event) => {
            event.preventDefault();
            if (hasGeneratedSingle && copyButtonRef.current) {
                copyButtonRef.current.click();
            } else {
                scheduleSingleStatus('Generate a UUID first.');
            }
        },
        {
            enableOnFormTags: false,
        },
        [hasGeneratedSingle],
    );

    const handlePartChange = (index: number, value: string) => {
        // Allow only hex chars
        if (!/^[0-9a-fA-F]*$/.test(value)) return;

        const currentParts =
            singleUuid === PLACEHOLDER_UUID
                ? ['', '', '', '', '']
                : singleUuid.split('-');

        // Ensure we have 5 parts
        while (currentParts.length < 5) currentParts.push('');

        currentParts[index] = value;
        setSingleUuid(currentParts.join('-'));
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData('text').trim();

        // Regex for 32 hex chars (dashless UUID)
        const dashlessMatch = text.match(
            /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
        );

        if (dashlessMatch) {
            event.preventDefault();
            const parts = dashlessMatch.slice(1);
            const formattedUuid = parts.join('-');
            setSingleUuid(formattedUuid);
            window.requestAnimationFrame(() => {
                copyButtonRef.current?.click();
            });
            scheduleSingleStatus(
                'Pasted UUID formatted automatically and copied.',
            );
            return;
        }

        // Regex for standard UUID
        if (
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                text,
            )
        ) {
            event.preventDefault();
            setSingleUuid(text);
            scheduleSingleStatus('Pasted UUID applied.');
            return;
        }
    };

    const parts =
        singleUuid === PLACEHOLDER_UUID
            ? ['', '', '', '', '']
            : singleUuid.split('-');
    const safeParts = parts.length === 5 ? parts : ['', '', '', '', ''];

    return (
        <section
            aria-labelledby="single-heading"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_1.875rem_5rem_-1.25rem_rgba(16,185,129,0.35)] backdrop-blur-sm"
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h2
                        id="single-heading"
                        className="text-2xl font-semibold text-white md:text-3xl"
                    >
                        Single UUID{version}
                    </h2>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    onClick={handleRegenerate}
                >
                    Regenerate
                </button>
            </div>

            <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 px-5 py-4">
                    <span className="text-xs uppercase tracking-[0.35em] text-white/35">
                        Current UUID
                    </span>
                    <div className="mt-3 flex items-baseline font-mono text-lg text-emerald-200 md:text-xl">
                        {safeParts.map((part, index) => (
                            <div key={index} className="flex items-baseline">
                                <input
                                    type="text"
                                    value={part}
                                    maxLength={INPUT_CONFIG[index].maxLength}
                                    onChange={(e) =>
                                        handlePartChange(index, e.target.value)
                                    }
                                    onPaste={handlePaste}
                                    style={{
                                        width: `${INPUT_CONFIG[index].maxLength}ch`,
                                    }}
                                    className="bg-transparent p-0 text-center font-mono outline-none border-b-2 border-transparent focus:border-emerald-400 placeholder-white/20 align-baseline"
                                    placeholder={'-'.repeat(
                                        INPUT_CONFIG[index].maxLength,
                                    )}
                                    aria-label={`UUID part ${index + 1}`}
                                />
                                {index < 4 && (
                                    <span className="select-none text-white/30">
                                        -
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CopyButton
                        ref={copyButtonRef}
                        text={singleUuid}
                        defaultLabel="Copy"
                        disabled={!hasGeneratedSingle}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 w-24 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
                        onCopyError={(message) => scheduleSingleStatus(message)}
                        aria-label="Copy UUID"
                    />
                </div>
            </div>

            <p className="mt-6 text-xs text-white/55">
                Shortcuts: press{' '}
                <span className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">
                    g
                </span>{' '}
                to regenerate,{' '}
                <span className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">
                    c
                </span>{' '}
                to copy.
            </p>
            <output className="sr-only" aria-live="polite">
                {singleStatus}
            </output>
            {singleStatus && (
                <p className="mt-4 text-xs text-emerald-200" aria-hidden="true">
                    {singleStatus}
                </p>
            )}
        </section>
    );
}
