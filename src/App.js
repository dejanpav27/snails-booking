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

  const availabilityParams = selected.length > 0
    ? { serviceIds: selected.map(s => s.id).join(',') }
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9eef3',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 16px 48px',
      position: 'relative',
    }}>
      {/* Background orbs */}
      <div style={{ position:'fixed', top:-80, left:-80, width:320, height:320, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(180,120,140,.08)', filter:'blur(50px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', top:'40%', right:-100, width:200, height:350, borderRadius:'50%', background:'rgba(180,120,140,.05)', filter:'blur(60px)', pointerEvents:'none', zIndex:0 }} />

      {/* Header */}
      <div style={{ width:'100%', maxWidth:520, textAlign:'center', paddingTop:24, marginBottom:4, position:'relative', zIndex:1, animation:'slideUp .35s ease both' }}>
        <img src="/logo.png" alt="Snails — Nails by Sara Pudar" style={{ height:76, width:'auto', display:'block', margin:'0 auto' }} />
      </div>
      <div style={{ fontSize:12, color:'var(--p500)', marginBottom:18, position:'relative', zIndex:1 }}>✦</div>

      {/* Content */}
      <div style={{ width:'100%', maxWidth:520, position:'relative', zIndex:1 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><Spinner size={32} /></div>
        ) : error && !services.length ? (
          <div style={{ background:'rgba(255,255,255,.85)', borderRadius:20, padding:'32px 24px', textAlign:'center', fontSize:14, color:'var(--p600)', backdropFilter:'blur(10px)' }}>{error}</div>
        ) : done ? (
          <div style={{ background:'rgba(255,255,255,.88)', backdropFilter:'blur(12px)', borderRadius:22, padding:'28px', boxShadow:'0 8px 40px rgba(114,36,62,.1)', animation:'slideUp .35s ease both', border:'1px solid rgba(255,214,231,.5)' }}>
            <Success services={selected} slot={dateTime.slot} client={client} />
          </div>
        ) : (
          <>
            {/* Step bar */}
            <div style={{ background:'rgba(255,255,255,.65)', backdropFilter:'blur(8px)', borderRadius:16, padding:'14px 20px', marginBottom:12, boxShadow:'0 2px 12px rgba(114,36,62,.06)', border:'1px solid rgba(255,214,231,.4)', animation:'slideUp .35s ease both .05s' }}>
              <StepBar steps={STEPS} current={step} />
            </div>

            {/* Step card */}
            <div
              key={step}
              className={dir === 'right' ? 'slide-right' : 'slide-left'}
              style={{
                background:'rgba(255,255,255,.88)',
                backdropFilter:'blur(12px)',
                borderRadius:22,
                padding:'22px 22px 18px',
                boxShadow:'0 8px 40px rgba(114,36,62,.1)',
                marginBottom:14,
                border:'1px solid rgba(255,214,231,.5)',
              }}
            >
              {step === 0 && <StepService services={services} selected={selected} onSelect={setSelected} />}
              {step === 1 && availabilityParams && (
                <StepDateTime
                  serviceIds={availabilityParams.serviceIds}
                  selectedDate={dateTime.date}
                  selectedSlot={dateTime.slot}
                  onSelect={({ date, slot }) => setDateTime({ date, slot })}
                />
              )}
              {step === 2 && <StepDetails form={client} onChange={setClient} errors={errors} />}
              {step === 3 && <StepConfirm services={selected} slot={dateTime.slot} client={client} />}
            </div>

            {error && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12, padding:'10px 16px', fontSize:14, color:'#dc2626', marginBottom:12 }}>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display:'flex', gap:10 }}>
              {step > 0 && (
                <button onClick={back} style={{
                  flex:1, padding:'13px', fontSize:15, fontFamily:'inherit',
                  background:'rgba(255,255,255,.75)', backdropFilter:'blur(8px)',
                  border:'1.5px solid rgba(255,214,231,.9)', borderRadius:99,
                  color:'var(--p700)', cursor:'pointer',
                  transition:'background .18s, transform .1s',
                  boxShadow:'0 2px 8px rgba(114,36,62,.06)',
                }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.95)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.75)'}
                  onMouseDown={e => e.currentTarget.style.transform='scale(.97)'}
                  onMouseUp={e => e.currentTarget.style.transform=''}
                >← Back</button>
              )}
              <Btn
                onClick={step === STEPS.length - 1 ? submit : next}
                disabled={!canProceed}
                loading={submitting}
                style={{ flex: step > 0 ? 2 : 1 }}
              >
                {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue →'}
              </Btn>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign:'center', marginTop:24, position:'relative', zIndex:1 }}>
        <p style={{ fontSize:12, color:'var(--p700)', fontWeight:500 }}>Snails Nail Studio</p>
        <p style={{ fontSize:11, color:'var(--p500)', marginTop:3 }}>✦</p>
      </div>
    </div>
  );
}
