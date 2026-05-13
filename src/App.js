import { useState, useEffect } from 'react';
import { getServices, createBooking } from './lib/api';
import { StepBar, Card, Btn, PageLoader } from './components/UI';
import StepService  from './pages/StepService';
import StepDateTime from './pages/StepDateTime';
import StepDetails  from './pages/StepDetails';
import StepConfirm  from './pages/StepConfirm';
import Success      from './pages/Success';

const STEPS = ['Service', 'Date & time', 'Details', 'Confirm'];
const EMPTY_CLIENT = { name: '', phone: '', email: '', notes: '' };

export default function App() {
  const [step,       setStep]      = useState(0);
  const [services,   setServices]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]     = useState('');
  const [done,       setDone]      = useState(false);

  const [service,  setService]  = useState(null);
  const [dateTime, setDateTime] = useState({ date: null, slot: null });
  const [client,   setClient]   = useState(EMPTY_CLIENT);
  const [errors,   setErrors]   = useState({});
  const [booking,  setBooking]  = useState(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('Could not load services. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  function validateDetails() {
    const e = {};
    if (!client.name.trim())  e.name  = 'Please enter your name';
    if (!client.phone.trim()) e.phone = 'Please enter your phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && (!dateTime.date || !dateTime.slot)) return;
    if (step === 2 && !validateDetails()) return;
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    setSubmitting(true); setError('');
    try {
      const result = await createBooking({
        service_id:   service.id,
        booked_at:    dateTime.slot,
        client_notes: client.notes || null,
        client: {
          name:  client.name.trim(),
          phone: client.phone.trim(),
          email: client.email.trim() || null,
        },
      });
      setBooking(result.booking);
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const canProceed = [
    !!service,
    !!dateTime.date && !!dateTime.slot,
    true,
    true,
  ][step];

  if (loading) return (
    <div style={pageStyle}>
      <Header />
      <PageLoader />
    </div>
  );

  if (error && !services.length) return (
    <div style={pageStyle}>
      <Header />
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--p600)', fontSize: 14 }}>{error}</div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <Header />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 60px' }}>
        {done ? (
          <Card>
            <Success booking={booking} service={service} slot={dateTime.slot} client={client} />
          </Card>
        ) : (
          <>
            <StepBar steps={STEPS} current={step} />
            <Card style={{ marginBottom: 20 }}>
              {step === 0 && <StepService services={services} selected={service} onSelect={s => setService(s)} />}
              {step === 1 && <StepDateTime service={service} selectedDate={dateTime.date} selectedSlot={dateTime.slot} onSelect={({ date, slot }) => setDateTime({ date, slot })} />}
              {step === 2 && <StepDetails form={client} onChange={setClient} errors={errors} />}
              {step === 3 && <StepConfirm service={service} slot={dateTime.slot} client={client} />}
            </Card>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 14, color: '#dc2626', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {step > 0 && (
                <button onClick={back} style={{ flex: 1, padding: '13px', fontSize: 15, background: 'transparent', border: '1px solid var(--p200)', borderRadius: 'var(--radius-md)', color: 'var(--p700)', cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
              <Btn onClick={step === STEPS.length - 1 ? submit : next} disabled={!canProceed} loading={submitting} style={{ flex: step > 0 ? 2 : 1 }}>
                {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue →'}
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={{
      background: '#fff0f5',
      padding: '8px 20px',
      marginBottom: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src="/logo.png"
        alt="Snails — Nails by Sara Pudar"
        style={{ height: 80, width: 'auto', display: 'block' }}
      />
    </header>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'var(--p50)',
};
