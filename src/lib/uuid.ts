import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from 'uuid';

export type UuidVersion = 'v1' | 'v4' | 'v7';

export function generateUuidV1(): string {
    return uuidv1();
}

export function generateUuidV4(): string {
    return uuidv4();
}

export function generateUuidV7(): string {
    return uuidv7();
}

export function generateUuid(version: UuidVersion): string {
    switch (version) {
        case 'v1':
            return generateUuidV1();
        case 'v4':
            return generateUuidV4();
        case 'v7':
            return generateUuidV7();
        default:
            console.warn(`Unknown UUID version: ${version}`);
            return generateUuidV4();
    }
}

export function generateMany(count: number, version: UuidVersion = 'v4'): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 500) {
        throw new Error('count must be an integer between 1 and 500');
    }

    return Array.from({ length: count }, () => generateUuid(version));
}
