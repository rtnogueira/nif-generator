export const SITE_NAME = 'rtnogueira'
export const AUTHOR_NAME = 'rtnogueira'
export const AUTHOR_URL = 'https://github.com/rtnogueira'
export const GITHUB_REPO_URL = `${AUTHOR_URL}/nif-generator`

const ISSUE_TEMPLATES = { bug: 'bug_report.yml', feature: 'feature_request.yml' } as const

/**
 * Opens the GitHub issue form for a bug report or a feature request, with the `page` field
 * (the page the visitor was on, including the generator's options) filled in.
 */
export function newIssueUrl(kind: keyof typeof ISSUE_TEMPLATES, page: string): string {
  const params = new URLSearchParams({ template: ISSUE_TEMPLATES[kind], page })
  return `${GITHUB_REPO_URL}/issues/new?${params}`
}

export const BUY_ME_A_COFFEE_URL = 'https://www.buymeacoffee.com/rubentiagor'
