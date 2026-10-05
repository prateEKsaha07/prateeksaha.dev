export type CaseStudy = {
  slug: string
  title: string
  tag: string
  desc: string
  tech: string[]
  accent: string
  num: string
  stats?: { label: string; val: string }[]
  live: string | null
  github: string | null
  notebook: string | null
  thumbnail: string | null
  date: string
  metadata?: {
    dataset: string
    source: string
    rows: string
    features: string
    target?: string
    missing?: string
  }
  sections?: {
    id: string
    title: string
    content: string
    table?: {
      headers: string[]
      rows: (string | number)[][]
      note?: string
    }
    charts?: { src: string; caption: string }[]
  }[]
}

import { loanApproval } from './loan-approval'

console.log('[caseStudies/index] loanApproval imported:', loanApproval)

export const caseStudies: CaseStudy[] = [loanApproval]

console.log('[caseStudies/index] array:', caseStudies)
console.log('[caseStudies/index] length:', caseStudies.length)
console.log('[caseStudies/index] first item:', caseStudies[0])