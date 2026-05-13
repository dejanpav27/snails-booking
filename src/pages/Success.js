import { format, parseISO } from 'date-fns';

export default function Success({ services, slot, client }) {
  const dt = parseISO(slot);
  const totalPrice    = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration_mins, 0);

  return (
    <div className="fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--p600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32, color: 'var(--p100)' }}>
        ✓
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 500, color: 'var(--p800)', marginBottom: 6 }}>You're all booked!</h2>
      <p style={{ fontSize: 15, color: 'var(--p600)', marginBottom: 28 }}>See you soon at Snails ✦</p>

      <div style={{ background: 'var(--p100)', border: '1px solid var(--p200)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', textAlign: 'left', marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>Services</div>
        {services.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--p200)', fontSize: 13 }}>
            <span style={{ color: 'var(--p700)' }}>{s.name}</span>
            <span style={{ color: 'var(--p800)' }}>{s.duration_mins} min · £{Number(s.price).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 14 }}>
          <span style={{ fontWeight: 500, color: 'var(--p800)' }}>Total · {totalDuration} min</span>
          <span style={{ fontWeight: 500, color: 'var(--p700)' }}>£{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ background: 'var(--p100)', border: '1px solid var(--p200)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', textAlign: 'left', marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>Appointment</div>
        {[['Date', format(dt, 'EEEE, d MMMM yyyy')], ['Time', format(dt, 'HH:mm')]].map(([l,v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--p200)', fontSize: 13 }}>
            <span style={{ color: 'var(--p600)' }}>{l}</span><span style={{ color: 'var(--p800)' }}>{v}</span>
          </div>
        ))}
      </div>

      {client.email && (
        <p style={{ fontSize: 13, color: 'var(--p500)', marginBottom: 24, lineHeight: 1.6 }}>
          A confirmation has been sent to <strong style={{ color: 'var(--p700)' }}>{client.email}</strong>
        </p>
      )}

      <p style={{ fontSize: 12, color: 'var(--p400)', lineHeight: 1.7 }}>
        Need to cancel or reschedule? Please give at least 24 hours notice.
      </p>

      <button onClick={() => window.location.reload()} style={{ marginTop: 28, padding: '11px 24px', background: 'transparent', border: '1px solid var(--p300)', borderRadius: 'var(--radius-md)', color: 'var(--p700)', fontSize: 14, cursor: 'pointer' }}>
        Book another appointment
      </button>
    </div>
  );
}
