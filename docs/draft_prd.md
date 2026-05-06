# **Product Requirements Document (PRD)**

## **Product Name:** Scholarship Application Copilot (Single-Tenant)

---

# 1. **Overview**

## 1.1 Purpose

Build a personal AI-powered system that:

* Discovers relevant scholarships
* Evaluates eligibility and fit
* Prepares application requirements
* Generates, critiques, and refines application materials

## 1.2 Goals

* Reduce scholarship search time by ≥70%
* Reduce application drafting time by ≥60%
* Increase application quality (measured via appraisal scores)

## 1.3 Non-Goals

* Multi-user SaaS
* Fully autonomous submission
* Real-time collaborative editing
* Complex multi-agent planning systems

---

# 2. **User Persona**

**Primary user:** You (single tenant)

Characteristics:

* Time-constrained
* High academic/professional ambition
* Applies to multiple scholarships
* Needs high-quality, tailored applications

---

# 3. **Core User Journey**

1. System runs scheduled search (or manual trigger)
2. Scholarships are discovered and structured
3. Hard filters remove ineligible options
4. Remaining scholarships are scored
5. High-scoring scholarships trigger application pipeline
6. Drafts are generated → critiqued → refined
7. User reviews and edits final output

---

# 4. **Functional Requirements**

---

## 4.1 Scholarship Discovery

### Description

Automatically find scholarship opportunities via web search.

### Inputs

* Search queries (derived from profile)

### Tools

* Tavily API

### Outputs

```json
{
  "title": "",
  "provider": "",
  "deadline": "",
  "source_url": "",
  "summary": ""
}
```

### Requirements

* Must return only legitimate opportunities
* Must include source URL
* Must deduplicate results

---

## 4.2 Scholarship Extraction

### Description

Convert unstructured content into structured schema.

### Outputs

```json
{
  "eligibility": {
    "citizenship": [],
    "degree_level": "",
    "gpa": "",
    "field": []
  },
  "requirements": [],
  "essay_prompts": [],
  "deadline": ""
}
```

### Requirements

* Must not infer missing data
* Must flag ambiguous fields

---

## 4.3 Rule-Based Eligibility Filter

### Description

Deterministic filtering before AI scoring.

### Rules

* Citizenship match
* Degree level match
* Deadline validity
* Minimum GPA (if specified)

### Output

```json
{
  "eligible": true,
  "reasons": []
}
```

---

## 4.4 Scoring Agent

### Description

Evaluate scholarship fit.

### Outputs

```json
{
  "fit_score": 0-100,
  "confidence": 0-1,
  "justification": [],
  "missing_information": []
}
```

### Requirements

* Must separate eligibility from fit
* Must not hallucinate missing profile data

---

## 4.5 Prep Agent (Application Planner)

### Description

Identify all required application components and strategy.

### Outputs

```json
{
  "documents": [
    {
      "type": "essay",
      "name": "",
      "prompt": ""
    }
  ],
  "strategy": [],
  "priority_signals": []
}
```

---

## 4.6 Draft Agent

### Description

Generate application materials.

### Inputs

* Structured profile
* Scholarship requirements

### Constraints

* Must only use profile facts
* Must not fabricate achievements

### Outputs

```json
{
  "content": "",
  "fact_references": []
}
```

---

## 4.7 Appraisal Agent

### Description

Critically evaluate drafts.

### Outputs

```json
{
  "strengths": [],
  "weaknesses": [],
  "missing_elements": [],
  "risk_flags": [],
  "score": 1-10
}
```

---

## 4.8 Editor Agent

### Description

Produce final refined draft.

### Constraints

* Must not introduce new facts
* Must incorporate appraisal feedback

### Outputs

```json
{
  "final_content": "",
  "unresolved_gaps": []
}
```

---

## 4.9 Human Review Interface

### Features

* View drafts
* Edit content
* Track changes
* Mark as completed

---

# 5. **Non-Functional Requirements**

## 5.1 Performance

* End-to-end pipeline per scholarship ≤ 60 seconds

## 5.2 Reliability

* Zero fabricated claims in final output

## 5.3 Maintainability

* Modular agent functions
* Clear schemas

## 5.4 Observability

* Log every agent output
* Track errors and failures

---

# 6. **System Architecture**

## 6.1 Stack

* Frontend: Next.js
* Backend: Next.js API routes
* Database: PostgreSQL + Prisma
* LLM: Gemini
* Search: Tavily
* Scheduling: Vercel Cron

---

## 6.2 Pipeline Flow

```text
Cron / Manual Trigger
   ↓
Scout Agent (Tavily)
   ↓
Extractor
   ↓
Rule Filter
   ↓
Scoring Agent
   ↓ (if score > threshold)
Prep Agent
   ↓
Draft Agent
   ↓
Appraisal Agent
   ↓
Editor Agent
   ↓
User Review
```

---

# 7. **Data Model (Prisma-Level)**

### `UserProfile`

* id
* education (JSON)
* experience (JSON)
* achievements (JSON)

---

### `Scholarship`

* id
* title
* provider
* deadline
* raw_text
* structured_data (JSON)

---

### `Evaluation`

* id
* scholarship_id
* eligible
* fit_score
* notes

---

### `Application`

* id
* scholarship_id
* draft
* final_version
* status

---

# 8. **Agent Design Principles**

1. Deterministic orchestration
2. Strict schema outputs
3. No cross-agent autonomy
4. Explicit grounding in profile
5. Traceability of generated content

---

# 9. **Security & Integrity**

* No fabrication of credentials
* All outputs traceable to source data
* Manual approval required before use

---

# 10. **Metrics of Success**

### Efficiency

* Time saved per application

### Quality

* Appraisal score improvement

### Precision

* % of recommended scholarships applied to

---

# 11. **Risks & Mitigation**

| Risk                 | Mitigation                        |
| -------------------- | --------------------------------- |
| Hallucinated content | Profile grounding + validation    |
| Poor data quality    | Structured extraction + filtering |
| Over-complexity      | Keep deterministic pipeline       |
| Broken scraping      | Tavily + fallback sources         |

---

# 12. **Roadmap**

## Phase 1 (MVP)

* Profile system
* Scout + extractor
* Rule filter
* Draft + appraisal + editor

## Phase 2

* Improved scoring
* Better prompt tuning
* Memory from past applications

## Phase 3

* Smarter search queries
* Feedback learning loop

---

# 13. **Answers**

1. **fit score threshold**? => greater than 70%
2. **multiple essay styles** or one canonical voice? => multiple essay styles
3. Should the system prioritize:

   * Fewer high-quality applications
   * Or broader coverage? => Fewer high-quality applications

