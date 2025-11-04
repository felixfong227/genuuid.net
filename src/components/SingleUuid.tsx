import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { generateUuidV4 } from '../lib/uuid';
import { copyToClipboard } from './utils';

const PLACEHOLDER_UUID = '------------------------------------';
const SINGLE_STATUS_TIMEOUT = 2500;

export default function SingleUuid() {
  const [singleUuid, setSingleUuid] = useState<string>(PLACEHOLDER_UUID);
  const [singleStatus, setSingleStatus] = useState('');
  const singleStatusTimer = useRef<number | null>(null);

  const [singleCopyLabel, setSingleCopyLabel] = useState('Copy');
  const singleCopyTimer = useRef<number | null>(null);

  useEffect(() => {
    handleRegenerate();

    return () => {
      if (singleStatusTimer.current) window.clearTimeout(singleStatusTimer.current);
      if (singleCopyTimer.current) window.clearTimeout(singleCopyTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasGeneratedSingle = useMemo(() => singleUuid !== PLACEHOLDER_UUID, [singleUuid]);

  const scheduleSingleStatus = (message: string, timeout = SINGLE_STATUS_TIMEOUT) => {
    setSingleStatus(message);
    if (singleStatusTimer.current) window.clearTimeout(singleStatusTimer.current);
    singleStatusTimer.current = window.setTimeout(() => setSingleStatus(''), timeout);
  };

  const flashSingleCopyLabel = (label = 'Copied!') => {
    setSingleCopyLabel(label);
    if (singleCopyTimer.current) window.clearTimeout(singleCopyTimer.current);
    singleCopyTimer.current = window.setTimeout(() => setSingleCopyLabel('Copy'), 1800);
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
  );
}

