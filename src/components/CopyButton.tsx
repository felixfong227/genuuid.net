import { forwardRef, useEffect, useRef, useState } from 'react';

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

const COPIED_RESET_MS = 1800;

async function copyTextToClipboard(text: string) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const ok = document.execCommand('copy');
    textarea.blur();
    document.body.removeChild(textarea);

    if (!ok) {
        throw new Error('Copy failed');
    }
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
        const [isCopied, setIsCopied] = useState(false);
        const resetTimerRef = useRef<number | null>(null);
        const lastTextRef = useRef(text);

        useEffect(() => {
            return () => {
                if (resetTimerRef.current !== null) {
                    window.clearTimeout(resetTimerRef.current);
                }
            };
        }, []);

        useEffect(() => {
            if (lastTextRef.current === text) return;
            lastTextRef.current = text;

            if (resetTimerRef.current !== null) {
                window.clearTimeout(resetTimerRef.current);
                resetTimerRef.current = null;
            }
            setIsCopied(false);
        }, [text]);

        const handleCopy = async () => {
            if (disabled) return;
            if (!text) {
                onCopyError?.('Nothing to copy.');
                return;
            }

            try {
                await copyTextToClipboard(text);
            } catch {
                onCopyError?.('Copy failed.');
                return;
            }

            setIsCopied(true);

            if (resetTimerRef.current !== null) {
                window.clearTimeout(resetTimerRef.current);
            }
            resetTimerRef.current = window.setTimeout(() => {
                resetTimerRef.current = null;
                setIsCopied(false);
            }, COPIED_RESET_MS);

            onCopySuccess?.();
        };

        const label = isCopied ? copiedLabel : defaultLabel;

        return (
            <button
                ref={ref}
                type="button"
                className={className}
                onClick={handleCopy}
                disabled={disabled}
                aria-label={ariaLabel ?? label}
            >
                <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                    focusable="false"
                >
                    {isCopied ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    )}
                </svg>
                {label}
            </button>
        );
    },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
