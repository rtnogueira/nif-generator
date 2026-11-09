import { RefreshCwIcon } from 'lucide-react'
import { useId, useState, type SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DEFAULT_NIF_PREFIX,
  isNifPrefix,
  MAX_QUANTITY,
  MIN_QUANTITY,
  NIF_TYPES,
  type NifPrefix,
} from '@/lib/nif'
import { QuantityInput } from './quantity-input'

export interface NifOptions {
  prefix: NifPrefix
  quantity: number
}

interface NifOptionsFormProps {
  onGenerate: (options: NifOptions) => void
}

export function NifOptionsForm({ onGenerate }: NifOptionsFormProps) {
  const id = useId()
  const [prefix, setPrefix] = useState<NifPrefix>(DEFAULT_NIF_PREFIX)
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onGenerate({ prefix, quantity })
  }

  return (
    <Card className="w-full gap-0 lg:max-w-sm">
      <CardHeader>
        <CardTitle>Options</CardTitle>
        <CardDescription>Choose a NIF prefix and how many to generate.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-type`}>Type</Label>
            <Select value={prefix} onValueChange={value => isNifPrefix(value) && setPrefix(value)}>
              <SelectTrigger id={`${id}-type`} className="w-full data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-80">
                {NIF_TYPES.map(type => (
                  <SelectItem key={type.prefix} value={type.prefix}>
                    <span className="w-7 rounded bg-muted px-1.5 text-center font-mono text-xs">
                      {type.prefix}
                    </span>
                    <span className="truncate">{type.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              NIFs will start with <span className="font-mono text-foreground">{prefix}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-quantity`}>Quantity</Label>
            <QuantityInput
              id={`${id}-quantity`}
              value={quantity}
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              onValueChange={setQuantity}
            />
            <p className="text-xs text-muted-foreground">
              Between {MIN_QUANTITY} and {MAX_QUANTITY}.
            </p>
          </div>

          <Button type="submit" size="lg" className="h-11">
            <RefreshCwIcon />
            Generate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
