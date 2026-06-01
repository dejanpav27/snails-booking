/* Spinner */
export function Spinner({ size = 22, color = 'var(--p600)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin .75s linear infinite', display: 'block' }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity=".2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* Full-page centered loader */
export function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={32} />
    </div>
  );
}

/* Animated step progress bar */
export function StepBar({ steps, current }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            <div style={{
              height: 3,
              background: 'var(--p200)',
              marginBottom: 6,
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: done || active ? '100%' : '0%',
                background: done ? 'var(--p600)' : active ? 'var(--p400)' : 'transparent',
                transition: 'width .4s cubic-bezier(.4,0,.2,1), background .3s ease',
                borderRadius: 2,
              }} />
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--p800)' : done ? 'var(--p600)' : 'var(--p300)',
              transition: 'color .3s',
            }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Section card */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--p200)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* Primary button */
export function Btn({ children, loading, disabled, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        padding: '13px',
        background: disabled || loading ? 'var(--p300)' : 'var(--p600)',
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
        transition: 'background .15s, transform .1s',
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--p700)' }}>{label}</label>}
      <input
        style={{
          padding: '11px 14px',
          fontSize: 15,
          color: 'var(--p800)',
          background: 'var(--white)',
          border: `1px solid ${error ? '#fca5a5' : 'var(--p200)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          width: '100%',
          transition: 'border-color .15s',
        }}
        onFocus={e  => e.target.style.borderColor = 'var(--p400)'}
        onBlur={e   => e.target.style.borderColor = error ? '#fca5a5' : 'var(--p200)'}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
    </div>
  );
}

/* Textarea */
export function FieldArea({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--p700)' }}>{label}</label>}
      <textarea
        rows={3}
        style={{
          padding: '11px 14px',
          fontSize: 15,
          color: 'var(--p800)',
          background: 'var(--white)',
          border: '1px solid var(--p200)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          width: '100%',
          resize: 'vertical',
          transition: 'border-color .15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--p400)'}
        onBlur={e  => e.target.style.borderColor = 'var(--p200)'}
        {...props}
      />
    </div>
  );
}

/* Summary row */
export function SummaryRow({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '7px 0', borderBottom: '1px solid var(--p100)',
      fontSize: 14,
    }}>
      <span style={{ color: 'var(--p600)' }}>{label}</span>
      <span style={{ color: accent ? 'var(--p600)' : 'var(--p800)', fontWeight: accent ? 500 : 400 }}>{value}</span>
    </div>
  );
}
