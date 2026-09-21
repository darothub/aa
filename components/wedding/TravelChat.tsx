'use client';

import { useRef, useState } from 'react';
import { css } from '@/lib/css';

type Msg = { role: 'user' | 'assistant'; text: string };

const MAX_MESSAGE_LENGTH = 300;
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;
/** Matches the [[link:Label|target]] token the assistant is instructed (see
 * route.ts) to emit when an answer refers to something already on this page,
 * so it can be rendered as a real button instead of read out as a URL. */
const SECTION_LINK_PATTERN = /(\[\[link:[^|]+\|[^\]]+\]\])/g;
const SECTION_LINK_TOKEN = /^\[\[link:([^|]+)\|([^\]]+)\]\]$/;

const SUGGESTED_QUESTIONS = [
  'What time should I arrive?',
  "What's the dress code?",
  'Is there parking on site?',
  'How do I send a gift?',
  'Where can I share my photos?'
];

function renderTextSegment(text: string) {
  const parts = text.split(BOLD_PATTERN);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={css('font-weight:600')}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

const linkButtonStyle = (isUser: boolean) =>
  css(
    (isUser
      ? 'border:1px solid rgba(250,247,241,.6);color:#faf7f1'
      : 'border:1px solid rgba(31,28,24,.3);color:#1f1c18') +
      ";display:inline-block;margin:4px 6px 4px 0;padding:6px 12px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;background:none;cursor:pointer;vertical-align:middle"
  );

function renderMessageBody(text: string, isUser: boolean, goToSection: (id: string) => void) {
  const parts = text.split(SECTION_LINK_PATTERN).flatMap((part) => part.split(URL_PATTERN));
  return parts.map((part, i) => {
    const sectionMatch = part.match(SECTION_LINK_TOKEN);
    if (sectionMatch) {
      const [, label, target] = sectionMatch;
      if (target.startsWith('#')) {
        return (
          <button key={i} type="button" onClick={() => goToSection(target.slice(1))} style={linkButtonStyle(isUser)}>
            {label} ↓
          </button>
        );
      }
      return (
        <a key={i} href={target} style={linkButtonStyle(isUser)}>
          {label} ↗
        </a>
      );
    }
    if (part.match(URL_PATTERN)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={linkButtonStyle(isUser)}>
          Open link ↗
        </a>
      );
    }
    if (!part) return null;
    return (
      <span
        key={i}
        style={css("font:300 13.5px/1.6 'Jost',sans-serif;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word")}
      >
        {renderTextSegment(part)}
      </span>
    );
  });
}

/**
 * Renders as a fixed rounded-square icon docked to the bottom-right corner of
 * the viewport (the wedding logo mark), with a dismissible label bubble and a
 * pulsing ring to draw a first-time guest's attention to what it does.
 * Opens a panel that slides in from the right edge and stays pinned there —
 * rather than a centered modal — so guests can keep the page behind it in
 * view while they ask. Rendered once at the page level (see WeddingPage.tsx)
 * so it stays available while scrolling through every section, not just
 * Travel.
 */
