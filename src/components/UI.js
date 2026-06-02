import { useState } from 'react';

/* Spinner */
export function Spinner({ size = 22, color = 'var(--p600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin .75s linear infinite', display: 'block', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity=".15" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* Page loader */
export function PageLoader() {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={32} />
    </div>
  );
}

/* Animated step progress bar */
export function StepBar({ steps, current }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Progress line */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 0 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {/* Dot */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: i <= current ? 'var(--p600)' : 'var(--p200)',
              boxShadow: i === current ? '0 0 0 3px rgba(212,83,126,.2)' : 'none',
              transition: 'all .3s ease',
              transform: i === current ? 'scale(1.4)' : 'scale(1)',
            }} />
            {/* Line */}
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: 'var(--p200)', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'var(--p600)',
                  transformOrigin: 'left',
                  transform: `scaleX(${i < current ? 1 : 0})`,
                  transition: 'transform .4s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex' }}>
        {steps.map((label, i) => (
          <div key={label} style={{ flex: 1, textAlign: i === 0 ? 'left' : i === steps.length - 1 ? 'right' : 'center' }}>
            <span style={{
              fontSize: 11, fontWeight: i === current ? 600 : 400,
              color: i === current ? 'var(--p800)' : i < current ? 'var(--p600)' : 'var(--p300)',
              transition: 'color .3s, font-weight .3s',
              letterSpacing: i === current ? '.2px' : 0,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Card */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--p200)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px',
      boxShadow: '0 2px 12px rgba(114,36,62,.06)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* Primary button */
export function Btn({ children, loading, disabled, onClick, type = 'button', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        padding: '14px',
        background: disabled || loading ? 'var(--p300)' : hov ? 'var(--p700)' : 'var(--p600)',
        color: 'var(--p100)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontSize: 15,
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'background .18s, transform .1s, box-shadow .18s',
        boxShadow: disabled || loading ? 'none' : hov ? '0 6px 20px rgba(212,83,126,.4)' : '0 3px 10px rgba(212,83,126,.25)',
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        ...style,
      }}
    >
      {loading && <Spinner size={18} color="var(--p100)" />}
      {children}
    </button>
  );
}

/* Text input */
export function Field({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 600, color: focused ? 'var(--p600)' : 'var(--p700)',
          textTransform: 'uppercase', letterSpacing: '.5px', transition: 'color .15s',
        }}>{label}</label>
      )}
      <input
        style={{
          padding: '12px 14px',
          fontSize: 15,
          color: 'var(--p800)',
          background: 'var(--white)',
          border: `1.5px solid ${error ? '#fca5a5' : focused ? 'var(--p500)' : 'var(--p200)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          width: '100%',
          transition: 'border-color .18s, box-shadow .18s',
          boxShadow: focused ? '0 0 0 3px rgba(212,83,126,.1)' : 'none',
        }}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#dc2626', animation: 'fadeUp .15s ease' }}>{error}</span>}
    </div>
  );
}

/* Textarea */
export function FieldArea({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 600, color: focused ? 'var(--p600)' : 'var(--p700)',
          textTransform: 'uppercase', letterSpacing: '.5px', transition: 'color .15s',
        }}>{label}</label>
      )}
      <textarea
        rows={3}
        style={{
          padding: '12px 14px',
          fontSize: 15,
          color: 'var(--p800)',
          background: 'var(--white)',
          border: `1.5px solid ${focused ? 'var(--p500)' : 'var(--p200)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          width: '100%',
          resize: 'vertical',
          transition: 'border-color .18s, box-shadow .18s',
          boxShadow: focused ? '0 0 0 3px rgba(212,83,126,.1)' : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </div>
  );
}

/* Summary row */
export function SummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '8px 0', borderBottom: '1px solid var(--p100)',
      fontSize: 14,
    }}>
      <span style={{ color: 'var(--p600)' }}>{label}</span>
      <span style={{ color: 'var(--p800)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
