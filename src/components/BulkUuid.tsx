import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { generateMany } from '../lib/uuid';
import CopyButton from './CopyButton';
import { useUuidVersion } from './UuidVersionContext';

const BULK_STATUS_TIMEOUT = 3000;

interface BulkUuidSectionProps {
    bulkCountInput: string;
    bulkUuids: string[];
    bulkStatus: string;
    bulkHasError: boolean;
    onCountChange: (value: string) => void;
    onGenerate: () => void;
    copyText: string;
    onCopySuccess: () => void;
    onCopyError: (message: string) => void;
    isReadOnly?: boolean;
}

function BulkUuidSection({
    bulkCountInput,
    bulkUuids,
    bulkStatus,
    bulkHasError,
    onCountChange,
    onGenerate,
    copyText,
    onCopySuccess,
    onCopyError,
    isReadOnly = false,
    version,
}: BulkUuidSectionProps & { version: string }) {
    return (
        <section
            aria-labelledby="bulk-heading"
            className="relative animate-float-up-delay-2 mb-8"
        >
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_1.5rem_4rem_-1rem_rgba(56,189,248,0.2)]">
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <h2
                            id="bulk-heading"
                            className="font-mono text-xs sm:text-sm text-white/60 uppercase tracking-widest truncate"
                        >
                            <span className="hidden xs:inline">Bulk </span>Generator
                            <span className="text-sky-400 ml-1 sm:ml-2">{version}</span>
                        </h2>
                    </div>
                </div>

                <div className="p-4 sm:p-6 border-b border-white/10">
                    <form
                        className="flex flex-wrap items-center gap-3 sm:gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onGenerate();
                        }}
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sky-400 font-mono text-sm">$</span>
                            <span className="text-white/40 font-mono text-xs uppercase tracking-widest">count</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={500}
                                value={bulkCountInput}
                                onChange={(event) =>
                                    onCountChange(event.target.value)
                                }
                                className={clsx(
                                    'w-20 px-3 py-2 rounded-lg bg-black/30 border font-mono text-lg text-white text-center transition-all duration-200',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                                    bulkHasError
                                        ? 'border-red-400 ring-2 ring-red-400/50 focus-visible:ring-red-400'
                                        : 'border-white/20 hover:border-sky-400/50 focus-visible:ring-sky-400',
                                )}
                                readOnly={isReadOnly}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-400 text-slate-950 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-sky-300 shadow-lg shadow-sky-400/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                onClick={onGenerate}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate
                            </button>
                            <CopyButton
                                text={copyText}
                                defaultLabel="Copy All"
                                disabled={!bulkUuids.length}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 hover:border-sky-400/50 hover:bg-sky-400/10 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-sky-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                onCopySuccess={onCopySuccess}
                                onCopyError={onCopyError}
                                aria-label="Copy all UUIDs"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sky-400 font-mono text-sm">→</span>
                            <span className="text-white/40 font-mono text-xs uppercase tracking-widest">output</span>
                        </div>
                        <span className="font-mono text-xs text-white/30 tabular-nums">
                            {bulkUuids.length} / 500
                        </span>
                    </div>

                    <div
                        className="max-h-72 overflow-y-auto rounded-lg bg-black/30 border border-white/10 p-4"
                        aria-live="polite"
                    >
                        {bulkUuids.length > 0 ? (
                            <div className="space-y-1.5">
                                {bulkUuids.map((uuid, index) => (
                                    <div
                                        key={uuid}
                                        className="group flex items-center gap-3 font-mono text-sm hover:bg-white/5 rounded px-2 py-1 -mx-2 transition-colors"
                                    >
                                        <span className="text-white/30 tabular-nums select-none w-8 text-right text-xs">
                                            {String(index + 1).padStart(3, '0')}
                                        </span>
                                        <span className="text-white/70 group-hover:text-sky-200 transition-colors tracking-wide">
                                            {uuid}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="text-4xl mb-3 opacity-20">∅</div>
                                <p className="text-white/40 font-mono text-xs">
                                    No UUIDs generated yet
                                </p>
                                <p className="text-white/25 font-mono text-[10px] mt-1">
                                    Enter count (1-500) and hit Generate
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <output className="sr-only" aria-live="polite">
                {bulkStatus}
            </output>
            {bulkStatus && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs font-mono text-sky-200">
                    <span className="text-sky-400">→</span>
                    {bulkStatus}
                </div>
            )}
        </section>
    );
}

export default function BulkUuid() {
    const { version } = useUuidVersion();
    const [bulkCountInput, setBulkCountInput] = useState('10');
    const [bulkUuids, setBulkUuids] = useState<string[]>([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const bulkStatusTimer = useRef<number | null>(null);

    const [bulkHasError, setBulkHasError] = useState(false);

    useEffect(() => {
        return () => {
            if (bulkStatusTimer.current)
                window.clearTimeout(bulkStatusTimer.current);
        };
    }, []);

    const scheduleBulkStatus = (
        message: string,
        timeout = BULK_STATUS_TIMEOUT,
    ) => {
        setBulkStatus(message);
        if (bulkStatusTimer.current)
            window.clearTimeout(bulkStatusTimer.current);
        bulkStatusTimer.current = window.setTimeout(
            () => setBulkStatus(''),
            timeout,
        );
    };

    const parseBulkCount = (): number | null => {
        const parsed = Number.parseInt(bulkCountInput, 10);
        if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return null;
        if (parsed < 1 || parsed > 500) return null;
        return parsed;
    };

    const handleBulkGenerate = () => {
        const count = parseBulkCount();
        if (!count) {
            setBulkHasError(true);
            scheduleBulkStatus('Enter a number between 1 and 500.');
            return;
        }

        try {
            const uuids = generateMany(count, version);
            setBulkUuids(uuids);
            setBulkHasError(false);
        } catch (error) {
            console.error(error);
            setBulkHasError(true);
            scheduleBulkStatus('Something went wrong while generating UUIDs.');
        }
    };

    const handleBulkCopySuccess = () => {
        scheduleBulkStatus('Copied UUID list.');
    };

    const handleCountChange = (value: string) => {
        setBulkCountInput(value);
        setBulkHasError(false);
    };

    return (
        <BulkUuidSection
            bulkCountInput={bulkCountInput}
            bulkUuids={bulkUuids}
            bulkStatus={bulkStatus}
            bulkHasError={bulkHasError}
            onCountChange={handleCountChange}
            onGenerate={handleBulkGenerate}
            copyText={bulkUuids.join('\n')}
            onCopySuccess={handleBulkCopySuccess}
            onCopyError={(message) => scheduleBulkStatus(message)}
            version={version}
        />
    );
}

export { BulkUuidSection };
