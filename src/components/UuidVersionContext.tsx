import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UuidVersion } from '../lib/uuid';

interface UuidVersionContextType {
    version: UuidVersion;
    setVersion: (version: UuidVersion) => void;
}

const UuidVersionContext = createContext<UuidVersionContextType | undefined>(
    undefined,
);

export function UuidVersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState<UuidVersion>('v4');

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

