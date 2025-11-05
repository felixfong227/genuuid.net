import { v4 as uuidv4 } from 'uuid';

export function generateUuidV4(): string {
    return uuidv4();
}

export function generateMany(count: number): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 500) {
        throw new Error('count must be an integer between 1 and 500');
    }

    return Array.from({ length: count }, () => uuidv4());
}
