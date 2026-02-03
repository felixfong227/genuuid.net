import { clsx } from 'clsx';
import { useState } from 'react';

import { useTimedStatus } from '../hooks/useTimedStatus';
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-lg dark:border-white/10 dark:bg-white/5 dark:shadow-[0_1.5rem_4rem_-1rem_rgba(56,189,248,0.2)]">
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/20">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <h2
                            id="bulk-heading"
                            className="font-mono text-xs sm:text-sm text-slate-500 uppercase tracking-widest truncate dark:text-white/60"
                        >
                            <span className="hidden xs:inline">Bulk </span>
                            Generator
                            <span className="text-sky-600 ml-1 sm:ml-2 dark:text-sky-400">
                                {version}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10">
                    <form
                        className="flex flex-wrap items-center gap-3 sm:gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onGenerate();
                        }}
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sky-600 font-mono text-sm dark:text-sky-400">
                                $
                            </span>
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest dark:text-white/40">
                                count
                            </span>
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
                                    'w-20 px-3 py-2 rounded-lg border font-mono text-lg text-center transition-all duration-200',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                    'bg-white text-slate-900 focus-visible:ring-offset-white dark:bg-black/30 dark:text-white dark:focus-visible:ring-offset-slate-950',
                                    bulkHasError
                                        ? 'border-red-400 ring-2 ring-red-400/50 focus-visible:ring-red-400'
                                        : 'border-slate-300 hover:border-sky-600/50 focus-visible:ring-sky-600 dark:border-white/20 dark:hover:border-sky-400/50 dark:focus-visible:ring-sky-400',
                                )}
                                readOnly={isReadOnly}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-sky-700 shadow-lg shadow-sky-600/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300 dark:shadow-sky-400/30 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-950"
                                onClick={onGenerate}
                            >
                                <svg
                                    className="w-3.5 h-3.5"
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
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Generate
                            </button>
                            <CopyButton
                                text={copyText}
                                defaultLabel="Copy All"
                                disabled={!bulkUuids.length}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:border-sky-600/50 hover:bg-sky-600/10 font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-sky-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:hover:border-sky-400/50 dark:hover:bg-sky-400/10 dark:text-white/80 dark:hover:text-sky-200 dark:disabled:hover:border-white/20 dark:disabled:hover:bg-transparent dark:disabled:hover:text-white/80 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-950"
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
                            <span className="text-sky-600 font-mono text-sm dark:text-sky-400">
                                →
                            </span>
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest dark:text-white/40">
                                output
                            </span>
                        </div>
                        <span className="font-mono text-xs text-slate-400 tabular-nums dark:text-white/30">
                            {bulkUuids.length} / 500
                        </span>
                    </div>

                    <div
                        className="max-h-72 overflow-y-auto rounded-lg bg-white border border-slate-200 p-4 dark:bg-black/30 dark:border-white/10"
                        aria-live="polite"
                    >
                        {bulkUuids.length > 0 ? (
                            <div className="space-y-1.5">
                                {bulkUuids.map((uuid, index) => (
                                    <div
                                        key={uuid}
                                        className="group flex items-center gap-3 font-mono text-sm hover:bg-slate-100 rounded px-2 py-1 -mx-2 transition-colors dark:hover:bg-white/5"
                                    >
                                        <span className="text-slate-400 tabular-nums select-none w-8 text-right text-xs dark:text-white/30">
                                            {String(index + 1).padStart(3, '0')}
                                        </span>
                                        <span className="text-slate-600 group-hover:text-sky-700 transition-colors tracking-wide dark:text-white/70 dark:group-hover:text-sky-200">
                                            {uuid}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="text-4xl mb-3 opacity-20 text-slate-400 dark:text-white">
                                    ∅
                                </div>
                                <p className="text-slate-500 font-mono text-xs dark:text-white/40">
                                    No UUIDs generated yet
                                </p>
                                <p className="text-slate-400 font-mono text-[10px] mt-1 dark:text-white/25">
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
                <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs font-mono text-sky-700 dark:text-sky-200">
                    <span className="text-sky-600 dark:text-sky-400">→</span>
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
    const { status: bulkStatus, schedule: scheduleBulkStatus } =
        useTimedStatus(BULK_STATUS_TIMEOUT);

    const [bulkHasError, setBulkHasError] = useState(false);

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
