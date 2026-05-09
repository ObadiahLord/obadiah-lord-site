'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { open: boolean; onClose: () => void }

export default function IntakeForm({ open, onClose }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    setErrorMsg('')
    if (typeof data._gotcha === 'string' && data._gotcha.length > 0) {
      setStatus('sent')
      form.reset()
      return
    }
    try {
      const res = await fetch('https://formsubmit.co/ajax/obadiahbusiness@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Book A Call: ${data.name}`,
          _captcha: 'false',
          _template: 'table',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const json = await res.json()
      if (json.success === 'true' || json.success === true) {
        setStatus('sent')
        form.reset()
      } else {
        throw new Error(json.message || 'Submit failed')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please email obadiahbusiness@gmail.com directly.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-md" />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-[560px] p-9 noise"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-[16px] leading-none hover:bg-ink/80 transition z-10"
            >
              ×
            </button>

            {status === 'sent' ? (
              <div className="py-8 text-center">
                <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Message sent</div>
                <h3 className="mt-3 text-[32px] font-light tracking-tighter text-ink">Talk soon.</h3>
                <p className="mt-3 text-[14px] text-ink/70">
                  Obadiah will be in touch within one business day.
                </p>
                <button
                  onClick={onClose}
                  className="shimmer-btn mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-[13px] font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Book a call</div>
                <h3 className="mt-2 text-[28px] font-light tracking-tighter text-ink leading-tight">
                  Tell me what you are building.
                </h3>

                <form onSubmit={submit} className="mt-7 grid gap-5">
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                  />
                  <Field name="name" label="Your name" required />
                  <Field name="email" label="Email" type="email" required />
                  <Field name="company" label="Company or project" />
                  <Field name="topic" label="What is this about" />
                  <div>
                    <label className="block text-[11px] tracking-[0.18em] uppercase text-silver mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full bg-white/40 border border-ink/10 rounded-2xl px-4 py-3 text-[14px] text-ink placeholder:text-silver focus:outline-none focus:border-ink/40 resize-none"
                      placeholder="One paragraph is plenty."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="text-[12px] text-red-600">{errorMsg}</div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <span className="text-[11px] text-silver">
                      Goes to obadiahbusiness@gmail.com
                    </span>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="shimmer-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-paper text-[13px] font-medium disabled:opacity-50"
                    >
                      {status === 'sending' ? 'Sending' : 'Send'}
                      <span className="text-[11px]">{status === 'sending' ? '' : '↗'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  name, label, type = 'text', required = false,
}: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase text-silver mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full bg-white/40 border border-ink/10 rounded-full px-5 py-3 text-[14px] text-ink placeholder:text-silver focus:outline-none focus:border-ink/40"
      />
    </div>
  )
}
