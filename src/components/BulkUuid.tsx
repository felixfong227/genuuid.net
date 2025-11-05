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
            className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-[0_1.875rem_5rem_-1.5rem_rgba(96,165,250,0.28)] backdrop-blur-sm"
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h2
                        id="bulk-heading"
                        className="text-2xl font-semibold text-white md:text-3xl"
                    >
                        Bulk UUID{version}
                    </h2>
                    <p className="max-w-xl text-sm text-white/70">
                        Need lots of IDs? Generate up to 500 at once instantly.
                        Copy them as a newline-delimited list for seeding
                        databases or test fixtures.
                    </p>
                </div>
                <form
                    className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onGenerate();
                    }}
                >
                    <label className="flex items-center gap-3">
                        <span className="font-medium text-white/75">Count</span>
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
                                'w-24 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base font-semibold text-white shadow-inner shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                                bulkHasError
                                    ? 'focus-visible:ring-red-400 ring-2 ring-red-400'
                                    : 'focus-visible:ring-emerald-200',
                            )}
                            readOnly={isReadOnly}
                        />
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/40 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                            onClick={onGenerate}
                        >
                            Generate
                        </button>
                        <CopyButton
                            text={copyText}
                            defaultLabel="Copy All"
                            disabled={!bulkUuids.length}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 min-w-[100px]"
                            onCopySuccess={onCopySuccess}
                            onCopyError={onCopyError}
                            aria-label="Copy all UUIDs"
                        />
                    </div>
                </form>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/35">
                    <span>UUIDs</span>
                    <span>{bulkUuids.length}</span>
                </div>
                <div
                    className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1"
                    aria-live="polite"
                >
                    {bulkUuids.map((uuid, index) => (
                        <div
                            key={uuid}
                            className="flex gap-3 text-sm font-mono text-white/80"
                        >
                            <span className="text-white/50 tabular-nums select-none shrink-0">
                                {index + 1}.
                            </span>
                            <span className="break-all min-w-0">{uuid}</span>
                        </div>
                    ))}
                </div>
                {bulkUuids.length === 0 && (
                    <p className="mt-3 text-xs text-white/50">
                        No UUIDs yet. Choose a count (1–500) and press Generate.
                    </p>
                )}
            </div>
            <output className="sr-only" aria-live="polite">
                {bulkStatus}
            </output>
            {bulkStatus && (
                <p className="mt-4 text-xs text-sky-200" aria-hidden="true">
                    {bulkStatus}
                </p>
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
            scheduleBulkStatus(
                `Generated ${count} UUID${count === 1 ? '' : 's'}.`,
            );
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
