import { useUuidVersion } from './UuidVersionContext';

export default function VersionNavigation() {
    const { version, setVersion } = useUuidVersion();

    return (
        <nav
            aria-label="UUID versions"
            className="flex flex-wrap items-center gap-3"
        >
            <button
                type="button"
                onClick={() => setVersion('v4')}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    version === 'v4'
                        ? 'bg-white text-slate-950 shadow-lg shadow-white/30 hover:bg-white/90 focus-visible:ring-white/80'
                        : 'border border-white/15 text-white/35 hover:border-white/25 hover:text-white/50'
                }`}
                aria-current={version === 'v4' ? 'page' : undefined}
            >
                Version 4
            </button>
            <button
                type="button"
                onClick={() => setVersion('v1')}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    version === 'v1'
                        ? 'bg-white text-slate-950 shadow-lg shadow-white/30 hover:bg-white/90 focus-visible:ring-white/80'
                        : 'border border-white/15 text-white/35 hover:border-white/25 hover:text-white/50'
                }`}
                aria-current={version === 'v1' ? 'page' : undefined}
            >
                Version 1
            </button>
            <button
                type="button"
                onClick={() => setVersion('v7')}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    version === 'v7'
                        ? 'bg-white text-slate-950 shadow-lg shadow-white/30 hover:bg-white/90 focus-visible:ring-white/80'
                        : 'border border-white/15 text-white/35 hover:border-white/25 hover:text-white/50'
                }`}
                aria-current={version === 'v7' ? 'page' : undefined}
            >
                Version 7
            </button>
        </nav>
    );
}
