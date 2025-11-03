# Quick Start Guide

## Start Developing Right Now

```bash
cd /Users/nathan/code/work/goodcraft-application-dashboard
npm run dev
```

Open: http://localhost:3000/applications

---

## What You Have

✅ **Working job applications tracker** at `/applications`
✅ **Database with 5 models** ready for all tracking tabs
✅ **27 Catalyst UI components** ready to use
✅ **API endpoint** at `/api/applications` (GET & POST)
✅ **Production build tested** and passing

---

## Add Your First Application (Test It!)

### Option 1: Via Prisma Studio
```bash
npx prisma studio
```
Click "Application" → "Add Record" → Fill in fields → Save

### Option 2: Via API (curl)
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Acme Corp",
    "jobTitle": "Frontend Developer",
    "resumeVersion": "Frontend",
    "status": "Applied",
    "source": "LinkedIn"
  }'
```

### Option 3: Build the form (next step)
See `SETUP-COMPLETE.md` → "Add Application Form"

---

## Next Features to Build

### 1. Add Application Form (Priority 1)
**File:** `src/app/applications/new/page.tsx`

Copy this to get started:
```tsx
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'

export default function NewApplication() {
  return (
    <form action="/api/applications" method="POST">
      <Field>
        <Label>Company</Label>
        <Input name="company" required />
      </Field>

      <Field>
        <Label>Job Title</Label>
        <Input name="jobTitle" required />
      </Field>

      <Field>
        <Label>Resume Version</Label>
        <Select name="resumeVersion">
          <option>Webflow</option>
          <option>Frontend</option>
          <option>Full-Stack</option>
        </Select>
      </Field>

      <Button type="submit">Add Application</Button>
    </form>
  )
}
```

Then add link in applications page:
```tsx
<Button href="/applications/new">Add Application</Button>
```

### 2. Build Revenue Tab
**Files needed:**
- `src/app/revenue/page.tsx`
- `src/app/api/revenue/route.ts`

Copy the pattern from applications tab.

### 3. Build Other Tabs
Same pattern for:
- `/network` - Network/Outreach
- `/content` - Content Calendar
- `/reviews` - Weekly Reviews

### 4. Add Sidebar Navigation
**Edit:** `src/app/layout.tsx`

Import `sidebar-layout.tsx` component and add links.

---

## Available Catalyst Components

All in `src/components/`:
- `table.tsx` - Data tables
- `badge.tsx` - Status badges
- `button.tsx` - Buttons & links
- `input.tsx` - Text inputs
- `select.tsx` - Dropdowns
- `textarea.tsx` - Multi-line text
- `checkbox.tsx` - Checkboxes
- `fieldset.tsx` - Form groups
- `heading.tsx` - Page headings
- `sidebar.tsx` - Navigation
- `pagination.tsx` - Page navigation
- `dialog.tsx` - Modals
- `dropdown.tsx` - Dropdown menus
- `alert.tsx` - Notifications

Docs: https://catalyst.tailwindui.com/docs

---

## Database Schema Reference

### Application Model
```prisma
model Application {
  id            String    @id @default(cuid())
  dateApplied   DateTime  @default(now())
  company       String
  jobTitle      String
  url           String?
  resumeVersion String
  status        String    @default("Applied")
  followUpDate  DateTime?
  notes         String?
  source        String?
}
```

### RevenueWeek Model
```prisma
model RevenueWeek {
  weekOf              DateTime @unique
  tylerWorkHours      Float
  tylerRevenue        Float
  clientWorkHours     Float
  clientRevenue       Float
  templateSalesCount  Int
  templateSalesAmount Float
  otherIncome         Float
}
```

### NetworkContact Model
```prisma
model NetworkContact {
  contactName   String
  company       String?
  dateContacted DateTime
  method        String
  purpose       String
  responded     Boolean
  followUpDate  DateTime?
  outcome       String?
}
```

### ContentPost Model
```prisma
model ContentPost {
  weekOf             DateTime
  scheduledDate      DateTime
  dayOfWeek          String
  topic              String?
  done               Boolean
  engagementLikes    Int
  engagementComments Int
  engagementShares   Int
  leadsGenerated     Int
}
```

### WeeklyReview Model
```prisma
model WeeklyReview {
  weekOf          DateTime @unique
  jobApplications Int
  deepWorkHours   Float
  revenueThisWeek Float
  contentPosted   Int
  networkOutreach Int
  meetingsNotes   String?
  blockers        String?
  wins            String?
  actionItems     String?
}
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start server
npm run build            # Test build

# Database
npx prisma studio        # Visual DB editor
npx prisma migrate dev   # After schema changes

# Code Quality
npm run lint             # Check for errors
```

---

## File You'll Edit Most

1. **`src/app/applications/page.tsx`** - Applications list
2. **`src/app/layout.tsx`** - Add sidebar navigation
3. **`prisma/schema.prisma`** - If you need to add fields

---

## Getting Stuck?

**See full docs:** `SETUP-COMPLETE.md`

**Reference existing page:** Look at `src/app/applications/page.tsx`

**Check Catalyst demo:** Files in `src/app/(app)/` show examples

**Prisma docs:** https://www.prisma.io/docs

**Next.js docs:** https://nextjs.org/docs

---

Ready to build! 🚀
