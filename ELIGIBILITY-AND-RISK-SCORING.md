# Loan Eligibility & Risk Scoring System

## Overview

This document describes the complete loan eligibility criteria and risk scoring methodology used by the Agentic Lending System. The scoring model is an **additive point-based system** where applicants earn points across five categories, totaling a maximum of **100 points**.

---

## 1. Scoring Model Summary

| Component | Maximum Points | Weight |
|-----------|----------------|--------|
| **Income Score** | 35 | 35% |
| **Employment Score** | 20 | 20% |
| **Debt-to-Income (DTI) Score** | 25 | 25% |
| **Age Score** | 10 | 10% |
| **Loan-to-Income (LTI) Score** | 10 | 10% |
| **TOTAL** | **100** | **100%** |

### Formula

```
Total Score = Income Score + Employment Score + DTI Score + Age Score + LTI Score
```

---

## 2. Decision Matrix

| Score Range | Decision | Description |
|-------------|----------|-------------|
| **85 - 100** | ✅ **Auto Approve** | Excellent profile - loan automatically approved |
| **60 - 84** | ⏳ **Manual Review** | Good profile - requires human verification |
| **0 - 59** | ❌ **Auto Reject** | High risk - loan automatically rejected |

---

## 3. Eligibility Hard Rules

Before scoring begins, applicants must pass these mandatory eligibility checks. Failure on any hard rule results in **immediate rejection** with a score of 0.

| Rule | Requirement | Consequence |
|------|-------------|-------------|
| **Age** | Must be 21 - 60 years | Age < 21 or > 60 → **Direct Rejection** |
| **Minimum Income** | Monthly income ≥ ₹20,000 | Income < ₹20,000 → **Direct Rejection** |
| **Employment Type** | Salaried or Self-Employed | Other types → **Direct Rejection** |
| **Debt-to-Income Ratio** | DTI must be ≤ 50% | DTI > 50% → **Direct Rejection** |

### Required Documents

All of the following documents are mandatory for application processing:

| Document | Purpose |
|----------|---------|
| **Aadhaar Card** | Identity & Address verification |
| **PAN Card** | Tax identity verification |
| **Salary Slip** | Income verification (last 3 months) |
| **Bank Statement** | Financial history (last 6 months) |
| **Selfie Photo** | Face verification against Aadhaar |

---

## 4. Detailed Scoring Logic

### 4.1 Income Score (Maximum: 35 Points)

Based on monthly income in Indian Rupees (₹):

| Monthly Income | Points | Category |
|----------------|--------|----------|
| ≥ ₹1,00,000 | **35** | Excellent |
| ≥ ₹60,000 | **30** | Very Good |
| ≥ ₹40,000 | **24** | Good |
| ≥ ₹25,000 | **18** | Moderate |
| ≥ ₹20,000 | **12** | Minimum |
| < ₹20,000 | **0** | Ineligible (Hard Reject) |

---

### 4.2 Employment Score (Maximum: 20 Points)

| Employment Type | Points | Rationale |
|-----------------|--------|-----------|
| **Salaried** | **20** | Stable, predictable income |
| **Self-Employed** | **15** | Variable income, higher risk |
| **Other** | **0** | Ineligible (Hard Reject) |

---

### 4.3 Debt-to-Income (DTI) Score (Maximum: 25 Points)

**Formula:** `DTI Ratio = Existing EMI ÷ Monthly Income`

| DTI Ratio | Points | Risk Level |
|-----------|--------|------------|
| ≤ 10% | **25** | Excellent |
| 10% - 20% | **20** | Very Good |
| 20% - 30% | **15** | Good |
| 30% - 40% | **10** | Acceptable |
| 40% - 50% | **5** | Risky |
| > 50% | **0** | **Hard Reject** |

> ⚠️ **Important:** DTI > 50% triggers immediate rejection regardless of other scores.

---

### 4.4 Age Score (Maximum: 10 Points)

