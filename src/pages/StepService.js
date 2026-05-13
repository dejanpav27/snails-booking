export default function StepService({ services, selected, onSelect }) {
  // selected is now an array of service objects
  const selectedIds = selected.map(s => s.id);

  function toggle(svc) {
    if (selectedIds.includes(svc.id)) {
      onSelect(selected.filter(s => s.id !== svc.id));
    } else {
      onSelect([...selected, svc]);
    }
  }

  const groups = services.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  const totalPrice    = selected.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selected.reduce((sum, s) => sum + s.duration_mins, 0);

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Choose your services
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 22 }}>
        You can select multiple services — they'll be done back to back in one visit.
      </p>

      {Object.entries(groups).map(([category, svcs]) => (
        <div key={category} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--p500)', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 10 }}>
            {category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {svcs.map(svc => {
              const isSelected = selectedIds.includes(svc.id);
              return (
                <button
                  key={svc.id}
                  onClick={() => toggle(svc)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: isSelected ? 'var(--p100)' : '#fff',
                    border: `1.5px solid ${isSelected ? 'var(--p600)' : 'var(--p200)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all .15s', width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Checkbox */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 5,
                      border: `1.5px solid ${isSelected ? 'var(--p600)' : 'var(--p300)'}`,
                      background: isSelected ? 'var(--p600)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all .15s',
                    }}>
                      {isSelected && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--p800)' }}>{svc.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--p500)', marginTop: 2 }}>{svc.duration_mins} min</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--p700)' }}>
                    £{Number(svc.price).toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary bar */}
      {selected.length > 0 && (
        <div style={{
          position: 'sticky', bottom: 0,
          background: 'var(--p800)', color: 'var(--p100)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 8,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {selected.length} service{selected.length > 1 ? 's' : ''} selected
            </div>
            <div style={{ fontSize: 12, color: 'var(--p300)', marginTop: 2 }}>
              {totalDuration} min total
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            £{totalPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
