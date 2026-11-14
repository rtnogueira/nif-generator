import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RelatedTools } from '@/components/related-tools'
import { usePageMeta } from '@/hooks/use-page-meta'
import { buildDataset, type ColumnGroupId, type Dataset } from '@/lib/dataset'
import { categoryLabel, type PagePath } from '@/lib/pages'
import { TestDataForm } from './test-data-form'
import {
  defaultOptions,
  optionsFromSearch,
  searchFromOptions,
  validateTestDataSearch,
  type TestDataOptions,
} from './test-data-options'
import { TestDataResults } from './test-data-results'

export interface TestDataGeneratorProps {
  path: PagePath
  heading: string
  intro: ReactNode
  /** The groups of columns the page offers, e.g. only the person's on the person generator. */
  groups: readonly ColumnGroupId[]
  /** Start of export file names, e.g. "people". */
  slug: string
  /** Explanations shown below the generator. */
  about: ReactNode
}

/** A page that generates a table with one person per row: the person and test data generators. */
export function TestDataGenerator({
  path,
  heading,
  intro,
  groups,
  slug,
  about,
}: TestDataGeneratorProps) {
  usePageMeta(path)
  const search = validateTestDataSearch(useSearch({ strict: false }))
  const navigate = useNavigate()
  // Read once: a link with options fills the form and shows a table straight away.
  const [fromUrl] = useState(() => optionsFromSearch(search, groups))
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [error, setError] = useState<string | null>(null)
  // A page opened with options starts loading them straight away.
  const [busy, setBusy] = useState(fromUrl !== null)
  // Only the latest request may show its result: the data of a country loads asynchronously.
  const latest = useRef(0)

  function load({ country, columns, rows, ...options }: TestDataOptions) {
    const request = ++latest.current
    buildDataset(country, columns, rows, options).then(
      result => {
        if (request !== latest.current) return
        setDataset(result)
        setError(null)
        setBusy(false)
      },
      () => {
        if (request !== latest.current) return
        setDataset(null)
        setError('The names and addresses of this country could not be loaded. Please try again.')
        setBusy(false)
      }
    )
  }

  useEffect(() => {
    if (fromUrl) load(fromUrl)
    // Runs once, for the options the page was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleGenerate(options: TestDataOptions) {
    setBusy(true)
    load(options)
    // Keep the URL in step, so the current options can be bookmarked or shared.
    void navigate({
      to: '.',
      search: searchFromOptions(options),
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{categoryLabel(path)}</p>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        <div className="flex max-w-2xl flex-col gap-2 text-muted-foreground">{intro}</div>
      </div>

      <div className="flex flex-col gap-6">
        <TestDataForm
          groups={groups}
          initialOptions={fromUrl ?? defaultOptions(groups)}
          busy={busy}
          onGenerate={handleGenerate}
        />
        <TestDataResults dataset={dataset} slug={slug} error={error} />
      </div>

      {about}

      <RelatedTools current={path} />
    </div>
  )
}
