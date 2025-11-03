# Daily Usage Guide - Job Hunt Dashboard

## 🚀 Quick Start

```bash
cd /Users/nathan/code/work/goodcraft-application-dashboard
npm run dev
```

**Open:** http://localhost:3001

---

## 📅 Daily Workflow

### Morning (8:30am)
1. **Dashboard** - Check this week's progress
2. **Applications** - Review any responses

### Midday (12:30pm - 2:30pm)
1. **Applications** → "Add Application"
2. Fill out form for each job (10 applications)
3. Set follow-up dates (auto +14 days)

### Afternoon (2:30pm - 3:30pm)
1. **Network** - Log any outreach you did
2. **Content** - Update posts if you published

### End of Day
1. **Revenue** - Update hours worked (via Prisma Studio for now)

### Friday (2pm - 4pm)
1. **Dashboard** - Review weekly metrics
2. **Reviews** - Create weekly review (via Prisma Studio for now)

---

## 🎯 Weekly Goals

Track your progress toward:
- **50 applications** (10/day × 5 days)
- **$2,000 revenue** (or $8k/month)
- **5 network contacts**
- **3 content posts**
- **14 hours deep work**

**Where to see:** Dashboard (home page)

---

## 📝 Adding Data

### ✅ Via UI Forms (Available Now)
**Applications Only:**
1. Go to `/applications`
2. Click "Add Application"
3. Fill form:
   - Company (required)
   - Job Title (required)
   - Resume Version (required)
   - URL, Source, Notes (optional)
   - Follow-up date (auto-set to +14 days)
4. Click "Add Application"

### ✅ Via Prisma Studio (For Everything Else)
```bash
npx prisma studio
```

Opens: http://localhost:5555

**Add Revenue Week:**
1. Click "RevenueWeek"
2. Click "Add Record"
3. Fill:
   - weekOf: `2025-11-03T00:00:00.000Z`
   - tylerWorkHours: `20`
   - tylerRevenue: `800`
   - clientWorkHours: `10`
   - clientRevenue: `500`
   - templateSalesCount: `2`
   - templateSalesAmount: `400`
   - otherIncome: `100`
   - weeklyTotal: `1800` (auto-calculates via API, but manual here)
4. Save

**Add Network Contact:**
1. Click "NetworkContact"
2. Click "Add Record"
3. Fill:
   - contactName: `John Doe`
   - company: `Acme Corp`
   - method: `LinkedIn`
   - purpose: `Job referral`
   - responded: `false`
   - dateContacted: `2025-11-03T00:00:00.000Z`
4. Save

**Add Content Post:**
1. Click "ContentPost"
2. Click "Add Record"
3. Fill:
   - weekOf: `2025-11-03T00:00:00.000Z`
   - scheduledDate: `2025-11-04T00:00:00.000Z`
   - dayOfWeek: `Monday`
   - topic: `Webflow tip`
   - done: `false`
4. Save

**Add Weekly Review:**
1. Click "WeeklyReview"
2. Click "Add Record"
3. Fill:
   - weekOf: `2025-11-03T00:00:00.000Z`
   - jobApplications: `50`
   - deepWorkHours: `14`
   - revenueThisWeek: `1800`
   - contentPosted: `3`
   - networkOutreach: `5`
   - wins: `Got an interview at Acme!`
   - blockers: `Too many applications, need to focus`
   - actionItems: `Follow up with 10 companies`
4. Save

---

## 🔍 Viewing Data

### Dashboard
**Route:** `/dashboard`
**Shows:**
- This week's progress bars
- Overall totals
- Latest review summary
- Quick action buttons

### Applications
**Route:** `/applications`
**Shows:**
- All applications (newest first)
- Status badges (color-coded)
- Date applied
- Company, title, source
- Total count

### Revenue
**Route:** `/revenue`
**Shows:**
- Monthly summary (last 4 weeks)
- $8k goal progress
- Gap to close
- Weekly breakdown
- Tyler/Client hours & revenue
- Template sales
- Average weekly

### Network
**Route:** `/network`
**Shows:**
- This week's outreach count
- Response rate
- All contacts with status
- Follow-up dates

