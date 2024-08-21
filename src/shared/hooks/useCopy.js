import { useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

const useCopy = (textToCopy, successDuration = 1000) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied && successDuration) {
            const timer = setTimeout(() => setIsCopied(false), successDuration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isCopied, successDuration]);

    return [
        isCopied,
        () => {
            copyToClipboard(textToCopy);
            setIsCopied(true);
        },
    ];
};

export default useCopy;
