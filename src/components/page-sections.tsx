import type { ReactNode } from 'react'

/** Building blocks of the explanations below a tool. */
export function About({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex max-w-3xl flex-col gap-10 text-muted-foreground">
      {children}
    </section>
  )
}

export function Block({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function Faq({ items }: { items: { question: string; answer: ReactNode }[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Frequently asked questions
      </h2>
      {items.map(item => (
        <div key={item.question} className="flex flex-col gap-1.5">
          <h3 className="font-medium text-foreground">{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-foreground underline underline-offset-4"
    >
      {children}
    </a>
  )
}
