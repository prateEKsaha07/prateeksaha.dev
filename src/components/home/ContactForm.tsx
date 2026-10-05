import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'

const WEB3FORMS_ACCESS_KEY = '79f17008-68af-4e65-868e-e1b537e5d375'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
          from_name: 'Portfolio Contact Form',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', message: '' })
        setTimeout(() => setSent(false), 4000)
      } else {
        setError('Something went wrong. Please email me directly.')
      }
    } catch {
      setError('Network error. Please email me directly.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: CSSProperties = {
    background: 'var(--muted)', border: '1px solid var(--border)',
    color: 'var(--foreground)', fontFamily: 'Inter,sans-serif', fontWeight: 300,
    fontSize: '0.875rem', padding: '0.875rem 1rem', width: '100%',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'none',
  }

  return (
    <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
        <input
          placeholder="Your name" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
        <input
          type="email" placeholder="Email address" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
      <textarea
        placeholder="What's on your mind?" required rows={5} value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        style={{ ...inputStyle, resize: 'vertical' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: sent ? '#222' : 'var(--accent)',
          color: sent ? 'var(--accent)' : 'var(--accent-foreground)',
          border: `1px solid ${sent ? 'var(--accent)' : 'transparent'}`,
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.875rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0.875rem 2.5rem',
          cursor: loading ? 'wait' : 'none',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s',
          animation: !sent && !loading ? 'pulseGlow 3s 3' : 'none',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Sending…' : sent ? '✓ Sent!' : 'Send Message →'}
      </button>
      {error && (
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', color: '#FF4C8B', margin: 0 }}>
          {error}
        </p>
      )}
    </form>
  )
}