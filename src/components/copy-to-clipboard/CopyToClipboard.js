import FileCopy from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle';
import useCopy from '../../shared/hooks/useCopy';
import React from 'react';

const CopyToClipboard = ({ value }) => {
    const [isCopied, copyValue] = useCopy(value);

    return (
        <IconButton edge="end" aria-label="copy" onClick={() => copyValue(value)}>
            {isCopied ? <CheckCircle /> : <FileCopy /> }
        </IconButton>
    );
};

export default CopyToClipboard;
