import { useEffect, useState } from 'react'

export function useActiveSection(sections: string[], initial = 'hero') {
  const [activeSection, setActiveSection] = useState(initial)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        }),
      { threshold: 0.4 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [sections])

  return activeSection
}