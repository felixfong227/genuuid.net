import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from 'uuid';

export type UuidVersion = 'v1' | 'v4' | 'v7';

export function generateUuid(version: UuidVersion): string {
    switch (version) {
        case 'v1':
            return uuidv1();
        case 'v4':
            return uuidv4();
        case 'v7':
            return uuidv7();
        default:
            console.warn(`Unknown UUID version: ${version}`);
            return uuidv4();
    }
}

export function generateMany(
    count: number,
    version: UuidVersion = 'v4',
): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 500) {
        throw new Error('count must be an integer between 1 and 500');
    }

    return Array.from({ length: count }, () => generateUuid(version));
}
