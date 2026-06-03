import { useEffect, useRef } from 'react';
import { format, parseISO, addMinutes } from 'date-fns';

const SPARKLE_COLORS = ['#d4537e', '#f97db5', '#ffd6e7', '#993556', '#ffb3d1'];

function createSparkle(container) {
  const el = document.createElement('div');
  const size = Math.random() * 10 + 6;
  const x = Math.random() * 300 - 150;
  const y = Math.random() * -200 - 50;
  el.style.cssText = `
    position: absolute; width: ${size}px; height: ${size}px;
    left: calc(50% + ${x}px); top: 80px;
    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    background: ${SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]};
    pointer-events: none;
    animation: sparkle ${Math.random() * 0.6 + 0.6}s ease forwards;
    transform-origin: center; rotate: ${Math.random() * 360}deg; translate: 0 ${y}px;
  `;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function formatForCalendar(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export default function Success({ services, slot, client }) {
  const containerRef = useRef(null);
  const dt            = parseISO(slot);
  const totalPrice    = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration_mins, 0);
  const endDt         = addMinutes(dt, totalDuration);
  const serviceLabel  = services.map(s => s.name).join(' + ');

  useEffect(() => {
    if (!containerRef.current) return;
    let count = 0;
    const interval = setInterval(() => {
      createSparkle(containerRef.current);
      count++;
      if (count >= 30) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Snails — ' + serviceLabel)}&dates=${formatForCalendar(dt)}/${formatForCalendar(endDt)}&details=${encodeURIComponent('Appointment at Snails Nail Studio\nService: ' + serviceLabel + '\nDuration: ' + totalDuration + ' min')}&location=${encodeURIComponent('Snails Nail Studio')}`;

  function downloadIcs() {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Snails Nail Studio//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatForCalendar(dt)}`,
      `DTEND:${formatForCalendar(endDt)}`,
      `SUMMARY:Snails — ${serviceLabel}`,
      `DESCRIPTION:Appointment at Snails Nail Studio\\nService: ${serviceLabel}\\nDuration: ${totalDuration} min`,
      'LOCATION:Snails Nail Studio',
      `UID:${Date.now()}@snails`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'snails-appointment.ics'; a.click();
    URL.revokeObjectURL(url);
  }

  const calBtnStyle = {
    flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7,
    padding:'11px 12px', fontSize:13, fontWeight:500,
    background:'#fff', border:'1.5px solid var(--p200)',
    borderRadius:99, color:'var(--p700)', textDecoration:'none',
    cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
  };

  return (
    <div ref={containerRef} className="fade-up" style={{ textAlign:'center', padding:'20px 0', position:'relative', overflow:'hidden' }}>
      <div style={{
        width:72, height:72, borderRadius:'50%', background:'var(--p600)',
        display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 20px', fontSize:32, color:'var(--p100)',
        animation:'successBounce .5s ease', boxShadow:'0 8px 24px rgba(212,83,126,.35)',
      }}>✓</div>

      <h2 style={{ fontSize:24, fontWeight:500, color:'var(--p800)', marginBottom:6 }}>You're all booked!</h2>
      <p style={{ fontSize:15, color:'var(--p600)', marginBottom:24 }}>See you soon at Snails ✦</p>

      {/* Services */}
      <div style={{ background:'var(--p100)', border:'1px solid var(--p200)', borderRadius:'var(--radius-lg)', padding:'16px 20px', textAlign:'left', marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:500, color:'var(--p500)', textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>Services</div>
        {services.map((s, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--p200)', fontSize:13 }}>
            <span style={{ color:'var(--p700)' }}>{s.name}</span>
            <span style={{ color:'var(--p800)' }}>{s.duration_mins} min · {Number(s.price).toFixed(0)} RSD</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0', fontSize:14 }}>
          <span style={{ fontWeight:500, color:'var(--p800)' }}>Total · {totalDuration} min</span>
          <span style={{ fontWeight:500, color:'var(--p700)' }}>{totalPrice.toFixed(0)} RSD</span>
        </div>
      </div>

      {/* Appointment */}
      <div style={{ background:'var(--p100)', border:'1px solid var(--p200)', borderRadius:'var(--radius-lg)', padding:'16px 20px', textAlign:'left', marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:500, color:'var(--p500)', textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>Appointment</div>
        {[['Date', format(dt, 'EEEE, d MMMM yyyy')], ['Time', format(dt, 'HH:mm')]].map(([l, v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--p200)', fontSize:13 }}>
            <span style={{ color:'var(--p600)' }}>{l}</span>
            <span style={{ color:'var(--p800)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Add to calendar */}
      <p style={{ fontSize:11, fontWeight:600, color:'var(--p500)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.6px' }}>
        Add to your calendar
      </p>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={calBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--p400)'; e.currentTarget.style.background='var(--p100)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--p200)'; e.currentTarget.style.background='#fff'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--p600)" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Google Calendar
        </a>
        <button onClick={downloadIcs} style={calBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--p400)'; e.currentTarget.style.background='var(--p100)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--p200)'; e.currentTarget.style.background='#fff'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--p600)" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>
          </svg>
          Apple / iCal
        </button>
      </div>

      {client.email && (
        <p style={{ fontSize:13, color:'var(--p500)', marginBottom:16, lineHeight:1.6 }}>
          Confirmation email sent to <strong style={{ color:'var(--p700)' }}>{client.email}</strong>
        </p>
      )}

      <p style={{ fontSize:12, color:'var(--p400)', lineHeight:1.7, marginBottom:20 }}>
        Need to cancel or reschedule? Please give at least 24 hours notice.
      </p>

      <button onClick={() => window.location.reload()} style={{
        padding:'11px 28px', background:'transparent',
        border:'1.5px solid var(--p300)', borderRadius:99,
        color:'var(--p700)', fontSize:14, cursor:'pointer',
        fontFamily:'inherit', transition:'all .15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--p500)'; e.currentTarget.style.background='var(--p100)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--p300)'; e.currentTarget.style.background='transparent'; }}
      >
        Book another appointment
      </button>
    </div>
  );
}
