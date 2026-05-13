import { formatPrice } from '../lib/utils';

export default function StepService({ services, selected, onSelect }) {
  // Group by category
  const groups = services.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Choose your service
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 22 }}>
        What would you like today?
      </p>

      {Object.entries(groups).map(([category, svcs]) => (
        <div key={category} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 500, color: 'var(--p500)',
            textTransform: 'uppercase', letterSpacing: .8,
            marginBottom: 10,
          }}>
            {category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {svcs.map(svc => {
              const isSelected = selected?.id === svc.id;
              return (
                <button
                  key={svc.id}
                  onClick={() => onSelect(svc)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: isSelected ? 'var(--p100)' : 'var(--white)',
                    border: `1.5px solid ${isSelected ? 'var(--p600)' : 'var(--p200)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .15s',
                    width: '100%',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--p800)' }}>{svc.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--p500)', marginTop: 2 }}>
                      {svc.duration_mins} min
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--p700)' }}>
                      {formatPrice(svc.price)}
                    </span>
                    {isSelected && (
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--p600)', color: 'var(--p100)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, flexShrink: 0,
                      }}>✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
