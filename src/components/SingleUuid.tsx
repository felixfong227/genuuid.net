import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
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
        if (!/^[0-9a-fA-F]*$/.test(value)) return;

        const currentParts =
            singleUuid === PLACEHOLDER_UUID
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
        singleUuid === PLACEHOLDER_UUID
            ? ['', '', '', '', '']
            : singleUuid.split('-');
    const safeParts = parts.length === 5 ? parts : ['', '', '', '', ''];

    return (
        <section
            aria-labelledby="single-heading"
            className="relative animate-float-up-delay-1 mb-8"
        >
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_1.5rem_4rem_-1rem_rgba(16,185,129,0.25)]">
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <h2
                            id="single-heading"
                            className="font-mono text-xs sm:text-sm text-white/60 uppercase tracking-widest truncate"
                        >
                            <span className="hidden xs:inline">Single </span>UUID
                            <span className="text-emerald-400 ml-1 sm:ml-2">{version}</span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="group shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-emerald-300 shadow-lg shadow-emerald-400/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        onClick={handleRegenerate}
                    >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">Regenerate</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-400 font-mono text-sm">$</span>
                        <span className="text-white/40 font-mono text-xs uppercase tracking-widest">current_uuid</span>
                    </div>
                    
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex items-center gap-0.5 font-mono text-[13px] xs:text-base sm:text-2xl md:text-3xl pb-2 min-w-max">
                            {safeParts.map((part, index) => (
                                <div key={index} className="flex items-center shrink-0">
                                    <input
                                        type="text"
                                        value={part}
                                        maxLength={INPUT_CONFIG[index].maxLength}
                                        onChange={(e) =>
                                            handlePartChange(index, e.target.value)
                                        }
                                        onPaste={handlePaste}
                                        style={{
                                            width: `${INPUT_CONFIG[index].maxLength + 0.5}ch`,
                                        }}
                                        className="bg-transparent p-0 text-center font-mono text-emerald-200 outline-none border-b-2 border-transparent focus:border-emerald-400 transition-colors placeholder-white/20 align-baseline"
                                        placeholder={'-'.repeat(
                                            INPUT_CONFIG[index].maxLength,
                                        )}
                                        aria-label={`UUID part ${index + 1}`}
                                    />
                                    {index < 4 && (
                                        <span className="text-white/30 mx-0.5">-</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 sm:mt-6 pt-4 border-t border-white/10">
                        <div className="hidden sm:flex items-center gap-3 text-white/40 text-xs font-mono">
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/60 text-[10px] font-semibold">G</kbd>
                                <span>regenerate</span>
                            </span>
                            <span className="text-white/20">│</span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/60 text-[10px] font-semibold">C</kbd>
                                <span>copy</span>
                            </span>
                        </div>
                        <CopyButton
                            ref={copyButtonRef}
                            text={singleUuid}
                            defaultLabel="Copy"
                            disabled={!hasGeneratedSingle}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-emerald-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                            onCopyError={(message) => scheduleSingleStatus(message)}
                            aria-label="Copy UUID"
                        />
                    </div>
                </div>
            </div>

            <output className="sr-only" aria-live="polite">
                {singleStatus}
            </output>
            {singleStatus && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs font-mono text-emerald-200">
                    <span className="text-emerald-400">→</span>
                    {singleStatus}
                </div>
            )}
        </section>
    );
}
