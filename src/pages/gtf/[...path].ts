export const prerender = false;

import type { APIRoute } from 'astro';

const POSTHOG_REGION = 'eu';
const POSTHOG_API_HOST = `${POSTHOG_REGION}.i.posthog.com`;

export const ALL: APIRoute = async ({ request, params, clientAddress }) => {
    const requestPath = params.path ? `/${params.path}` : '';
    const upstreamHost = POSTHOG_API_HOST;
    const upstreamPath = requestPath;
    const upstreamUrl = `https://${upstreamHost}${upstreamPath}${new URL(request.url).search}`;
    const headers = new Headers(request.headers);

    headers.set('host', upstreamHost);
    headers.set(
        'X-Forwarded-For',
        request.headers.get('X-Forwarded-For') || clientAddress || '',
    );

    try {
        const res = await fetch(upstreamUrl, {
            method: request.method,
            headers: headers,
            body:
                request.method !== 'GET' && request.method !== 'HEAD'
                    ? request.body
                    : undefined,
        });
        const proxiedHeaders = new Headers(res.headers);
        for (const key of ['server', 'x-powered-by', 'content-encoding']) {
            proxiedHeaders.delete(key);
        }
        proxiedHeaders.set('X-Robots-Tag', 'noindex, nofollow');
        const proxiedRes = new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: proxiedHeaders,
        });
        return proxiedRes;
    } catch (error) {
        console.error('Error proxying to PostHog:', error);
        return new Response('Error proxying request', { status: 500 });
    }
};