| Age Range | Points | Category |
|-----------|--------|----------|
| 25 - 45 years | **10** | Prime earning years |
| 21 - 24 years | **8** | Early career |
| 46 - 55 years | **6** | Late career |
| 56 - 60 years | **3** | Near retirement |
| < 21 or > 60 | **0** | **Hard Reject** |

---

### 4.5 Loan-to-Income (LTI) Ratio Score (Maximum: 10 Points)

**Formula:** `LTI Ratio = Loan Amount ÷ (Monthly Income × Tenure in Months)`

| LTI Ratio | Points | Borrowing Level |
|-----------|--------|-----------------|
| ≤ 0.3 | **10** | Conservative |
| 0.3 - 0.5 | **7** | Moderate |
| 0.5 - 0.7 | **4** | Aggressive |
| > 0.7 | **0** | Over-leveraged |

---

## 5. Scoring Examples

### Example 1: ✅ Auto Approve Case

**Applicant Profile:**
- Age: 32 years
- Monthly Income: ₹85,000
- Employment: Salaried
- Existing EMI: ₹5,000
- Loan Amount: ₹5,00,000
- Tenure: 36 months

**Calculation:**

| Component | Calculation | Score |
|-----------|-------------|-------|
| Income | ₹85,000 (≥ ₹60,000) | 30 |
| Employment | Salaried | 20 |
| DTI | ₹5,000 ÷ ₹85,000 = 5.9% (≤ 10%) | 25 |
| Age | 32 years (25-45) | 10 |
| LTI | ₹5,00,000 ÷ (₹85,000 × 36) = 0.16 (≤ 0.3) | 10 |

**Total Score:**
```
30 + 20 + 25 + 10 + 10 = 95/100
```

**Decision:** ✅ **AUTO APPROVED** (Score 95 ≥ 85)

---

### Example 2: ⏳ Manual Review Case

**Applicant Profile:**
- Age: 28 years
- Monthly Income: ₹45,000
- Employment: Self-Employed
- Existing EMI: ₹8,000
- Loan Amount: ₹4,00,000
- Tenure: 24 months

**Calculation:**

| Component | Calculation | Score |
|-----------|-------------|-------|
| Income | ₹45,000 (≥ ₹40,000) | 24 |
| Employment | Self-Employed | 15 |
| DTI | ₹8,000 ÷ ₹45,000 = 17.8% (10-20%) | 20 |
| Age | 28 years (25-45) | 10 |
| LTI | ₹4,00,000 ÷ (₹45,000 × 24) = 0.37 (0.3-0.5) | 7 |

**Total Score:**
```
24 + 15 + 20 + 10 + 7 = 76/100
```

**Decision:** ⏳ **MANUAL REVIEW** (Score 76 is between 60-84)

---

### Example 3: ❌ Low Score Auto Reject Case

**Applicant Profile:**
- Age: 23 years
- Monthly Income: ₹22,000
- Employment: Self-Employed
- Existing EMI: ₹9,000
- Loan Amount: ₹3,50,000
- Tenure: 24 months

**Calculation:**

| Component | Calculation | Score |
|-----------|-------------|-------|
| Income | ₹22,000 (≥ ₹20,000) | 12 |
| Employment | Self-Employed | 15 |
| DTI | ₹9,000 ÷ ₹22,000 = 40.9% (40-50%) | 5 |
| Age | 23 years (21-24) | 8 |
| LTI | ₹3,50,000 ÷ (₹22,000 × 24) = 0.66 (0.5-0.7) | 4 |

**Total Score:**
```
12 + 15 + 5 + 8 + 4 = 44/100
```

**Decision:** ❌ **AUTO REJECTED** (Score 44 < 60)

---

### Example 4: ❌ Hard Rule Direct Reject Case

**Applicant Profile:**
- Age: 35 years
- Monthly Income: ₹70,000
- Employment: Salaried
- Existing EMI: ₹40,000
- Loan Amount: ₹6,00,000
- Tenure: 36 months

