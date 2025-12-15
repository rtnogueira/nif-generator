import copyToClipboard from 'copy-to-clipboard'
import { useEffect, useState } from 'react'

const useCopy = (textToCopy: string, successDuration = 1000): [boolean, () => void] => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    if (isCopied && successDuration) {
      const timer = setTimeout(() => setIsCopied(false), successDuration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCopied, successDuration])

  return [
    isCopied,
    () => {
      copyToClipboard(textToCopy)
      setIsCopied(true)
    },
  ]
}

export default useCopy
