import { type UuidRoute, useUuidVersion } from './UuidVersionContext';

type FaqItem = { question: string; answer: string };

const faqByRoute: Record<UuidRoute, FaqItem[]> = {
    home: [
        {
            question: 'Does this UUID generator run locally in my browser?',
            answer: 'Yes. UUIDs are generated in your browser (no server roundtrips required to create the IDs).',
        },
        {
            question: 'Which UUID version should I use (v1, v4, v7)?',
            answer: 'Use v4 for random identifiers in most apps. Use v7 when you want sortable IDs (time-ordered) while keeping good randomness. Use v1 when you specifically need the legacy timestamp-based format (it can leak time and node information).',
        },
        {
            question: 'How many UUIDs can I generate at once?',
            answer: 'You can generate single UUIDs or bulk-generate up to 500 UUIDs at a time and copy them in one click.',
        },
    ],
    v4: [
        {
            question: 'What is UUID v4?',
            answer: 'UUID v4 is a randomly generated UUID defined by RFC 4122. It’s the most common choice when you just need a unique identifier.',
        },
        {
            question: 'Should I use UUID v4 or UUID v7?',
            answer: 'Use v4 when you want purely random IDs. Use v7 when you also want IDs that sort by time (helpful for databases, logs, and pagination).',
        },
        {
            question: 'Can I bulk-generate UUID v4 values here?',
            answer: 'Yes — generate a single UUID or bulk-generate up to 500 at once and copy them in one click.',
        },
    ],
    v1: [
        {
            question: 'What is UUID v1?',
            answer: 'UUID v1 is a timestamp-based UUID format. It combines time with a node identifier to produce unique values.',
        },
        {
            question: 'Is UUID v1 safe to expose publicly?',
            answer: 'It depends. UUID v1 is useful when you want roughly time-ordered IDs and legacy compatibility, and it can be fine for internal identifiers or cases where leaking creation time isn’t a concern. The downside is that v1 encodes a timestamp (and can include a node identifier), which may reveal metadata and ordering. For public-facing IDs, v4 or v7 is usually a better default.',
        },
        {
            question: 'Can I bulk-generate UUID v1 values here?',
            answer: 'Yes — generate a single UUID or bulk-generate up to 500 at once and copy them in one click.',
        },
    ],
    v7: [
        {
            question: 'What is UUID v7?',
            answer: 'UUID v7 is a time-ordered UUID format. It keeps good randomness while also sorting by time, which can improve database index locality and log ordering.',
        },
        {
            question: 'Why use UUID v7 instead of UUID v4?',
            answer: 'Use v7 when you want UUIDs that sort chronologically (useful for databases, feeds, and pagination). Use v4 when you only need random unique IDs.',
        },
        {
            question: 'Can I bulk-generate UUID v7 values here?',
            answer: 'Yes — generate a single UUID or bulk-generate up to 500 at once and copy them in one click.',
        },
    ],
};

function routeTitle(route: UuidRoute): string {
    switch (route) {
        case 'home':
            return 'UUID Generator (v1, v4, v7)';
        case 'v4':
            return 'UUID v4 Generator (Random)';
        case 'v1':
            return 'UUID v1 Generator (Timestamp)';
        case 'v7':
            return 'UUID v7 Generator (Time-Ordered)';
    }
}

function routeIntro(route: UuidRoute): string {
    switch (route) {
        case 'home':
            return 'Generate RFC 4122 compliant UUIDs instantly in your browser — fast, private, and ready to copy. Create a single ID or bulk-generate up to 500 at once.';
        case 'v4':
            return 'UUID v4 is the most common UUID format: a randomly-generated identifier defined by RFC 4122. Use it when you just need a unique ID and don’t need the IDs to be time-sortable.';
        case 'v1':
            return 'UUID v1 is timestamp-based. It’s useful for legacy systems and time-ish ordering, but it can reveal information (like creation time) that you may not want to expose publicly. For many modern apps, prefer v4 or v7.';
        case 'v7':
            return 'UUID v7 is a modern UUID format designed for time-ordered IDs. It’s a great choice when you want mostly-random identifiers that also sort well in databases and logs.';
    }
}

export function SeoHeader() {
    const { route } = useUuidVersion();

    return (
        <header className="animate-float-up space-y-4">
            <div className="space-y-3">
                {route !== 'home' && (
                    <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                        genuuid.net
                    </p>
                )}
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                    {routeTitle(route)}
                </h1>
                <p className="text-white/70 leading-relaxed max-w-prose">
                    {routeIntro(route)}
                </p>
            </div>
        </header>
    );
}

export function SeoFaq() {
    const { route } = useUuidVersion();
    const items = faqByRoute[route];

    return (
        <section className="animate-float-up-delay-3 mt-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                    FAQ
                </h2>
                <div className="mt-4 space-y-3">
                    {items.map((item) => (
                        <details
                            key={item.question}
                            className="group rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <summary className="cursor-pointer list-none font-mono text-sm text-white/80">
                                {item.question}
                            </summary>
                            <p className="mt-2 text-sm text-white/60 leading-relaxed">
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
