import BulkUuid from './BulkUuid';
import SingleUuid from './SingleUuid';
import { UuidVersionProvider } from './UuidVersionContext';
import VersionNavigation from './VersionNavigation';

export default function UuidApp() {
    return (
        <UuidVersionProvider>
            <VersionNavigation />
            <SingleUuid />
            <BulkUuid />
        </UuidVersionProvider>
    );
}
