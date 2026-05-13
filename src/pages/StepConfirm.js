import { format, parseISO } from 'date-fns';
import { SummaryRow } from '../components/UI';

export default function StepConfirm({ services, slot, client }) {
  const dt = parseISO(slot);
  const totalPrice    = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration_mins, 0);

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Confirm your booking
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 24 }}>
        Everything look right?
      </p>

      {/* Services */}
      <div style={{ background: 'var(--p100)', border: '1px solid var(--p200)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>
          Services
        </div>
        {services.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--p200)', fontSize: 13 }}>
            <span style={{ color: 'var(--p700)' }}>{s.name} <span style={{ color: 'var(--p400)', fontSize: 11 }}>({s.duration_mins} min)</span></span>
            <span style={{ color: 'var(--p800)', fontWeight: 400 }}>£{Number(s.price).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 15 }}>
          <span style={{ fontWeight: 500, color: 'var(--p800)' }}>Total · {totalDuration} min</span>
          <span style={{ fontWeight: 500, color: 'var(--p700)' }}>£{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Date & time */}
      <div style={{ background: '#fff', border: '1px solid var(--p200)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>
          Appointment
        </div>
        <SummaryRow label="Date" value={format(dt, 'EEEE, d MMMM yyyy')} />
        <SummaryRow label="Time" value={format(dt, 'HH:mm')} />
      </div>

      {/* Client details */}
      <div style={{ background: '#fff', border: '1px solid var(--p200)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>
          Your details
        </div>
        <SummaryRow label="Name"  value={client.name} />
        <SummaryRow label="Phone" value={client.phone} />
        {client.email && <SummaryRow label="Email" value={client.email} />}
        {client.notes && <SummaryRow label="Notes" value={client.notes} />}
      </div>

      <p style={{ fontSize: 12, color: 'var(--p400)', textAlign: 'center', lineHeight: 1.6 }}>
        By confirming you agree to our cancellation policy.<br />
        Please give at least 24 hours notice to cancel or reschedule.
      </p>
    </div>
  );
}