export default function TravelChat() {
  const [open, setOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openChat = () => {
    setOpen(true);
    setShowLabel(false);
  };

  const closeChat = () => {
    setOpen(false);
    setShowLabel(true);
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  /** Closes the panel and scrolls the page to the section the answer just
   * referenced, so the guest lands on the real content instead of a link. */
  const goToSection = (id: string) => {
    closeChat();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const sendText = async (text: string) => {
    if (!text || sending) return;

    const next = [...messages, { role: 'user', text } as Msg];
    setMessages(next);
    setInput('');
    setSending(true);
    setError(null);
    scrollToEnd();

    try {
      const res = await fetch('/api/travel-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, history: next.slice(0, -1) })
      });
      const data = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null;

      if (!res.ok || !data?.reply) {
        setError(data?.error || 'Could not reach the wedding assistant right now.');
        return;
      }
      setMessages((cur) => [...cur, { role: 'assistant', text: data.reply as string }]);
      scrollToEnd();
    } catch {
      setError('Could not reach the wedding assistant right now.');
    } finally {
      setSending(false);
    }
  };

  const send = () => sendText(input.trim());

  return (
    <>
      <style>{`
        @keyframes travelChatPulse {
          0% { box-shadow: 0 0 0 0 rgba(31,28,24,.32); }
          70% { box-shadow: 0 0 0 14px rgba(31,28,24,0); }
          100% { box-shadow: 0 0 0 0 rgba(31,28,24,0); }
        }
        @keyframes travelChatLabelIn {
          from { opacity: 0; transform: translate(6px, 6px); }
          to { opacity: 1; transform: translate(0, 0); }
        }
      `}</style>

      {!open && (
        <div
          style={css(
            'position:fixed;bottom:clamp(18px,3vw,28px);right:clamp(14px,2.4vw,28px);z-index:900;display:flex;flex-direction:column;align-items:flex-end;gap:10px'
          )}
        >
          {showLabel && (
            <div
              role="status"
              style={css(
                "animation:travelChatLabelIn .4s ease-out;display:flex;align-items:center;gap:8px;background:#1f1c18;color:#faf7f1;padding:9px 14px;box-shadow:0 8px 20px rgba(31,28,24,.24);white-space:nowrap"
              )}
            >
              <span style={css("font:300 12.5px/1.3 'Jost',sans-serif")}>Ask us anything about the wedding</span>
              <button
                type="button"
                onClick={() => setShowLabel(false)}
                aria-label="Dismiss"
                style={css(
                  "appearance:none;cursor:pointer;border:none;background:none;color:rgba(250,247,241,.7);font:300 15px/1 'Jost',sans-serif;padding:0 0 0 2px"
                )}
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={openChat}
            aria-label="Ask the wedding assistant"
            title="Ask the wedding assistant"
            style={css(
              `width:48px;height:48px;border-radius:14px;border:none;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;padding:0;flex-shrink:0;transition:transform .3s ease;animation:travelChatPulse 2.6s ease-out ${
                open ? '0s 1' : 'infinite'
              };box-shadow:0 0 0 1px rgba(154,111,76,.5),0 6px 16px -8px rgba(31,28,24,.45);background:#1f1c18`
            )}
          >
            <span style={css('font-size:22px;line-height:1')}>💬</span>
          </button>
        </div>
      )}

      {open && (
        <div
          style={css('position:fixed;inset:0;z-index:1000;background:rgba(31,28,24,.42)')}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeChat();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ask the wedding assistant"
            style={css(
              'position:fixed;bottom:clamp(96px,14vw,112px);right:clamp(12px,2.4vw,26px);z-index:1001;width:min(400px,92vw);height:66vh;max-height:720px;min-height:420px;display:flex;flex-direction:column;background:#faf7f1;border:1px solid rgba(31,28,24,.14);border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(31,28,24,.28)'
            )}
          >
            <div
              style={css(
                'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:clamp(18px,3vw,24px);border-bottom:1px solid rgba(31,28,24,.12)'
              )}
            >
              <div style={css('display:flex;flex-direction:column;gap:4px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#9a6f4c")}>
                  Wedding FAQ
                </span>
                <span style={css("font:300 20px/1.2 'Cormorant Garamond',serif;color:#1f1c18")}>
                  Ask us anything about the day
                </span>
              </div>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close"
                style={css(
                  "appearance:none;cursor:pointer;border:none;background:none;color:#6b6259;font:300 22px/1 'Jost',sans-serif;padding:4px 8px"
                )}
              >
                ×
              </button>
            </div>

            <div ref={listRef} style={css('flex:1;min-height:0;overflow-y:auto;padding:clamp(18px,3vw,24px);display:flex;flex-direction:column;gap:14px')}>
              {messages.length === 0 && (
                <div style={css('display:flex;flex-wrap:wrap;gap:8px')}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendText(q)}
                      disabled={sending}
                      style={css(
                        "appearance:none;cursor:pointer;border:1px solid rgba(31,28,24,.22);background:#fff;color:#1f1c18;padding:8px 12px;font:300 12px/1.3 'Jost',sans-serif;text-align:left"
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={css(
                    m.role === 'user'
                      ? 'align-self:flex-end;max-width:85%;background:#1f1c18;color:#faf7f1;padding:10px 14px'
                      : 'align-self:flex-start;max-width:85%;background:#efe8dd;color:#1f1c18;padding:10px 14px'
                  )}
                >
                  <div>{renderMessageBody(m.text, m.role === 'user', goToSection)}</div>
                </div>
              ))}
              {sending && (
                <div style={css('align-self:flex-start;max-width:85%;background:#efe8dd;color:#6b6259;padding:10px 14px')}>
                  <span style={css("font:300 13.5px/1.6 'Jost',sans-serif")}>Thinking…</span>
                </div>
              )}
              {error && (
                <p style={css("margin:0;font:300 13px/1.6 'Jost',sans-serif;color:#a1483a")}>{error}</p>
              )}
            </div>

            <div style={css('display:flex;gap:10px;padding:clamp(16px,3vw,20px);border-top:1px solid rgba(31,28,24,.12)')}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="e.g. What's the dress code?"
                disabled={sending}
                style={css(
                  "flex:1;border:1px solid rgba(31,28,24,.22);background:#fff;padding:12px 14px;font:300 13.5px/1.4 'Jost',sans-serif;color:#1f1c18"
                )}
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                style={css(
                  "appearance:none;cursor:pointer;border:1px solid #1f1c18;background:#1f1c18;color:#faf7f1;padding:12px 20px;font:500 10.5px/1 'Jost',sans-serif;letter-spacing:.18em;text-transform:uppercase;transition:opacity .3s ease;opacity:" +
                    (sending || !input.trim() ? '.5' : '1')
                )}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
