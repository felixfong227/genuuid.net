import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { UuidVersion } from '../lib/uuid';

export type UuidRoute = 'home' | UuidVersion;

interface UuidVersionContextType {
    route: UuidRoute;
    version: UuidVersion;
    navigateToRoute: (route: UuidRoute) => void;
    navigateToVersion: (version: UuidVersion) => void;
}

const UuidVersionContext = createContext<UuidVersionContextType | undefined>(
    undefined,
);

function getRouteFromPathname(pathname: string): UuidRoute {
    if (pathname.startsWith('/v1')) return 'v1';
    if (pathname.startsWith('/v4')) return 'v4';
    if (pathname.startsWith('/v7')) return 'v7';
    return 'home';
}

function getPathnameFromRoute(route: UuidRoute): string {
    switch (route) {
        case 'v1':
            return '/v1/';
        case 'v4':
            return '/v4/';
        case 'v7':
            return '/v7/';
        case 'home':
            return '/';
    }
}

function getVersionFromRoute(route: UuidRoute): UuidVersion {
    return route === 'home' ? 'v4' : route;
}

export function UuidVersionProvider({
    children,
    initialPathname = '/',
}: {
    children: ReactNode;
    initialPathname?: string;
}) {
    const [route, setRoute] = useState<UuidRoute>(() =>
        getRouteFromPathname(initialPathname),
    );
    const version = getVersionFromRoute(route);

    const navigateToRoute = useCallback((nextRoute: UuidRoute) => {
        const nextPath = getPathnameFromRoute(nextRoute);
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', nextPath);
        }
        setRoute(nextRoute);
    }, []);

    const navigateToVersion = useCallback(
        (nextVersion: UuidVersion) => navigateToRoute(nextVersion),
        [navigateToRoute],
    );

    useEffect(() => {
        const handlePopState = () => {
            setRoute(getRouteFromPathname(window.location.pathname));
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <UuidVersionContext.Provider
            value={{ route, version, navigateToRoute, navigateToVersion }}
        >
            {children}
        </UuidVersionContext.Provider>
    );
}

export function useUuidVersion() {
    const context = useContext(UuidVersionContext);
    if (context === undefined) {
        throw new Error(
            'useUuidVersion must be used within a UuidVersionProvider',
        );
    }
    return context;
}
