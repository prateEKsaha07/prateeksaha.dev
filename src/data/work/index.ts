export type WorkSection = {
  id: string
  title: string
  content: string   // markdown, may include ```mermaid blocks
}

export type Work = {
  slug: string
  title: string
  tag: string
  summary: string
  date: string
  live: string | null
  github: string | null

  // Sidebar facts
  facts: {
    stack: string[]
    database: string
    auth: string
    realtime: string
    hosting: string
    status: string
  }

  sections: WorkSection[]
}

export const work: Work[] = []

import { marketflip } from './marketflip'
import { geargrid } from './geargrid'
import { ragV2 } from './rag-v2'

work.push(marketflip)
work.push(geargrid)
work.push(ragV2)