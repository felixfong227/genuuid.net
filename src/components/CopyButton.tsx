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
        const isCopied = useSignal(false);

        useSignalEffect(() => {
            if (label.value === copiedLabel) {
                isCopied.value = true;
                const timer = window.setTimeout(() => {
                    label.value = defaultLabel;
                    isCopied.value = false;
                }, 1800);

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
                <svg 
                    className="w-3.5 h-3.5 shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                >
                    {isCopied.value ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                </svg>
                {label}
            </button>
        );
    },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
