# Knowledge Hub — Next.js starter

A responsive learning portal starter with a public resource library, user registration/login, learner dashboard, admin content manager, and interactive 3D learning scene.

## Features
- Next.js App Router + TypeScript
- Responsive landing page, classes and notes/resource pages
- Registration and login using bcrypt password hashes and an HTTP-only signed JWT cookie
- Prisma + SQLite database
- Seeded admin account and sample resources
- Admin-only create, publish/unpublish and delete resource actions
- Interactive 3D object powered by React Three Fiber / Drei
- Zod validation on auth and resource APIs

## Requirements
- Node.js 20.9 or newer (recommended LTS)
- npm

## Run on Windows / VS Code
1. Extract this ZIP and open the `knowledge-hub` folder in VS Code.
2. Open Terminal → New Terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` (PowerShell):
   ```powershell
   Copy-Item .env.example .env
   ```
5. Create/update the SQLite database and generate Prisma client:
   ```bash
   npx prisma db push
   ```
6. Seed the administrator and sample content:
   ```bash
   npm run db:seed
   ```
7. Start the website:
   ```bash
   npm run dev
   ```
8. Open http://localhost:3000

## Demo admin
- Email: `admin@knowledgehub.local`
- Password: `ChangeMe123!`

**Change the demo password and JWT_SECRET in `.env` before using this outside your local machine.** Never deploy with the demo credentials.

## Routes
- `/` — home
- `/classes` — classes
- `/notes` — notes and resources
- `/learn/3d` — interactive 3D scene
- `/register` and `/login` — authentication
- `/dashboard` — signed-in learner dashboard
- `/admin` — admin content management

## Adding classes / notes
Sign in with the admin account, open `/admin`, and create a resource. You can paste a trusted hosted URL or upload a supported file (PDF, MP4/WebM/MOV, common images, PowerPoint, Word, or TXT; up to 100 MB). Local uploads are saved in `public/uploads`; this is suitable for local development, not serverless production hosting. For production, use private cloud object storage and access-controlled download URLs. Video transcoding/streaming, payment, email verification, and password reset are not included.

## Production checklist
- Set a long random `JWT_SECRET`.
- Replace SQLite with a managed production database if deploying to serverless hosting.
- Add rate limiting, email verification, password reset, CSRF/origin protection and audit logs.
- Configure cloud object storage for uploaded notes/videos; enforce file size/type checks and access control.
- Review security headers, backups, privacy policy and terms.


## Cashfree + Razorpay payments (sandbox first)

1. Copy `.env.example` to `.env` in the project root and fill `DATABASE_URL`, a long random `JWT_SECRET`, `APP_URL=http://localhost:3000`, and your **test/sandbox** gateway credentials. Never commit `.env` or expose secret keys in client code.
2. Install dependencies: `npm install`
3. Update SQLite schema: `npx prisma db push`
4. Seed demo data if needed: `npm run db:seed`
5. Start the app: `npm run dev`
6. Sign in, open Classes, then choose **Enroll / Unlock course**. The sample resource price defaults to ₹499; set each class's `Resource.price` in the database to the intended INR amount before testing.

### Environment variables
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Razorpay test-mode keys.
- `CASHFREE_CLIENT_ID` and `CASHFREE_CLIENT_SECRET`: Cashfree sandbox credentials.
- `CASHFREE_ENV=sandbox` until you deliberately configure production.
- `PAYMENT_CUSTOMER_PHONE`: valid test customer phone accepted by your Cashfree sandbox setup.

Payment order creation happens on the server. Razorpay verification checks the HMAC signature and confirms the payment is captured for the expected amount/order. Cashfree verification checks the order status and amount through its server API. Enrollment is written only after verification succeeds. For production, configure HTTPS, verified provider webhooks, logging/reconciliation, rate limits, and test end-to-end with each gateway's official dashboard.
