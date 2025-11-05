import { useSignal, useSignalEffect } from '@preact/signals-react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { forwardRef } from 'react';

interface CopyButtonProps {
    text: string;
    defaultLabel?: string;
    copiedLabel?: string;
    onCopySuccess?: () => void;
    onCopyError?: (message: string) => void;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
    (
        {
            text,
            defaultLabel = 'Copy',
            copiedLabel = 'Copied!',
            onCopySuccess,
            onCopyError,
            disabled = false,
            className = '',
            'aria-label': ariaLabel,
        },
        ref,
    ) => {
        const label = useSignal(defaultLabel);

        // Automatically reset label to default after it changes to copied label
        useSignalEffect(() => {
            if (label.value === copiedLabel) {
                const timer = window.setTimeout(() => {
                    label.value = defaultLabel;
                }, 1800);

                // Cleanup function runs before next update or on unmount
                return () => window.clearTimeout(timer);
            }
        });

        const [_, copyToClipboard] = useCopyToClipboard();

        const handleCopy = async () => {
            if (!text || disabled) {
                onCopyError?.('Nothing to copy.');
                return;
            }
            await copyToClipboard(text);
            label.value = copiedLabel;
            onCopySuccess?.();
        };

        return (
            <button
                ref={ref}
                type="button"
                className={className}
                onClick={handleCopy}
                disabled={disabled}
                aria-label={ariaLabel || `Copy ${text}`}
            >
                {label}
            </button>
        );
    },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
