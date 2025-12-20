import { createContext, type ReactNode, useContext, useState } from 'react';
import type { UuidVersion } from '../lib/uuid';

interface UuidVersionContextType {
    version: UuidVersion;
    setVersion: (version: UuidVersion) => void;
}

const UuidVersionContext = createContext<UuidVersionContextType | undefined>(
    undefined,
);

export function UuidVersionProvider({
    children,
    initialVersion = 'v4',
}: {
    children: ReactNode;
    initialVersion?: UuidVersion;
}) {
    const [version, setVersion] = useState<UuidVersion>(initialVersion);

    return (
        <UuidVersionContext.Provider value={{ version, setVersion }}>
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
