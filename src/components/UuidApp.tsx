import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { generateMany, generateUuidV4 } from '../lib/uuid';

const PLACEHOLDER_UUID = '------------------------------------';
const SINGLE_STATUS_TIMEOUT = 2500;
const BULK_STATUS_TIMEOUT = 3000;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API failed, falling back to execCommand.', error);
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  textarea.select();

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (error) {
    console.error('Fallback copy failed:', error);
  }

  document.body.removeChild(textarea);

  if (selectedRange && selection) {
    selection.removeAllRanges();
    selection.addRange(selectedRange);
  }

  return success;
}

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export default function UuidApp() {
  const [singleUuid, setSingleUuid] = useState<string>(PLACEHOLDER_UUID);
  const [singleStatus, setSingleStatus] = useState('');
  const singleStatusTimer = useRef<number | null>(null);

  const [singleCopyLabel, setSingleCopyLabel] = useState('Copy');
  const singleCopyTimer = useRef<number | null>(null);

  const [bulkCountInput, setBulkCountInput] = useState('10');
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const bulkStatusTimer = useRef<number | null>(null);

  const [bulkCopyLabel, setBulkCopyLabel] = useState('Copy All');
  const bulkCopyTimer = useRef<number | null>(null);

  const [bulkHasError, setBulkHasError] = useState(false);

  useEffect(() => {
    handleRegenerate();

    return () => {
      if (singleStatusTimer.current) window.clearTimeout(singleStatusTimer.current);
      if (singleCopyTimer.current) window.clearTimeout(singleCopyTimer.current);
      if (bulkStatusTimer.current) window.clearTimeout(bulkStatusTimer.current);
      if (bulkCopyTimer.current) window.clearTimeout(bulkCopyTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasGeneratedSingle = useMemo(() => singleUuid !== PLACEHOLDER_UUID, [singleUuid]);

  const scheduleSingleStatus = (message: string, timeout = SINGLE_STATUS_TIMEOUT) => {
    setSingleStatus(message);
    if (singleStatusTimer.current) window.clearTimeout(singleStatusTimer.current);
    singleStatusTimer.current = window.setTimeout(() => setSingleStatus(''), timeout);
  };

  const scheduleBulkStatus = (message: string, timeout = BULK_STATUS_TIMEOUT) => {
    setBulkStatus(message);
    if (bulkStatusTimer.current) window.clearTimeout(bulkStatusTimer.current);
    bulkStatusTimer.current = window.setTimeout(() => setBulkStatus(''), timeout);
  };

  const flashSingleCopyLabel = (label = 'Copied!') => {
    setSingleCopyLabel(label);
    if (singleCopyTimer.current) window.clearTimeout(singleCopyTimer.current);
    singleCopyTimer.current = window.setTimeout(() => setSingleCopyLabel('Copy'), 1800);
  };

  const flashBulkCopyLabel = (label = 'Copied!') => {
    setBulkCopyLabel(label);
    if (bulkCopyTimer.current) window.clearTimeout(bulkCopyTimer.current);
    bulkCopyTimer.current = window.setTimeout(() => setBulkCopyLabel('Copy All'), 1800);
  };

  const handleRegenerate = () => {
    const uuid = generateUuidV4();
    setSingleUuid(uuid);
  };

  const handleCopySingle = async () => {
    if (!hasGeneratedSingle) {
      scheduleSingleStatus('Generate a UUID first.');
      return;
    }

    const success = await copyToClipboard(singleUuid);
    if (success) {
      flashSingleCopyLabel();
    } else {
      scheduleSingleStatus('Copy failed. Select and copy manually.');
    }
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
      const uuids = generateMany(count);
      setBulkUuids(uuids);
      setBulkHasError(false);
      scheduleBulkStatus(`Generated ${count} UUID${count === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error(error);
      setBulkHasError(true);
      scheduleBulkStatus('Something went wrong while generating UUIDs.');
    }
  };

  const handleBulkCopy = async () => {
    if (!bulkUuids.length) {
      scheduleBulkStatus('Generate UUIDs before copying.');
      return;
    }

    const success = await copyToClipboard(bulkUuids.join('\n'));
    if (success) {
      scheduleBulkStatus('Copied UUID list.');
      flashBulkCopyLabel();
    } else {
      scheduleBulkStatus('Copy failed. Select and copy manually.');
    }
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
    [handleRegenerate]
  );

  useHotkeys(
    'c',
    (event) => {
      event.preventDefault();
      handleCopySingle();
    },
    {
      enableOnFormTags: false,
    },
    [handleCopySingle, hasGeneratedSingle]
  );

  return (
    <>
      <section
        aria-labelledby="single-heading"
        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_1.875rem_5rem_-1.25rem_rgba(16,185,129,0.35)] backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 id="single-heading" className="text-2xl font-semibold text-white md:text-3xl">
              Single UUIDv4
            </h2>
            <p className="max-w-xl text-sm text-white/70">
              RFC 4122 compliant identifiers generated entirely in this tab. No tracking, no storage, nothing leaves your browser.
            </p>
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
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/60 px-5 py-4">
            <span className="text-xs uppercase tracking-[0.35em] text-white/35">Current UUID</span>
            <p className="mt-3 break-all font-mono text-lg text-emerald-200 md:text-xl">
              {singleUuid}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 w-24"
              onClick={handleCopySingle}
            >
              {singleCopyLabel}
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/55">
          Shortcuts: press{' '}
          <span className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">g</span>{' '}
          to regenerate,{' '}
          <span className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">c</span>{' '}
          to copy.
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {singleStatus}
        </p>
        {singleStatus && (
          <p className="mt-4 text-xs text-emerald-200" aria-hidden="true">
            {singleStatus}
          </p>
        )}
      </section>

      <section
        aria-labelledby="bulk-heading"
        className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-[0_1.875rem_5rem_-1.5rem_rgba(96,165,250,0.28)] backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 id="bulk-heading" className="text-2xl font-semibold text-white md:text-3xl">
              Bulk UUIDv4
            </h2>
            <p className="max-w-xl text-sm text-white/70">
              Need lots of IDs? Generate up to 500 at once instantly. Copy them as a newline-delimited list for seeding databases or test fixtures.
            </p>
          </div>
          <form
            className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              handleBulkGenerate();
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
                onChange={(event) => {
                  setBulkCountInput(event.target.value);
                  setBulkHasError(false);
                }}
                className={classNames(
                  'w-24 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base font-semibold text-white shadow-inner shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                  bulkHasError ? 'focus-visible:ring-red-400 ring-2 ring-red-400' : 'focus-visible:ring-emerald-200'
                )}
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/40 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onClick={handleBulkGenerate}
              >
                Generate
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                disabled={!bulkUuids.length}
                onClick={handleBulkCopy}
              >
                {bulkCopyLabel}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/35">
            <span>UUIDs</span>
            <span>{bulkUuids.length}</span>
          </div>
          <ol
            className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1 pl-6 text-sm font-mono text-white/80 list-decimal"
            aria-live="polite"
            aria-label="Generated UUIDs"
          >
            {bulkUuids.map((uuid) => (
              <li key={uuid}>{uuid}</li>
            ))}
          </ol>
          {bulkUuids.length === 0 && (
            <p className="mt-3 text-xs text-white/50">
              No UUIDs yet. Choose a count (1–500) and press Generate.
            </p>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {bulkStatus}
        </p>
        {bulkStatus && (
          <p className="mt-4 text-xs text-sky-200" aria-hidden="true">
            {bulkStatus}
          </p>
        )}
      </section>
    </>
  );
}

