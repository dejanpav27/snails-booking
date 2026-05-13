import { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek,
  addMonths, subMonths, format, isToday, isPast, isSameDay, parseISO,
} from 'date-fns';
import { getAvailability } from '../lib/api';
import { toDateString } from '../lib/utils';
import { Spinner } from '../components/UI';

export default function StepDateTime({ service, selectedDate, selectedSlot, onSelect }) {
  const [month,     setMonth]     = useState(new Date());
  const [date,      setDate]      = useState(selectedDate || null);
  const [slots,     setSlots]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [slot,      setSlot]      = useState(selectedSlot || null);

  // When date changes, load slots
  useEffect(() => {
    if (!date || !service) return;
    setSlots([]); setSlot(null);
    setLoading(true);
    getAvailability(toDateString(date), service.id)
      .then(d => setSlots(d.available_slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date, service]);

  // Notify parent when both date + slot chosen
  useEffect(() => {
    if (date && slot) onSelect({ date, slot });
  }, [date, slot]); // eslint-disable-line

  // Calendar grid
  const monthStart = startOfMonth(month);
  const monthEnd   = endOfMonth(month);
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd    = endOfWeek(monthEnd,   { weekStartsOn: 1 });
  const allDays    = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function pickDate(d) {
    setDate(d);
    setSlot(null);
  }

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Pick a date & time
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 22 }}>
        {service.name} · {service.duration_mins} min
      </p>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button onClick={() => setMonth(m => subMonths(m, 1))} style={navBtn}>‹</button>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--p800)' }}>
          {format(month, 'MMMM yyyy')}
        </span>
        <button onClick={() => setMonth(m => addMonths(m, 1))} style={navBtn}>›</button>
      </div>

      {/* Day names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--p400)', padding: '4px 0', fontWeight: 500 }}>{d}</div>
        ))}
      </div>

      {/* Calendar days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 22 }}>
        {allDays.map(day => {
          const inMonth  = day.getMonth() === month.getMonth();
          const past     = isPast(day) && !isToday(day);
          const selected = date && isSameDay(day, date);
          const today    = isToday(day);
          const disabled = past || !inMonth;

          return (
            <button
              key={day.toString()}
              disabled={disabled}
              onClick={() => pickDate(day)}
              style={{
                aspectRatio: '1',
                border: selected ? '2px solid var(--p600)' : '1.5px solid transparent',
                borderRadius: 'var(--radius-md)',
                background: selected ? 'var(--p600)'
                  : today ? 'var(--p100)'
                  : 'transparent',
                color: selected ? 'var(--p100)'
                  : disabled ? 'var(--p200)'
                  : 'var(--p800)',
                fontSize: 13,
                fontWeight: today ? 500 : 400,
                cursor: disabled ? 'default' : 'pointer',
                transition: 'all .12s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {date && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--p700)', marginBottom: 10 }}>
            Available times — {format(date, 'EEE d MMM')}
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 13, color: 'var(--p400)' }}>
              No slots available on this day — try another date
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {slots.map(s => {
                const selected = slot === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    style={{
                      padding: '10px 4px',
                      fontSize: 13,
                      textAlign: 'center',
                      border: `1.5px solid ${selected ? 'var(--p600)' : 'var(--p200)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: selected ? 'var(--p600)' : 'var(--white)',
                      color: selected ? 'var(--p100)' : 'var(--p700)',
                      fontWeight: selected ? 500 : 400,
                      cursor: 'pointer',
                      transition: 'all .12s',
                    }}
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
  borderRadius: 'var(--radius-md)', width: 34, height: 34,
  fontSize: 18, color: 'var(--p700)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
