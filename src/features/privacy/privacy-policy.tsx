import type { ReactNode } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { GITHUB_REPO_URL, SITE_NAME } from '@/lib/site'

const LAST_UPDATED = '9 November 2026'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
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

export function PrivacyPolicy() {
  useDocumentTitle(`Privacy Policy | ${SITE_NAME}`)

  return (
    <article className="flex max-w-3xl flex-col gap-8 text-muted-foreground">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-sm">Last updated: {LAST_UPDATED}</p>
      </header>

      <p>
        This policy explains what information is processed when you use {SITE_NAME} (
        <span className="font-mono text-foreground">rtnogueira.com</span>), who processes it and
        what choices you have. The site is run by Tiago Nogueira, an individual developer based in
        Portugal, who is the data controller for the purposes of the EU General Data Protection
        Regulation (GDPR).
      </p>

      <Section title="Data you enter in the tools">
        <p>
          The tools on this site run entirely in your browser. Tax numbers you generate, validate,
          copy or export to Excel are never sent to or stored on any server. There are no user
          accounts and no forms that collect personal data.
        </p>
      </Section>

      <Section title="Information stored on your device">
        <p>
          The site stores your light/dark theme preference in your browser&apos;s local storage so
          it is remembered on your next visit. This value never leaves your device and you can clear
          it at any time from your browser settings.
        </p>
      </Section>

      <Section title="Advertising (Google AdSense)">
        <p>
          This site uses Google AdSense to show ads, which helps keep it free. Google and its
          partners use cookies and similar technologies to serve ads based on your previous visits
          to this and other websites, to limit how often you see an ad and to measure ad
          performance. Google&apos;s use of advertising cookies enables it and its partners to serve
          ads to you based on your visits to this site and/or other sites on the Internet.
        </p>
        <p>
          If you are in the European Economic Area, the United Kingdom or Switzerland, you will be
          asked for consent before personalised ads are shown, and you can change your choice at any
          time through the consent message. Without consent, Google may still show non-personalised
          ads, which use cookies only for purposes such as frequency capping and fraud prevention.
        </p>
        <p>
          You can opt out of personalised advertising in{' '}
          <ExternalLink href="https://adssettings.google.com">Google Ads Settings</ExternalLink>, or
          opt out of third-party vendors&apos; use of cookies at{' '}
          <ExternalLink href="https://www.aboutads.info/choices/">aboutads.info</ExternalLink>.
          Learn more in{' '}
          <ExternalLink href="https://policies.google.com/technologies/partner-sites">
            How Google uses information from sites that use its services
          </ExternalLink>
          .
        </p>
      </Section>

      <Section title="Analytics">
        <p>
          The site may use Google Analytics to understand, in aggregate, how visitors use it (for
          example, which pages are visited and from which countries). Google Analytics uses cookies
          and collects information such as your approximate location, device and browser type. IP
          addresses are not logged or stored. You can opt out with the{' '}
          <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
            Google Analytics opt-out browser add-on
          </ExternalLink>
          .
        </p>
      </Section>

      <Section title="Third-party services">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-foreground">GitHub Pages</strong> hosts the site. Like any web
            server, it processes your IP address to deliver the pages and may keep it in security
            logs. See the{' '}
            <ExternalLink href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">
              GitHub Privacy Statement
            </ExternalLink>
            . The &ldquo;Report a bug&rdquo; and &ldquo;Suggest a feature&rdquo; links open an issue
            form on GitHub, with the address of the page you were on filled in. Nothing is sent
            until you submit the form, and what you submit is public.
          </li>
          <li>
            <strong className="text-foreground">Buy Me a Coffee</strong> provides the support
            widget. Its script is loaded from Buy Me a Coffee&apos;s servers, and any donation is
            handled entirely by them under the{' '}
            <ExternalLink href="https://www.buymeacoffee.com/privacy-policy">
              Buy Me a Coffee privacy policy
            </ExternalLink>
            .
          </li>
          <li>
            <strong className="text-foreground">Google</strong> provides advertising and analytics,
            as described above, under the{' '}
            <ExternalLink href="https://policies.google.com/privacy">
              Google Privacy Policy
            </ExternalLink>
            .
          </li>
        </ul>
      </Section>

      <Section title="Legal basis">
        <p>
          Personalised advertising and analytics cookies are only used with your consent (GDPR
          Article 6(1)(a)), which you can withdraw at any time. Hosting, security and
          non-personalised ads rely on legitimate interest in operating and funding the site (GDPR
          Article 6(1)(f)).
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Under the GDPR you have the right to access, rectify, erase, restrict or object to the
          processing of your personal data, the right to data portability and the right to withdraw
          consent. As this site does not itself store personal data, most requests are best directed
          to the third-party providers listed above. You also have the right to lodge a complaint
          with the Portuguese data protection authority,{' '}
          <ExternalLink href="https://www.cnpd.pt">CNPD</ExternalLink>.
        </p>
      </Section>

      <Section title="Children">
        <p>
          This site is intended for software developers and testers and is not directed at children
          under 16.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          This policy may be updated from time to time; the date at the top shows the latest
          version. For any question about this policy or your data, please{' '}
          <ExternalLink href={`${GITHUB_REPO_URL}/issues`}>open an issue on GitHub</ExternalLink>.
        </p>
      </Section>
    </article>
  )
}
