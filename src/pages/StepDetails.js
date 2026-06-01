import { useState } from 'react';
import { Field, FieldArea } from '../components/UI';
import { lookupClient } from '../lib/api';

export default function StepDetails({ form, onChange, errors }) {
  const set = key => e => onChange({ ...form, [key]: e.target.value });
  const [prefilled, setPrefilled] = useState(false);

  async function handlePhoneBlur(e) {
    const phone = e.target.value.trim();
    if (phone.length < 5) return;
    const client = await lookupClient(phone);
    if (client) {
      onChange({
        ...form,
        phone,
        name:  form.name  || client.name  || '',
        email: form.email || client.email || '',
      });
      setPrefilled(true);
      setTimeout(() => setPrefilled(false), 3000);
    }
  }

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--p800)', marginBottom: 4 }}>
        Your details
      </h2>
      <p style={{ fontSize: 14, color: 'var(--p600)', marginBottom: 24 }}>
        So we know who's coming ✦
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field
          label="Phone number *"
          placeholder="+381 60 123 4567"
          type="tel"
          value={form.phone}
          onChange={set('phone')}
          onBlur={handlePhoneBlur}
          error={errors?.phone}
          autoComplete="tel"
        />
        <Field
          label="Your name *"
          placeholder="Sofia Martins"
          value={form.name}
          onChange={set('name')}
          error={errors?.name}
          autoComplete="name"
        />
        {prefilled && (
          <p style={{ fontSize: 12, color: '#2e7d32', background: '#e8f5e9', borderRadius: 8, padding: '6px 12px', margin: '-8px 0' }}>
            ✓ Welcome back! We filled in your details.
          </p>
        )}
        <Field
          label="Email address"
          placeholder="sofia@example.com"
          type="email"
          value={form.email}
          onChange={set('email')}
          error={errors?.email}
          autoComplete="email"
        />
        <FieldArea
          label="Anything we should know?"
          placeholder="Design ideas, allergies, nail length preferences…"
          value={form.notes}
          onChange={set('notes')}
        />
      </div>

      <p style={{ fontSize: 12, color: 'var(--p400)', marginTop: 16, lineHeight: 1.6 }}>
        Your details are only used to manage your booking. We'll send a confirmation if you provide an email.
      </p>
    </div>
  );
}
