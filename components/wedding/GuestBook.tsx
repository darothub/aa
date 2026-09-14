'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import { GUESTBOOK } from '@/content/wedding';

type Message = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

export default function GuestBook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch('/api/guestbook')
      .then((res) => res.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const nErr = trimmedName.length < 2 ? 'Please tell us your name.' : '';
    const mErr = trimmedMessage.length < 3 ? 'Please write a short message.' : '';
    if (nErr || mErr) {
      setNameError(nErr);
      setMessageError(mErr);
      return;
    }
    setNameError('');
    setMessageError('');
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, message: trimmedMessage })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Something went wrong saving your message.');
      }
      setMessages((prev) => [
        { id: Date.now(), name: trimmedName, message: trimmedMessage, createdAt: new Date().toISOString() },
        ...prev
      ]);
      setName('');
      setMessage('');
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong saving your message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="guestbook"
      style={css('scroll-margin-top:104px;padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#faf7f1')}
    >
      <div style={css('max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(28px,4vw,44px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:16px;text-align:center;align-items:center')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
            Guest Book
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,68px)/1.02 'Cormorant Garamond',serif;color:#1f1c18;letter-spacing:-.015em")}>
            {GUESTBOOK.heading}
          </h2>
          <p style={css("margin:0;max-width:44ch;font:300 clamp(14.5px,1.6vw,16px)/1.8 'Jost',sans-serif;color:rgba(31,28,24,.6)")}>
            {GUESTBOOK.subhead}
          </p>
        </Reveal>

        <form onSubmit={onSubmit} noValidate style={css('display:flex;flex-direction:column;gap:20px;text-align:left')}>
          <label style={css('display:flex;flex-direction:column;gap:9px')}>
            <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.55)")}>
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              placeholder={GUESTBOOK.namePlaceholder}
              autoComplete="name"
              style={css(
                "appearance:none;width:100%;box-sizing:border-box;background:none;border:0;border-bottom:1px solid rgba(31,28,24,.28);padding:12px 0;font:300 clamp(17px,2.2vw,21px)/1.4 'Cormorant Garamond',serif;color:#1f1c18"
              )}
            />
            {nameError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#b1502f")}>{nameError}</span>}
          </label>

          <label style={css('display:flex;flex-direction:column;gap:9px')}>
            <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.55)")}>
              Message
            </span>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageError('');
              }}
              placeholder={GUESTBOOK.messagePlaceholder}
              rows={4}
              style={css(
                "appearance:none;width:100%;box-sizing:border-box;resize:vertical;background:none;border:1px solid rgba(31,28,24,.28);padding:14px;font:300 16px/1.6 'Cormorant Garamond',serif;color:#1f1c18"
              )}
            />
            {messageError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#b1502f")}>{messageError}</span>}
          </label>

          {submitError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#b1502f")}>{submitError}</span>}

          <button
            type="submit"
            disabled={submitting}
            style={css(
              "align-self:flex-start;appearance:none;cursor:pointer;border:1px solid #1f1c18;background:#1f1c18;color:#faf7f1;padding:18px 36px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;transition:background .45s ease,color .45s ease"
            )}
          >
            {submitting ? 'Sending…' : GUESTBOOK.submitLabel}
          </button>

          {done && (
            <p style={css("margin:0;font:400 13px/1.6 'Jost',sans-serif;color:#7a8a6f")}>{GUESTBOOK.successNote}</p>
          )}
        </form>

        <div style={css('display:flex;flex-direction:column;gap:18px;padding-top:12px;border-top:1px solid rgba(31,28,24,.12)')}>
          {!loading && messages.length === 0 && (
            <p style={css("margin:0;font:300 14px/1.7 'Jost',sans-serif;color:rgba(31,28,24,.5)")}>
              {GUESTBOOK.emptyState}
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} style={css('display:flex;flex-direction:column;gap:6px')}>
              <p style={css("margin:0;font:300 16px/1.6 'Cormorant Garamond',serif;color:#1f1c18")}>{m.message}</p>
              <span style={css("font:500 10px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#c39a72")}>
                — {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
