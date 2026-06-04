import { useState, useEffect } from 'react';
import { getServices, createBooking } from './lib/api';
import { StepBar, Btn, Spinner } from './components/UI';
import StepService  from './pages/StepService';
import StepDateTime from './pages/StepDateTime';
import StepDetails  from './pages/StepDetails';
import StepConfirm  from './pages/StepConfirm';
import Success      from './pages/Success';
import GalleryPage  from './pages/GalleryPage';

const STEPS = ['Services', 'Date & time', 'Details', 'Confirm'];
const EMPTY_CLIENT = { name: '', phone: '', email: '', notes: '' };

export default function App() {
  const [view,       setView]      = useState('book');
  const [step,       setStep]      = useState(0);
  const [dir,        setDir]       = useState('right');
  const [services,   setServices]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]     = useState('');
  const [done,       setDone]      = useState(false);
  const [selected,   setSelected]  = useState([]);
  const [dateTime,   setDateTime]  = useState({ date: null, slot: null });
  const [client,     setClient]    = useState(EMPTY_CLIENT);
  const [errors,     setErrors]    = useState({});

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('Could not load services.'))
      .finally(() => setLoading(false));
  }, []);

  function validateDetails() {
    const e = {};
    if (!client.name.trim()) e.name = 'Please enter your name';
    if (!client.phone.trim()) {
      e.phone = 'Please enter your phone number';
    } else if (!/^[+\d\s\-().]{7,20}$/.test(client.phone.trim())) {
      e.phone = 'Please enter a valid phone number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && (!dateTime.date || !dateTime.slot)) return;
    if (step === 2 && !validateDetails()) return;
    setDir('right'); setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setDir('left'); setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    setSubmitting(true); setError('');
    try {
      await createBooking({
        service_ids:  selected.map(s => s.id),
        booked_at:    dateTime.slot,
        client_notes: client.notes || null,
        client: { name: client.name.trim(), phone: client.phone.trim(), email: client.email.trim() || null },
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  }

  const canProceed = [selected.length > 0, !!dateTime.date && !!dateTime.slot, true, true][step];
  const serviceIds = selected.map(s => s.id).join(',');

  const cardStyle = {
    background: '#fff',
    borderRadius: 20,
    padding: '20px 18px',
    boxShadow: '0 8px 40px rgba(114,36,62,.1)',
    border: '1px solid rgba(255,214,231,.5)',
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f9eef3', display:'flex', flexDirection:'column', alignItems:'center', padding:'0 12px 80px', position:'relative' }}>
      <div style={{ position:'fixed', top:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:-60, right:-60, width:260, height:260, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />

      <div style={{ width:'100%', maxWidth:520, textAlign:'center', paddingTop:20, marginBottom:4, position:'relative', zIndex:1 }}>
        <img src="/logo.png" alt="Snails" style={{ height:64, width:'auto', display:'block', margin:'0 auto' }} />
      </div>
      <div style={{ fontSize:12, color:'var(--p500)', marginBottom:10, position:'relative', zIndex:1 }}>✦</div>

      {/* Tabs */}
      {!done && (
        <div style={{ display:'flex', background:'rgba(255,255,255,.9)', borderRadius:99, padding:3, gap:3, marginBottom:14, border:'1px solid rgba(255,214,231,.6)', position:'relative', zIndex:1 }}>
          {[['book','Book'],['gallery','Gallery']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:'7px 20px', fontSize:13, fontWeight:500, border:'none',
              borderRadius:99, cursor:'pointer', fontFamily:'inherit',
              background: view === v ? 'var(--p600)' : 'transparent',
              color: view === v ? '#fff' : 'var(--p700)',
              transition:'all .18s', WebkitTapHighlightColor:'transparent',
            }}>{label}</button>
          ))}
        </div>
      )}

      <div style={{ width:'100%', maxWidth:520, position:'relative', zIndex:1 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><Spinner size={32} /></div>
        ) : view === 'gallery' ? (
          <div style={cardStyle}>
            <GalleryPage onBook={() => setView('book')} />
          </div>
        ) : done ? (
          <div style={cardStyle}>
            <Success services={selected} slot={dateTime.slot} client={client} />
          </div>
        ) : (
          <>
            <div style={{ background:'rgba(255,255,255,.9)', borderRadius:14, padding:'12px 16px', marginBottom:10, border:'1px solid rgba(255,214,231,.4)' }}>
              <StepBar steps={STEPS} current={step} />
            </div>

            <div key={step} className={dir === 'right' ? 'slide-right' : 'slide-left'} style={{ ...cardStyle, marginBottom:12, padding:'20px 18px 16px' }}>
              {step === 0 && <StepService services={services} selected={selected} onSelect={setSelected} />}
              {step === 1 && selected.length > 0 && (
                <StepDateTime serviceIds={serviceIds} selectedDate={dateTime.date} selectedSlot={dateTime.slot} onSelect={({ date, slot }) => setDateTime({ date, slot })} />
              )}
              {step === 2 && <StepDetails form={client} onChange={setClient} errors={errors} />}
              {step === 3 && <StepConfirm services={selected} slot={dateTime.slot} client={client} />}
            </div>

            {error && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12, padding:'10px 14px', fontSize:14, color:'#dc2626', marginBottom:10 }}>{error}</div>}

            <div style={{ display:'flex', gap:10 }}>
              {step > 0 && (
                <button onClick={back} style={{ flex:1, padding:'14px', fontSize:15, fontFamily:'inherit', background:'rgba(255,255,255,.9)', border:'1.5px solid rgba(255,214,231,.9)', borderRadius:99, color:'var(--p700)', cursor:'pointer', minHeight:52, WebkitTapHighlightColor:'transparent' }}>← Back</button>
              )}
              <Btn onClick={step === STEPS.length - 1 ? submit : next} disabled={!canProceed} loading={submitting} style={{ flex: step > 0 ? 2 : 1, minHeight:52 }}>
                {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue →'}
              </Btn>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign:'center', marginTop:20, position:'relative', zIndex:1 }}>
        <p style={{ fontSize:12, color:'var(--p700)', fontWeight:500 }}>Snails Nail Studio</p>
        <p style={{ fontSize:11, color:'var(--p500)', marginTop:3 }}>✦</p>
      </div>
    </div>
  );
}
