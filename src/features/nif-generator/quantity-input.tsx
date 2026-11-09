import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuantityInputProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'min' | 'max' | 'type'
> {
  value: number
  min: number
  max: number
  onValueChange: (value: number) => void
}

/**
 * Number field with −/+ steppers. While typing, the raw text is kept as a draft (so the field can
 * be cleared) and every parsable value is reported clamped; on blur the field shows that value.
 */
export function QuantityInput({ value, min, max, onValueChange, ...props }: QuantityInputProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const clamp = (next: number) => Math.min(max, Math.max(min, Math.trunc(next)))
  const commit = (next: number) => {
    setDraft(null)
    onValueChange(clamp(next))
  }
  const handleType = (text: string) => {
    setDraft(text)
    const parsed = Number.parseInt(text, 10)
    if (Number.isFinite(parsed)) onValueChange(clamp(parsed))
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => commit(value - 1)}
      >
        <MinusIcon />
      </Button>
      <Input
        {...props}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? value}
        onChange={event => handleType(event.target.value)}
        onBlur={() => setDraft(null)}
        className="h-10 text-center tabular-nums"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => commit(value + 1)}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
