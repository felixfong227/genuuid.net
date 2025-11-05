export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (error) {
        console.warn(
            'Clipboard API failed, falling back to execCommand.',
            error,
        );
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const selectedRange =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.select();

    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (error) {
        console.error('Fallback copy failed:', error);
    }

    document.body.removeChild(textarea);

    if (selectedRange && selection) {
        selection.removeAllRanges();
        selection.addRange(selectedRange);
    }

    return success;
}

export function classNames(
    ...values: Array<string | false | null | undefined>
): string {
    return values.filter(Boolean).join(' ');
}
