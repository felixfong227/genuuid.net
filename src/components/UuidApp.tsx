import type { UuidVersion } from '../lib/uuid';
import BulkUuid from './BulkUuid';
import SingleUuid from './SingleUuid';
import { UuidVersionProvider } from './UuidVersionContext';
import VersionNavigation from './VersionNavigation';

export default function UuidApp({
    initialVersion,
}: {
    initialVersion?: UuidVersion;
}) {
    return (
        <UuidVersionProvider initialVersion={initialVersion}>
            <VersionNavigation />
            <SingleUuid />
            <BulkUuid />
        </UuidVersionProvider>
    );
}
