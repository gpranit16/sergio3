# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies
Open terminal in VS Code and run:
```bash
npm install
```

## Step 2: Set Up Supabase Database

1. Go to: https://fqsntjiyftkkenvekato.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase-schema.sql`
5. Paste and click "Run"
6. You should see "Success. No rows returned"

## Step 3: Verify Environment Variables

Check that `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://fqsntjiyftkkenvekato.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxc250aml5ZnRra2VudmVrYXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTY4MzgsImV4cCI6MjA0ODUzMjgzOH0.j1bvt2LQ2w8EW1zKdBzLjsV7p5m-2TXzZPQTJ2U0j3Q
OPENROUTER_API_KEY=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
```

## Step 4: Run Development Server
```bash
npm run dev
```

## Step 5: Open in Browser
Navigate to: http://localhost:3000

## ✅ Testing the Application

### Test Case 1: Approved Application
- **Name**: John Doe
- **Age**: 35
- **Employment**: Salaried
- **Monthly Income**: 80000
- **Existing EMI**: 10000
- **Loan Type**: Personal Loan
- **Loan Amount**: 500000
- **Tenure**: 24 months

**Expected**: ✅ Approved (High income, low EMI burden)

### Test Case 2: Pending Application
- **Name**: Jane Smith
- **Age**: 28
- **Employment**: Self Employed
- **Monthly Income**: 35000
- **Existing EMI**: 12000
- **Loan Type**: Car Loan
- **Loan Amount**: 400000
- **Tenure**: 36 months

**Expected**: ⏱ Pending (Moderate risk profile)

### Test Case 3: Rejected Application
- **Name**: Bob Wilson
- **Age**: 65
- **Employment**: Self Employed
- **Monthly Income**: 25000
- **Existing EMI**: 18000
- **Loan Type**: Home Loan
- **Loan Amount**: 2000000
- **Tenure**: 120 months

**Expected**: ❌ Rejected (Age >60 with non-salaried employment)

## 🎨 UI Features to Explore

1. **Home Page** (`/`)
   - Water blob animations
   - Gradient text effects
   - Floating animations

2. **Application Form** (`/apply`)
   - Glassmorphism cards
   - Neon border focus effects
   - Real-time validation

3. **Result Page** (`/result?id=xxx`)
   - Animated decision badge
   - Circular risk score display
   - AI-generated explanation

4. **Dashboard** (`/dashboard`)
   - Statistics cards
   - Sortable table
   - Filter by decision status

## 🐛 Troubleshooting

### Issue: "Failed to save application"
- **Solution**: Make sure you ran the SQL schema in Supabase

### Issue: "Failed to get explanation"
- **Solution**: Check that OPENROUTER_API_KEY is set correctly in `.env.local`

### Issue: CSS not loading
- **Solution**: Restart the dev server (`Ctrl+C` then `npm run dev`)

### Issue: Port 3000 already in use
- **Solution**: Run on different port: `npm run dev -- -p 3001`

## 📚 Next Steps

1. Submit a few test applications
2. View them in the dashboard
3. Explore the risk engine logic in `lib/riskEngine.ts`
4. Customize the UI colors in `tailwind.config.ts`
5. Add more loan types or validation rules

## 🎯 Project Structure Overview

```
Key Files:
├── app/page.tsx              → Home page (Hero section)
├── app/apply/page.tsx        → Application form
├── app/result/page.tsx       → Decision results
├── app/dashboard/page.tsx    → Admin dashboard
├── app/api/applications/route.ts → API endpoints
├── lib/riskEngine.ts         → Risk scoring logic
├── lib/openrouter.ts         → AI explanation
└── components/               → Reusable UI components
```

## 🚀 Ready to Deploy?

### Deploy to Vercel (Free)
```bash
npm install -g vercel
vercel
```

Then add environment variables in Vercel dashboard.

---

**Happy Coding! 🎉**

For questions, check README.md or the code comments.
