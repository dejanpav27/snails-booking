import { useRef } from 'react';

export default function StepService({ services, selected, onSelect }) {
  const selectedIds = selected.map(s => s.id);
  const btnRefs = useRef({});

  function toggle(svc) {
    const el = btnRefs.current[svc.id];
    if (el && !selectedIds.includes(svc.id)) {
      el.classList.remove('service-selected');
      void el.offsetWidth;
      el.classList.add('service-selected');
      setTimeout(() => el.classList.remove('service-selected'), 350);
    }
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
      <h2 style={{ fontSize:18, fontWeight:500, color:'var(--p800)', marginBottom:3 }}>Choose your services</h2>
      <p style={{ fontSize:13, color:'var(--p600)', marginBottom:18 }}>
        Select one or more — done back to back in one visit.
      </p>

      {Object.entries(groups).map(([category, svcs]) => (
        <div key={category} style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:600, color:'var(--p500)', textTransform:'uppercase', letterSpacing:.8, marginBottom:8 }}>
            {category}
          </div>
          <div className="service-grid" style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {svcs.map(svc => {
              const isSelected = selectedIds.includes(svc.id);
              return (
                <button
                  key={svc.id}
                  ref={el => btnRefs.current[svc.id] = el}
                  onClick={() => toggle(svc)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'14px 16px', width:'100%',
                    background: isSelected ? 'var(--p100)' : '#fff',
                    border:`1.5px solid ${isSelected ? 'var(--p600)' : 'var(--p200)'}`,
                    borderRadius:'var(--radius-md)',
                    cursor:'pointer', textAlign:'left',
                    transition:'all .15s',
                    boxShadow: isSelected ? '0 0 0 3px rgba(212,83,126,.12)' : 'none',
                    position:'relative', overflow:'hidden',
                    WebkitTapHighlightColor: 'transparent',
                    fontFamily:'inherit',
                  }}
                >
                  {svc.image_url && (
                    <div style={{
                      position:'absolute', inset:0,
                      backgroundImage:`url(${svc.image_url})`,
                      backgroundSize:'cover', backgroundPosition:'center',
                      opacity: isSelected ? .60 : .50,
                      transition:'opacity .2s',
                      pointerEvents:'none',
                    }} />
                  )}

                  <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative', zIndex:1 }}>
                    <div style={{
                      width:22, height:22, borderRadius:6, flexShrink:0,
                      border:`1.5px solid ${isSelected ? 'var(--p600)' : 'var(--p300)'}`,
                      background: isSelected ? 'var(--p600)' : 'rgba(255,255,255,.8)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .15s',
                    }}>
                      {isSelected && <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--p800)', textShadow:'0 1px 3px rgba(255,255,255,.8)' }}>{svc.name}</div>
                      <div style={{ fontSize:11, color:'var(--p700)', marginTop:2 }}>{svc.duration_mins} min</div>
                    </div>
                  </div>
                  <span style={{ fontSize:15, fontWeight:600, color:'var(--p800)', position:'relative', zIndex:1, textShadow:'0 1px 3px rgba(255,255,255,.8)' }}>
                    {Number(svc.price).toFixed(0)} RSD
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <div className="scale-in" style={{
          position:'sticky', bottom:0,
          background:'var(--p800)', color:'var(--p100)',
          borderRadius:'var(--radius-md)', padding:'12px 16px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          marginTop:8,
        }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500 }}>
              {selected.length} service{selected.length > 1 ? 's' : ''} selected
            </div>
            <div style={{ fontSize:11, color:'var(--p300)', marginTop:2 }}>{totalDuration} min total</div>
          </div>
          <div style={{ fontSize:16, fontWeight:500 }}>{totalPrice.toFixed(0)} RSD</div>
        </div>
      )}
    </div>
  );
}
