import BulkUuid from './BulkUuid';
import { SeoFaq, SeoHeader } from './SeoPanels';
import SingleUuid from './SingleUuid';
import { UuidVersionProvider } from './UuidVersionContext';
import VersionNavigation from './VersionNavigation';

export default function UuidApp({
    initialPathname,
}: {
    initialPathname?: string;
}) {
    return (
        <UuidVersionProvider initialPathname={initialPathname}>
            <SeoHeader />
            <VersionNavigation />
            <SingleUuid />
            <BulkUuid />
            <SeoFaq />
        </UuidVersionProvider>
    );
}
