import TextScramble from './TextScramble'
import { SectionLabel } from './SectionLabel'

interface PageHeadingProps {
  /** Small mono label above the title, e.g. "Work · Engineering Write-ups" */
  eyebrow?: string
  /** Primary title line — displayed in foreground color */
  title: string
  /** Optional second line — displayed in accent color */
  titleAccent?: string
  /** Optional description paragraph below the title */
  description?: string
  /** Scramble speed in ms (lower = faster) */
  speed?: number
}

export function PageHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  speed = 40,
}: PageHeadingProps) {
  return (
    <header className="page-heading">
      {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}

      <h1 className="page-heading-title">
        <TextScramble text={title} speed={speed} className="page-heading-scramble" />
        {titleAccent && (
          <>
            <br />
            <span className="page-heading-accent">
              <TextScramble
                text={titleAccent}
                speed={speed}
                className="page-heading-scramble"
              />
            </span>
          </>
        )}
      </h1>

      {description && <p className="page-heading-desc">{description}</p>}
    </header>
  )
}