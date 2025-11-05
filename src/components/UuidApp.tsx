import { UuidVersionProvider } from './UuidVersionContext';
import SingleUuid from './SingleUuid';
import BulkUuid from './BulkUuid';
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
