import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export type UuidVersion = 'v1' | 'v4';

export function generateUuidV1(): string {
    return uuidv1();
}

export function generateUuidV4(): string {
    return uuidv4();
}

export function generateUuid(version: UuidVersion): string {
    return version === 'v1' ? generateUuidV1() : generateUuidV4();
}

export function generateMany(count: number, version: UuidVersion = 'v4'): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 500) {
        throw new Error('count must be an integer between 1 and 500');
    }

    return Array.from({ length: count }, () => generateUuid(version));
}
