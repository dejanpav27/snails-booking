import { useState, useEffect } from 'react';
import { getServices, createBooking } from './lib/api';
import { StepBar, Btn, Spinner } from './components/UI';
import StepService  from './pages/StepService';
import StepDateTime from './pages/StepDateTime';
import StepDetails  from './pages/StepDetails';
import StepConfirm  from './pages/StepConfirm';
import Success      from './pages/Success';

const STEPS = ['Services', 'Date & time', 'Details', 'Confirm'];
const EMPTY_CLIENT = { name: '', phone: '', email: '', notes: '' };

export default function App() {
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
      .catch(() => setError('Could not load services. Please try again later.'))
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
    setDir('right');
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setDir('left');
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    setSubmitting(true); setError('');
    try {
      await createBooking({
        service_ids:  selected.map(s => s.id),
        booked_at:    dateTime.slot,
        client_notes: client.notes || null,
        client: {
          name:  client.name.trim(),
          phone: client.phone.trim(),
          email: client.email.trim() || null,
        },
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const canProceed = [
    selected.length > 0,
    !!dateTime.date && !!dateTime.slot,
    true,
    true,
  ][step];

  const serviceIds = selected.map(s => s.id).join(',');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9eef3',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 12px 80px',
      position: 'relative',
    }}>
      {/* Background orbs */}
      <div style={{ position:'fixed', top:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:-60, right:-60, width:260, height:260, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />

      {/* Header */}
      <div style={{ width:'100%', maxWidth:520, textAlign:'center', paddingTop:20, marginBottom:4, position:'relative', zIndex:1 }}>
        <img src="/logo.png" alt="Snails" style={{ height:64, width:'auto', display:'block', margin:'0 auto' }} />
      </div>
      <div style={{ fontSize:12, color:'var(--p500)', marginBottom:14, position:'relative', zIndex:1 }}>✦</div>

      {/* Content */}
      <div style={{ width:'100%', maxWidth:520, position:'relative', zIndex:1 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><Spinner size={32} /></div>
        ) : error && !services.length ? (
          <div style={{ background:'rgba(255,255,255,.85)', borderRadius:20, padding:'32px 20px', textAlign:'center', fontSize:14, color:'var(--p600)' }}>{error}</div>
        ) : done ? (
          <div style={{ background:'rgba(255,255,255,.9)', backdropFilter:'blur(12px)', borderRadius:20, padding:'24px 20px', boxShadow:'0 8px 40px rgba(114,36,62,.1)', border:'1px solid rgba(255,214,231,.5)' }}>
            <Success services={selected} slot={dateTime.slot} client={client} />
          </div>
        ) : (
          <>
            {/* Step bar */}
            <div style={{ background:'rgba(255,255,255,.65)', backdropFilter:'blur(8px)', borderRadius:14, padding:'12px 16px', marginBottom:10, border:'1px solid rgba(255,214,231,.4)' }}>
              <StepBar steps={STEPS} current={step} />
            </div>

            {/* Step card */}
            <div key={step} className={dir === 'right' ? 'slide-right' : 'slide-left'} style={{
              background:'rgba(255,255,255,.9)',
              backdropFilter:'blur(12px)',
              borderRadius:20,
              padding:'20px 18px 16px',
              boxShadow:'0 8px 40px rgba(114,36,62,.1)',
              marginBottom:12,
              border:'1px solid rgba(255,214,231,.5)',
            }}>
              {step === 0 && <StepService services={services} selected={selected} onSelect={setSelected} />}
              {step === 1 && selected.length > 0 && (
                <StepDateTime
                  serviceIds={serviceIds}
                  selectedDate={dateTime.date}
                  selectedSlot={dateTime.slot}
                  onSelect={({ date, slot }) => setDateTime({ date, slot })}
                />
              )}
              {step === 2 && <StepDetails form={client} onChange={setClient} errors={errors} />}
              {step === 3 && <StepConfirm services={selected} slot={dateTime.slot} client={client} />}
            </div>

            {error && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12, padding:'10px 14px', fontSize:14, color:'#dc2626', marginBottom:10 }}>
                {error}
              </div>
            )}

            {/* Buttons — fixed on mobile */}
            <div className="safe-bottom" style={{ display:'flex', gap:10 }}>
              {step > 0 && (
                <button onClick={back} style={{
                  flex:1, padding:'14px', fontSize:15, fontFamily:'inherit',
                  background:'rgba(255,255,255,.8)', backdropFilter:'blur(8px)',
                  border:'1.5px solid rgba(255,214,231,.9)', borderRadius:99,
                  color:'var(--p700)', cursor:'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  minHeight: 52,
                }}>← Back</button>
              )}
              <Btn
                onClick={step === STEPS.length - 1 ? submit : next}
                disabled={!canProceed}
                loading={submitting}
                style={{ flex: step > 0 ? 2 : 1, minHeight: 52 }}
              >
                {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue →'}
              </Btn>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign:'center', marginTop:20, position:'relative', zIndex:1 }}>
        <p style={{ fontSize:12, color:'var(--p700)', fontWeight:500 }}>Snails Nail Studio</p>
        <p style={{ fontSize:11, color:'var(--p500)', marginTop:3 }}>✦</p>
      </div>
    </div>
  );
}
