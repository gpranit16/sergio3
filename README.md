# 🏦 Agentic Lending System

A production-ready Next.js 14 web application that functions as an intelligent loan officer, powered by AI and real-time risk assessment.

## ✨ Features

- **Instant Loan Decisions**: Deterministic risk engine evaluates applications in real-time
- **AI Explanations**: DeepSeek R1 generates natural language explanations for every decision
- **Beautiful UI**: Glassmorphism design with water blob animations and smooth transitions
- **Real-time Dashboard**: Track all applications with filterable statistics
- **Risk Scoring**: Transparent 0-100 risk score with detailed breakdown
- **Supabase Integration**: Secure database storage with row-level security

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom animations
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **AI Model**: DeepSeek R1 (via OpenRouter API)
- **Language**: TypeScript
- **Validation**: Zod

## 📦 Installation

1. **Clone and install dependencies**:
   ```bash
   cd c:\loan
   npm install
   ```

2. **Set up Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase-schema.sql`
   - This will create the `applications` table with proper indexes and RLS policies

3. **Environment variables**:
   The `.env.local` file is already configured with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://fqsntjiyftkkenvekato.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENROUTER_API_KEY=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
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Application Flow

1. **User submits application** via `/apply` form
2. **Risk engine evaluates** using deterministic rules
3. **AI generates explanation** via DeepSeek R1
4. **Data saved to Supabase** with full audit trail
5. **Results displayed** on `/result` page
6. **Dashboard tracks** all applications at `/dashboard`

## 🧠 Risk Engine Logic

### Hard Rejections
- Age < 18
- Monthly income < ₹15,000
- EMI ratio > 70%
- Loan > 4× annual income
- Student with income < ₹15,000
- Age > 60 with non-salaried employment

### Risk Score Factors (Base: 100)
- **Age**: Young (<21) -25, Senior (50-60) -10, >60 -30
- **Income**: <₹20k -30, ₹20-40k -10, >₹60k +10
- **EMI Ratio**: <30% +5, 30-40% -10, 40-70% -25
- **Loan/Income**: <1.5 +5, 1.5-2 -10, 2-3 -20, 3-4 -30
- **Employment**: Salaried +10, Self-employed -10, Student -30

### Decision Logic
- **Approved**: Score ≥ 70
- **Pending**: 40 ≤ Score < 70
- **Rejected**: Score < 40 or hard rejection triggered

## 📁 Project Structure

```
c:\loan\
├── app/
│   ├── api/
│   │   └── applications/
│   │       └── route.ts          # API endpoints
│   ├── apply/
│   │   └── page.tsx              # Application form
│   ├── dashboard/
│   │   └── page.tsx              # Admin dashboard
│   ├── result/
│   │   └── page.tsx              # Decision result page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── DecisionBadge.tsx         # Status badge component
│   ├── FormField.tsx             # Form input component
│   ├── GlassCard.tsx             # Glass morphism card
│   ├── GradientButton.tsx        # Animated button
│   ├── ScoreCircle.tsx           # Circular score display
│   └── WaterBlobBackground.tsx   # Animated background
├── lib/
│   ├── openrouter.ts             # DeepSeek AI integration
│   ├── riskEngine.ts             # Risk assessment logic
│   ├── supabase.ts               # Database client
│   └── validation.ts             # Zod schemas
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
└── supabase-schema.sql           # Database schema
```

## 🎨 UI Components

### GlassCard
Glassmorphism card with backdrop blur and neon borders

### WaterBlobBackground
Animated gradient blobs with smooth floating motion

### ScoreCircle
Circular progress indicator with color-coded risk levels

### DecisionBadge
Animated status badge with icons and glow effects

### GradientButton
Button with gradient background and magnetic hover effect

### FormField
Custom input with focus animations and validation

## 🔒 Security Notes

- Supabase RLS (Row Level Security) is enabled
- API keys are server-side only (except Supabase anon key)
- Input validation using Zod schemas
- All database queries use parameterized statements

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`

## 📊 API Endpoints

### POST /api/applications
Submit a new loan application
```typescript
{
  name: string;
  age: number;
  employment_type: 'salaried' | 'self_employed' | 'student';
  monthly_income: number;
  existing_emi: number;
  loan_type: string;
  loan_amount: number;
  tenure_months: number;
}
```

### GET /api/applications
Fetch all applications or specific one by ID
```
/api/applications              # Get all
/api/applications?id=<uuid>    # Get specific
```

## 🎨 Color Palette

- **Background**: `#0a0a0f`
- **Neon Purple**: `#a855f7`
- **Neon Blue**: `#3b82f6`
- **Neon Pink**: `#ec4899`
- **Glass Border**: `rgba(255, 255, 255, 0.1)`
- **Glass Background**: `rgba(255, 255, 255, 0.05)`

## 🤝 Contributing

This is a complete production implementation. Feel free to extend with:
- User authentication
- Document upload
- Email notifications
- Advanced analytics
- Chat-based intake (Phase 2)

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🙏 Credits

- UI inspiration: React Bits
- AI Model: DeepSeek R1
- Database: Supabase
- Framework: Next.js by Vercel

---

**Built with ❤️ using Next.js 14, TypeScript, and AI**
