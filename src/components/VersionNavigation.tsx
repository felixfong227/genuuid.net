import { clsx } from 'clsx';

import { useUuidVersion } from './UuidVersionContext';

const versions = [
    { id: 'v4', label: 'v4', desc: 'Random', href: '/v4/' },
    { id: 'v1', label: 'v1', desc: 'Timestamp', href: '/v1/' },
    { id: 'v7', label: 'v7', desc: 'Unix Time', href: '/v7/' },
] as const;

export default function VersionNavigation() {
    const { version, navigateToVersion } = useUuidVersion();

    return (
        <nav aria-label="UUID versions" className="animate-float-up">
            <div className="inline-flex items-stretch rounded-xl border border-white/10 bg-white/5 p-1">
                {versions.map((v) => {
                    const isActive = version === v.id;
                    return (
                        <a
                            key={v.id}
                            href={v.href}
                            onClick={(event) => {
                                if (
                                    event.defaultPrevented ||
                                    event.button !== 0 ||
                                    event.metaKey ||
                                    event.altKey ||
                                    event.ctrlKey ||
                                    event.shiftKey
                                ) {
                                    return;
                                }
                                event.preventDefault();
                                navigateToVersion(v.id);
                            }}
                            className={clsx(
                                'relative flex flex-col items-center justify-center px-5 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 cursor-pointer',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                                isActive
                                    ? 'bg-white text-slate-950 shadow-lg shadow-white/20'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5',
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="font-semibold tracking-tight">
                                {v.label}
                            </span>
                            <span
                                className={clsx(
                                    'text-[10px] uppercase tracking-widest mt-0.5',
                                    isActive
                                        ? 'text-slate-600'
                                        : 'text-white/30',
                                )}
                            >
                                {v.desc}
                            </span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