### Content
**Route:** `/content`
**Shows:**
- Posts this week
- Engagement metrics
- Leads generated
- Completion status

### Reviews
**Route:** `/reviews`
**Shows:**
- All weekly reviews
- Metrics with targets
- Color-coded progress
- Wins, blockers, action items

---

## 📊 Understanding the Dashboard

### Color Codes
- **Green (lime):** Excellent (100%+ of goal)
- **Yellow:** Good (75-99% of goal)
- **Red:** Behind (<75% of goal)
- **Gray (zinc):** Neutral/No status

### This Week's Progress
Shows 4 cards:
1. **Job Applications:** X / 50 (weekly goal)
2. **Revenue:** $X / $8000 (monthly goal, last 4 weeks)
3. **Network Outreach:** X / 5 (weekly goal)
4. **Content Posted:** X / 3 (weekly goal)

### Overall Stats
Shows:
- Total Applications (all time)
- Monthly Revenue (last 4 weeks)
- Weeks Tracked

---

## 🎨 Status Meanings

### Application Status
- **Applied:** Submitted, awaiting response
- **Responded:** Company replied
- **Interview:** Scheduled or completed interview
- **Rejected:** Did not move forward
- **Offer:** Received job offer

### Network Outcome
- **Pending:** Awaiting response
- **Deal:** Positive outcome
- **Nothing:** No opportunity

### Content Status
- **Done:** Posted
- **Not Done:** Scheduled but not posted yet

---

## 📈 Weekly Tracking System

### Monday - Thursday
**Applications:** Add 10 per day
**Network:** Log any outreach
**Content:** Update if you post
**Revenue:** Track hours daily

### Friday
**Weekly Review:**
1. Count this week's applications
2. Calculate this week's revenue
3. Count content posts
4. Count network contacts
5. Record deep work hours
6. Write wins, blockers, action items

---

## 🔄 Weekly Reset

Every Monday:
- Start fresh with 0 applications this week
- Network count resets
- Content count resets
- New weekly goals

**Your cumulative data stays:**
- Total applications
- Monthly revenue (rolling 4 weeks)
- All historical records

---

## 💡 Tips

### For Speed
- Keep Prisma Studio open all day
- Bookmark: http://localhost:3001/applications/new
- Use keyboard shortcuts (Tab to navigate forms)

### For Accuracy
- Add applications immediately after applying
- Set reminders for follow-ups (calendar app)
- Review dashboard every morning
- Do Friday review right at 2pm

### For Motivation
- Watch the dashboard progress bars fill up
- Celebrate green badges
- Review past weeks' wins
- Track interview conversion rate

---

## 🚨 Troubleshooting

### Server Not Running
```bash
cd /Users/nathan/code/work/goodcraft-application-dashboard
npm run dev
```

### Can't Add Application
- Check all required fields (*, Company, Title, Resume Version)
- Make sure server is running

### Data Not Showing
- Refresh page (Cmd+R / Ctrl+R)
- Check Prisma Studio for data
- Verify database file exists (prisma/dev.db)

### Build Errors
```bash
npm run build
```
Should show no errors

---

## 📁 Quick Links

**Main App:** http://localhost:3001
**Dashboard:** http://localhost:3001/dashboard
**Add Application:** http://localhost:3001/applications/new
**Prisma Studio:** http://localhost:5555 (run `npx prisma studio`)

---

## 🎯 Your Daily Checklist

```markdown
## Monday - Thursday
- [ ] Check dashboard (morning)
- [ ] Add 10 applications (midday)
- [ ] Log network activity (as it happens)
- [ ] Update content status (if posted)
- [ ] Track hours in Prisma Studio (end of day)

## Friday
- [ ] Check dashboard (morning)
- [ ] Add final applications to hit 50
- [ ] Create weekly review in Prisma Studio
- [ ] Celebrate the week's wins
- [ ] Plan next week's focus
```

---

**Pro Tip:** Add browser bookmark to `/dashboard` and make it your new tab page. See your progress every time you open a new tab!

**Now go apply to 50 jobs! 🚀**