**Hard Rule Check:**

| Rule | Check | Result |
|------|-------|--------|
| Age | 35 (21-60) | ✅ Pass |
| Income | ₹70,000 (≥ ₹20,000) | ✅ Pass |
| Employment | Salaried | ✅ Pass |
| DTI | ₹40,000 ÷ ₹70,000 = **57.1%** | ❌ **FAIL** |

**Decision:** ❌ **DIRECT REJECTION**

> **Reason:** DTI ratio of 57.1% exceeds the maximum allowed 50%. The applicant is immediately rejected without score calculation.

**Score:** 0/100

---

## 6. Summary Tables

### Decision Thresholds

| Score | Decision | Action |
|-------|----------|--------|
| 85-100 | Auto Approve | Loan processed automatically |
| 60-84 | Manual Review | Sent to underwriter for review |
| 0-59 | Auto Reject | Application declined |

### Hard Rejection Triggers

| Trigger | Threshold | Impact |
|---------|-----------|--------|
| Age out of range | < 21 or > 60 years | Immediate rejection |
| Income too low | < ₹20,000/month | Immediate rejection |
| Invalid employment | Not Salaried/Self-Employed | Immediate rejection |
| Excessive debt | DTI > 50% | Immediate rejection |
| Missing documents | Any required doc missing | Application incomplete |

### Score Calculation Reference

| Factor | Max Points | Best Case | Minimum Eligible |
|--------|------------|-----------|------------------|
| Income | 35 | ≥ ₹1,00,000 = 35 | ≥ ₹20,000 = 12 |
| Employment | 20 | Salaried = 20 | Self-Employed = 15 |
| DTI | 25 | ≤ 10% = 25 | 40-50% = 5 |
| Age | 10 | 25-45 = 10 | 56-60 = 3 |
| LTI | 10 | ≤ 0.3 = 10 | 0.5-0.7 = 4 |

---

## 7. Workflow Stages

```
┌─────────────────┐
│  APPLICATION    │
│    INTAKE       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HARD RULE     │───── Fail ─────▶ ❌ REJECTED
│    CHECK        │
└────────┬────────┘
         │ Pass
         ▼
┌─────────────────┐
│    DOCUMENT     │
│  VERIFICATION   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     SCORE       │
│  CALCULATION    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    DECISION     │
│     ENGINE      │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    │         │            │
    ▼         ▼            ▼
  ≥ 85     60-84         < 60
    │         │            │
    ▼         ▼            ▼
   ✅         ⏳           ❌
 APPROVE   REVIEW       REJECT
```

---

## 8. Admin Override

Authorized administrators can override automated decisions:

| Action | Allowed | Requirement |
|--------|---------|-------------|
| Approve a rejected application | ✅ Yes | Written justification required |
| Reject an approved application | ✅ Yes | Written justification required |
| Modify loan terms | ✅ Yes | Within policy limits |

All overrides are logged with:
- Admin ID
- Original decision
- New decision
- Justification reason
- Timestamp

---

## 9. Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                  LOAN SCORING QUICK REFERENCE               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SCORE FORMULA:                                             │
│  Income + Employment + DTI + Age + LTI = Total (out of 100) │
│                                                             │
│  DECISIONS:                                                 │
│  • 85-100 → Auto Approve                                    │
│  • 60-84  → Manual Review                                   │
│  • <60    → Auto Reject                                     │
│                                                             │
│  HARD REJECTS:                                              │
│  • Age < 21 or > 60                                         │
│  • Income < ₹20,000                                         │
│  • Not Salaried/Self-Employed                               │
│  • DTI > 50%                                                │
│                                                             │
│  MAX SCORES:                                                │
│  • Income: 35  • Employment: 20  • DTI: 25                  │
│  • Age: 10     • LTI: 10                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Last Updated: December 9, 2025*
