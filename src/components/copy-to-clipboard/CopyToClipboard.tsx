import React from 'react'
import CheckCircle from '@mui/icons-material/CheckCircle'
import FileCopy from '@mui/icons-material/FileCopy'
import IconButton from '@mui/material/IconButton'
import useCopy from '../../shared/hooks/useCopy'

interface CopyToClipboardProps {
  value: string
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value }) => {
  const [isCopied, copyValue] = useCopy(value)

  return (
    <IconButton edge="end" aria-label="copy" onClick={() => copyValue()}>
      {isCopied ? <CheckCircle /> : <FileCopy />}
    </IconButton>
  )
}

export default CopyToClipboard
