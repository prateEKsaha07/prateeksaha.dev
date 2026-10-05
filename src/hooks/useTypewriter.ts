import { useEffect, useState } from 'react'

export function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
          return
        }
        setCharIdx((c) => c + 1)
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx((i) => (i + 1) % words.length)
          setCharIdx(0)
          return
        }
        setCharIdx((c) => c - 1)
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [words, wordIdx, charIdx, deleting, speed, pause])

  return display
}