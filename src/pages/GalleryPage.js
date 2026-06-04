import { useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function GalleryPage({ onBook }) {
  const [photos,   setPhotos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/gallery`)
      .then(r => r.json())
      .then(setPhotos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const usedCats = ['All', ...new Set(photos.map(p => p.category).filter(Boolean))];
  const filtered  = filter === 'All' ? photos : photos.filter(p => p.category === filter);

  return (
    /* No fade-up animation — causes white flash on iOS */
    <div>
      <h2 style={{ fontSize:18, fontWeight:500, color:'var(--p800)', marginBottom:3 }}>Sara's work</h2>
      <p style={{ fontSize:13, color:'var(--p600)', marginBottom:16 }}>Browse designs before you book ✦</p>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
        {usedCats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            fontSize:11, fontWeight:500, padding:'5px 14px',
            borderRadius:99, border:`1.5px solid ${filter === cat ? 'var(--p600)' : 'var(--p200)'}`,
            background: filter === cat ? 'var(--p600)' : '#fff',
            color: filter === cat ? '#fff' : 'var(--p700)',
            cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit',
            transition:'all .15s', WebkitTapHighlightColor:'transparent',
          }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .75s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="var(--p300)" strokeWidth="2.5"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--p600)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--p400)', fontSize:13 }}>No photos yet</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => setLightbox(p)} style={{
              borderRadius:10, overflow:'hidden', position:'relative',
              aspectRatio:'1', cursor:'pointer',
            }}>
              <img
                src={p.image_url}
                alt={p.caption || p.category || ''}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                loading="lazy"
              />
              {p.category && (
                <div style={{ position:'absolute', bottom:4, left:4, background:'rgba(114,36,62,.7)', color:'#ffd6e7', fontSize:9, fontWeight:500, padding:'2px 6px', borderRadius:6 }}>
                  {p.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={onBook} style={{
        width:'100%', marginTop:20, padding:'14px',
        background:'var(--p600)', color:'#fff', border:'none',
        borderRadius:99, fontSize:15, fontWeight:500,
        cursor:'pointer', fontFamily:'inherit',
        boxShadow:'0 4px 14px rgba(212,83,126,.3)',
        WebkitTapHighlightColor:'transparent',
      }}>
        Book an appointment →
      </button>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position:'fixed', inset:0,
          background:'rgba(0,0,0,.85)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:9999, padding:20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:400, width:'100%', position:'relative' }}>
            <img src={lightbox.image_url} alt={lightbox.caption || ''} style={{ width:'100%', borderRadius:16, display:'block' }} />
            {(lightbox.caption || lightbox.category) && (
              <div style={{ background:'rgba(0,0,0,.6)', color:'#fff', padding:'8px 14px', borderRadius:'0 0 16px 16px', fontSize:13 }}>
                {lightbox.caption || lightbox.category}
              </div>
            )}
            <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:-12, right:-12, width:32, height:32, borderRadius:'50%', background:'#fff', border:'none', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
