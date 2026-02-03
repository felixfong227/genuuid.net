import {
    type ClipboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTimedStatus } from '../hooks/useTimedStatus';
import { generateUuid } from '../lib/uuid';
import CopyButton from './CopyButton';
import { useUuidVersion } from './UuidVersionContext';

const SINGLE_STATUS_TIMEOUT = 2500;

const UUID_PARTS = [
    { id: 'time_low', maxLength: 8 },
    { id: 'time_mid', maxLength: 4 },
    { id: 'time_high', maxLength: 4 },
    { id: 'clock_seq', maxLength: 4 },
    { id: 'node', maxLength: 12 },
] as const;

export default function SingleUuid() {
    const { version } = useUuidVersion();
    const [singleUuid, setSingleUuid] = useState('');
    const { status: singleStatus, schedule: scheduleSingleStatus } =
        useTimedStatus(SINGLE_STATUS_TIMEOUT);

    const handleRegenerate = useCallback(() => {
        setSingleUuid(generateUuid(version));
    }, [version]);

    useEffect(() => {
        handleRegenerate();
    }, [handleRegenerate]);

    const canCopy = singleUuid.length > 0;

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
            if (canCopy && copyButtonRef.current) {
                copyButtonRef.current.click();
            } else {
                scheduleSingleStatus('Generate a UUID first.');
            }
        },
        {
            enableOnFormTags: false,
        },
        [canCopy, scheduleSingleStatus],
    );

    // Focus-trapped hotkey for mod+c (copy UUID) when inputs are focused
    const inputContainerRef = useHotkeys<HTMLDivElement>(
        'mod+c',
        (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                if (start !== null && end !== null && end > start) return;
            }

            if (canCopy && copyButtonRef.current) {
                event.preventDefault();
                copyButtonRef.current.click();
            } else {
                scheduleSingleStatus('Generate a UUID first.');
            }
        },
        {
            enableOnFormTags: ['INPUT'],
        },
        [canCopy, scheduleSingleStatus],
    );

    const handlePartChange = (index: number, value: string) => {
        if (!/^[0-9a-fA-F]*$/.test(value)) return;

        const currentParts =
            singleUuid.length === 0
                ? ['', '', '', '', '']
                : singleUuid.split('-');

        while (currentParts.length < 5) currentParts.push('');

        currentParts[index] = value;
        setSingleUuid(currentParts.join('-'));
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData('text').trim();

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
        singleUuid.length === 0 ? ['', '', '', '', ''] : singleUuid.split('-');
    const safeParts = parts.length === 5 ? parts : ['', '', '', '', ''];

    return (
        <section
            aria-labelledby="single-heading"
            className="relative animate-float-up-delay-1 mb-8"
        >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-lg dark:border-white/10 dark:bg-white/5 dark:shadow-[0_1.5rem_4rem_-1rem_rgba(16,185,129,0.25)]">
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/20">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <h2
                            id="single-heading"
                            className="font-mono text-xs sm:text-sm text-slate-500 uppercase tracking-widest truncate dark:text-white/60"
                        >
                            <span className="hidden xs:inline">Single </span>
                            UUID
                            <span className="text-emerald-600 ml-1 sm:ml-2 dark:text-emerald-400">
                                {version}
                            </span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="group shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300 dark:shadow-emerald-400/30 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-slate-950"
                        onClick={handleRegenerate}
                    >
                        <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:rotate-180 duration-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span className="hidden sm:inline">Regenerate</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-600 font-mono text-sm dark:text-emerald-400">
                            $
                        </span>
                        <span className="text-slate-500 font-mono text-xs uppercase tracking-widest dark:text-white/40">
                            current_uuid
                        </span>
                    </div>

                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div
                            ref={inputContainerRef}
                            className="flex items-center gap-0.5 font-mono text-[13px] xs:text-base sm:text-2xl md:text-3xl pb-2 min-w-max"
                        >
                            {UUID_PARTS.map((partConfig, index) => (
                                <div
                                    key={partConfig.id}
                                    className="flex items-center shrink-0"
                                >
                                    <input
                                        type="text"
                                        value={safeParts[index] ?? ''}
                                        maxLength={partConfig.maxLength}
                                        onChange={(e) =>
                                            handlePartChange(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        onPaste={handlePaste}
                                        style={{
                                            width: `${partConfig.maxLength + 0.5}ch`,
                                        }}
                                        className="p-0 text-center font-mono outline-none border-b-2 placeholder-slate-300 align-baseline bg-transparent text-emerald-700 border-transparent focus:border-emerald-600 transition-colors dark:placeholder-white/20 dark:text-emerald-200 dark:focus:border-emerald-400"
                                        placeholder={'-'.repeat(
                                            partConfig.maxLength,
                                        )}
                                        aria-label={`UUID part ${index + 1}`}
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        spellCheck={false}
                                    />
                                    {index < 4 && (
                                        <span className="text-slate-400 mx-0.5 dark:text-white/30">
                                            -
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 sm:mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                        <div className="hidden sm:flex items-center gap-3 text-slate-500 text-xs font-mono dark:text-white/40">
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 border border-slate-300 text-slate-700 text-[10px] font-semibold dark:bg-white/10 dark:border-white/20 dark:text-white/60">
                                    G
                                </kbd>
                                <span>regenerate</span>
                            </span>
                            <span className="text-slate-300 dark:text-white/20">│</span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 border border-slate-300 text-slate-700 text-[10px] font-semibold dark:bg-white/10 dark:border-white/20 dark:text-white/60">
                                    C
                                </kbd>
                                <span>copy</span>
                            </span>
                        </div>
                        <CopyButton
                            ref={copyButtonRef}
                            text={singleUuid}
                            defaultLabel="Copy"
                            disabled={!canCopy}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:border-emerald-600/50 hover:bg-emerald-600/10 font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-emerald-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/10 dark:text-white/80 dark:hover:text-emerald-200 dark:disabled:hover:border-white/20 dark:disabled:hover:bg-transparent dark:disabled:hover:text-white/80 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-slate-950"
                            onCopyError={(message) =>
                                scheduleSingleStatus(message)
                            }
                            aria-label="Copy UUID"
                        />
                    </div>
                </div>
            </div>

            <output className="sr-only" aria-live="polite">
                {singleStatus}
            </output>
            {singleStatus && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-200">
                    <span className="text-emerald-600 dark:text-emerald-400">→</span>
                    {singleStatus}
                </div>
            )}
        </section>
    );
}
