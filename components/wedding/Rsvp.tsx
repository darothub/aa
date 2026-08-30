'use client';

import { useState, type FormEvent } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';

export default function Rsvp() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [nameError, setNameError] = useState('');
  const [attendError, setAttendError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    const nErr = trimmed.length < 2 ? 'Please tell us your name as it appears on your invitation.' : '';
    const aErr = !attending ? 'Let us know if you can make it.' : '';
    if (nErr || aErr) {
      setNameError(nErr);
      setAttendError(aErr);
      return;
    }
    setNameError('');
    setAttendError('');
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, attending })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Something went wrong saving your reply.');
      }
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong saving your reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = name.trim().split(' ')[0] || 'friend';
  const successTitle = attending === 'yes' ? 'Wonderful — you are on the list.' : 'Thank you for letting us know.';
  const successBody =
    attending === 'yes'
      ? `Saved, ${firstName}. We will send timings and travel details closer to the day. Somebody just cheered.`
      : `We will miss you, ${firstName} — and we will make sure you see every photograph.`;

  return (
    <section id="rsvp" style={css('scroll-margin-top:104px;padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#1f1c18')}>
      <div
        style={css(
          'max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(28px,4vw,44px);text-align:center;align-items:center'
        )}
      >
        <Reveal style={css('display:flex;flex-direction:column;gap:16px')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
            RSVP
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,68px)/1.02 'Cormorant Garamond',serif;color:#faf7f1;letter-spacing:-.015em")}>
            Will you be there?
          </h2>
          <p style={css("margin:0;font:300 clamp(14.5px,1.6vw,16px)/1.8 'Jost',sans-serif;color:rgba(250,247,241,.6)")}>
            Kindly reply by 24 October 2026.
          </p>
        </Reveal>

        {!done && (
          <form onSubmit={onSubmit} noValidate style={css('width:100%;display:flex;flex-direction:column;gap:26px;text-align:left')}>
            <label style={css('display:flex;flex-direction:column;gap:9px')}>
              <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(250,247,241,.55)")}>
                Full name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder="As it appears on your invitation"
                autoComplete="name"
                style={css(
                  "appearance:none;width:100%;box-sizing:border-box;background:none;border:0;border-bottom:1px solid rgba(250,247,241,.28);padding:12px 0;font:300 clamp(17px,2.2vw,21px)/1.4 'Cormorant Garamond',serif;color:#faf7f1;transition:border-color .4s ease"
                )}
              />
              {nameError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#d99a7a")}>{nameError}</span>}
            </label>

            <fieldset style={css('border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:12px')}>
              <legend style={css("padding:0;font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(250,247,241,.55)")}>
                Attending
              </legend>
              <div style={css('display:flex;gap:12px;flex-wrap:wrap')}>
                <button
                  type="button"
                  data-choice
                  {...(attending === 'yes' ? { 'data-selected': '' } : {})}
                  aria-pressed={attending === 'yes'}
                  onClick={() => {
                    setAttending('yes');
                    setAttendError('');
                  }}
                  style={css(
                    "flex:1 1 160px;appearance:none;cursor:pointer;background:none;border:1px solid rgba(250,247,241,.28);color:#faf7f1;padding:18px 20px;font:400 13px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:uppercase;transition:background .4s ease,color .4s ease,border-color .4s ease"
                  )}
                >
                  Joyfully yes
                </button>
                <button
                  type="button"
                  data-choice
                  {...(attending === 'no' ? { 'data-selected': '' } : {})}
                  aria-pressed={attending === 'no'}
                  onClick={() => {
                    setAttending('no');
                    setAttendError('');
                  }}
                  style={css(
                    "flex:1 1 160px;appearance:none;cursor:pointer;background:none;border:1px solid rgba(250,247,241,.28);color:#faf7f1;padding:18px 20px;font:400 13px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:uppercase;transition:background .4s ease,color .4s ease,border-color .4s ease"
                  )}
                >
                  Sadly can&apos;t
                </button>
              </div>
              {attendError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#d99a7a")}>{attendError}</span>}
            </fieldset>

            {submitError && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#d99a7a")}>{submitError}</span>}

            <button
              type="submit"
              disabled={submitting}
              style={css(
                "align-self:flex-start;appearance:none;cursor:pointer;border:1px solid #faf7f1;background:#faf7f1;color:#1f1c18;padding:18px 36px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;transition:background .45s ease,color .45s ease,border-color .45s ease"
              )}
            >
              {submitting ? 'Sending…' : 'Send my reply'}
            </button>
          </form>
        )}

        {done && (
          <div
            style={css(
              'width:100%;padding:clamp(30px,5vw,48px) clamp(20px,4vw,36px);border:1px solid rgba(195,154,114,.4);display:flex;flex-direction:column;align-items:center;gap:16px;animation:wsRise .8s ease both'
            )}
          >
            <div
              style={css(
                "width:56px;height:56px;border-radius:50%;border:1px solid rgba(195,154,114,.6);display:flex;align-items:center;justify-content:center;font:300 26px/1 'Cormorant Garamond',serif;color:#c39a72;animation:wsPop .7s cubic-bezier(.2,.7,.2,1) both"
              )}
            >
              ✓
            </div>
            <h3 style={css("margin:0;font:300 clamp(26px,4vw,40px)/1.15 'Cormorant Garamond',serif;color:#faf7f1")}>
              {successTitle}
            </h3>
            <p style={css("margin:0;max-width:38ch;font:300 14.5px/1.8 'Jost',sans-serif;color:rgba(250,247,241,.6)")}>
              {successBody}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              style={css(
                "appearance:none;background:none;border:0;cursor:pointer;font:400 11px/1 'Jost',sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#c39a72;padding:6px"
              )}
            >
              Change my reply
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
