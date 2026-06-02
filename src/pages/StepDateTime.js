import { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek,
  addMonths, subMonths, format, isToday, isPast, isSameDay, parseISO,
} from 'date-fns';
import { Spinner } from '../components/UI';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function fetchAvailability(date, serviceIds) {
  const res = await fetch(`${BASE}/availability?date=${date}&service_ids=${serviceIds}`);
  return res.json();
}

function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

export default function StepDateTime({ serviceIds, selectedDate, selectedSlot, onSelect }) {
  const [month,   setMonth]   = useState(new Date());
  const [date,    setDate]    = useState(selectedDate || null);
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [slot,    setSlot]    = useState(selectedSlot || null);
  const [slotsKey, setSlotsKey] = useState(0); // force re-animation

  useEffect(() => {
    if (!date || !serviceIds) return;
    setSlots([]); setSlot(null);
    setLoading(true);
    fetchAvailability(toDateString(date), serviceIds)
      .then(d => { setSlots(d.available_slots || []); setSlotsKey(k => k + 1); })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date, serviceIds]);

  useEffect(() => {
    if (date && slot) onSelect({ date, slot });
  }, [date, slot]); // eslint-disable-line

  const monthStart = startOfMonth(month);
  const monthEnd   = endOfMonth(month);
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd    = endOfWeek(monthEnd,   { weekStartsOn: 1 });
  const allDays    = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function pickDate(d) { setDate(d); setSlot(null); }

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Pick a date & time
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 22 }}>
        Available slots based on your selected services
      </p>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button
          onClick={() => setMonth(m => subMonths(m, 1))}
          style={navBtn}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--p200)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--p100)'}
        >‹</button>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--p800)' }}>
          {format(month, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setMonth(m => addMonths(m, 1))}
          style={navBtn}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--p200)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--p100)'}
        >›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:11, color:'var(--p400)', padding:'4px 0', fontWeight:500, letterSpacing:'.3px' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 24 }}>
        {allDays.map(day => {
          const inMonth  = day.getMonth() === month.getMonth();
          const past     = isPast(day) && !isToday(day);
          const sel      = date && isSameDay(day, date);
          const today    = isToday(day);
          const disabled = past || !inMonth;
          return (
            <button
              key={day.toString()}
              disabled={disabled}
              onClick={() => pickDate(day)}
              style={{
                aspectRatio: '1',
                border: sel ? '2px solid var(--p600)' : today ? '1.5px solid var(--p300)' : '1.5px solid transparent',
                borderRadius: 'var(--radius-md)',
                background: sel ? 'var(--p600)' : today ? 'var(--p100)' : 'transparent',
                color: sel ? 'var(--p100)' : disabled ? 'var(--p200)' : 'var(--p800)',
                fontSize: 13, fontWeight: today ? 500 : 400,
                cursor: disabled ? 'default' : 'pointer',
                transition: 'all .15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: sel ? '0 4px 12px rgba(212,83,126,.3)' : 'none',
              }}
              onMouseEnter={e => { if (!disabled && !sel) { e.currentTarget.style.background = 'var(--p100)'; e.currentTarget.style.borderColor = 'var(--p300)'; } }}
              onMouseLeave={e => { if (!disabled && !sel) { e.currentTarget.style.background = today ? 'var(--p100)' : 'transparent'; e.currentTarget.style.borderColor = today ? 'var(--p300)' : 'transparent'; } }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {date && (
        <div key={slotsKey}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--p700)', marginBottom: 12 }}>
            Available times — {format(date, 'EEE d MMM')}
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 28 }}><Spinner /></div>
          ) : slots.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '20px 0',
              fontSize: 13, color: 'var(--p400)',
              background: 'var(--p100)', borderRadius: 'var(--radius-md)',
            }}>
              No slots available — try another date
            </div>
          ) : (
            <div className="slot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {slots.map(s => {
                const sel = slot === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    style={{
                      padding: '11px 4px', fontSize: 13, textAlign: 'center',
                      border: `1.5px solid ${sel ? 'var(--p600)' : 'var(--p200)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: sel ? 'var(--p600)' : '#fff',
                      color: sel ? 'var(--p100)' : 'var(--p700)',
                      fontWeight: sel ? 500 : 400,
                      cursor: 'pointer',
                      transition: 'all .15s ease',
                      boxShadow: sel ? '0 4px 12px rgba(212,83,126,.25)' : 'none',
                    }}
                    onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--p400)'; e.currentTarget.style.background = 'var(--p100)'; } }}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--p200)'; e.currentTarget.style.background = '#fff'; } }}
                  >
                    {format(parseISO(s), 'HH:mm')}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const navBtn = {
  background: 'var(--p100)', border: '1px solid var(--p200)',
  borderRadius: 'var(--radius-md)', width: 36, height: 36,
  fontSize: 20, color: 'var(--p700)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background .15s',
};
