# Snails Booking — Phase 3

The public-facing booking page. Clients visit this link to book their own appointments.

---

## How it works

Clients go through 4 simple steps:

1. **Service** — pick what they want (gel manicure, nail art, etc.)
2. **Date & time** — choose a date from the calendar, then pick a free slot
3. **Details** — name, phone, optional email and notes
4. **Confirm** — review everything, then submit

On submit it calls the Phase 1 API, which saves the booking and fires a confirmation email.

---

## Structure

```
snails-booking/
├── public/index.html
└── src/
    ├── index.js
    ├── index.css          ← global styles + design tokens
    ├── App.js             ← step orchestrator, all booking state
    ├── lib/
    │   ├── api.js         ← public API calls (no auth needed)
    │   └── utils.js       ← formatPrice, toDateString
    ├── components/
    │   └── UI.js          ← Spinner, StepBar, Card, Btn, Field, etc.
    └── pages/
        ├── StepService.js   ← step 1: service picker
        ├── StepDateTime.js  ← step 2: calendar + time slots
        ├── StepDetails.js   ← step 3: client details form
        ├── StepConfirm.js   ← step 4: summary before submit
        └── Success.js       ← confirmation screen
```

---

## Setup

```bash
# Make sure Phase 1 API is running first
cd snails-api && npm run dev

# Then in a new terminal:
cd snails-booking
cp .env.example .env   # default points to http://localhost:3001
npm install
npm start              # opens at http://localhost:3002
```

> Note: if port 3000 is taken by snails-admin, React will ask to use 3002 — say yes.

---

## Deploying to Vercel

Same as the admin dashboard:

1. Push to a GitHub repo (can be same repo, different folder, or separate repo)
2. Vercel → New Project → pick the repo
3. Set `REACT_APP_API_URL` to your Railway API URL
4. Deploy — Vercel gives you a URL like `book.snails.vercel.app`

This is the link your girlfriend shares with clients — put it in her Instagram bio, WhatsApp, everywhere.

---

## Sharing with clients

Once deployed, the URL works on any phone or computer. Your girlfriend can:
- Add it to her Instagram bio
- Send it via WhatsApp
- Put it on a business card with a QR code
- Add it to any Google/social profile

---

## Next: Phase 4

Phase 4 adds the email reminder system — 24 hours before every appointment, the client gets an automatic reminder. No more no-shows.
