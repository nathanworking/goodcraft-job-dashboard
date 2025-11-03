# 🤖 AI-Powered Job Search - Setup Guide

## ✅ What's Been Built

Your job hunt dashboard now has **AI-powered job search** that:
1. Uses **Gemini AI** to generate optimized search queries from your description
2. Searches **Google Jobs** via SerpAPI using those queries
3. Shows real job listings with company, location, salary, and more
4. Confirm or reject each job before adding to your applications

---

## 🔧 Setup Required

To use the AI-powered search, you need two API keys:

### **1. Gemini API Key (Free)**

**Get your key:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Add to .env:**
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Cost:** FREE
- Gemini 2.0 Flash has a generous free tier
- 1500 requests per day free
- Perfect for job searching

### **2. SerpAPI Key (Limited Free)**

**Get your key:**
1. Go to https://serpapi.com/users/sign_up
2. Sign up for free account
3. Go to Dashboard
4. Copy your API key

**Add to .env:**
```bash
SERP_API_KEY=your_serpapi_key_here
```

**Cost:** FREE tier included
- 100 searches per month free
- $50/month for 5,000 searches (if you need more)
- Each search query counts as 1 search

---

## 📁 Environment Setup

Create or update your `.env` file in the project root:

```bash
# /Users/nathan/code/work/goodcraft-application-dashboard/.env

# Gemini AI for query generation (FREE)
GEMINI_API_KEY=your_gemini_api_key_here

# SerpAPI for Google Jobs search (100 free/month)
SERP_API_KEY=your_serpapi_key_here

# Database (already configured)
DATABASE_URL="file:./dev.db"
```

---

## 🚀 How It Works

### **The Flow**

1. **You type:** "Frontend developer jobs with React"
2. **Gemini AI generates 3 optimized queries:**
   - "React frontend developer jobs hiring"
   - "Frontend engineer React TypeScript positions"
   - "Hiring React developers remote"
3. **SerpAPI searches Google Jobs** for each query
4. **You see real job listings** with all details
5. **Click Confirm** to add to your applications
6. **Click X** to reject jobs you don't want

### **Visual Feedback**

- 🤖 **"Generating search queries with AI..."** - Gemini is working
- 🔍 **"Searching Google Jobs..."** - SerpAPI is fetching jobs
- **Loading spinner** - Shows the AI is working in the background
- **Confirm/Delete buttons** - Review each job before adding

---

## 🎯 Using the Search

### **Quick Start**

1. **Open:** http://localhost:3001/applications
2. **Click:** "Search Jobs" button
3. **Enter:** What you're looking for
   - Examples:
     - "Webflow developer remote"
     - "Frontend engineer React TypeScript"
     - "Full-stack developer startup"
4. **Optional:** Add location (e.g., "Remote", "San Francisco")
5. **Click Search** or press Enter
6. **Wait** ~3-5 seconds for AI + search
7. **Review** job listings
8. **Confirm** jobs you want to add
9. **X** jobs you don't want

### **Example Searches**

**For Webflow:**
```
"Webflow developer full-time"
"Webflow designer engineer"
"No-code developer Webflow Framer"
```

**For Frontend:**
```
"React developer TypeScript remote"
"Frontend engineer modern stack"
"Vue.js developer startup"
```

**For Full-Stack:**
```
"Full-stack developer Next.js"
"MERN stack developer"
"TypeScript full-stack engineer"
```

---

## 💰 Cost Breakdown

### **Free Usage (Recommended to Start)**

**Gemini API:**
- 1,500 requests/day FREE
- Each search = 1 request
- = 1,500 searches per day FREE

**SerpAPI:**
- 100 searches/month FREE
- Each search query = 1 search
- We generate 3 queries per search
- = ~33 full searches per month FREE

**Total Cost:** $0/month for ~33 searches

### **If You Need More**

**Option 1: Reduce queries**
- Change from 3 queries to 1 query in API
- Edit: `src/app/api/search-jobs/route.ts`
- Line 18: Change `generateSearchQueries(query, 3)` to `generateSearchQueries(query, 1)`
- Result: 100 searches/month instead of 33

**Option 2: Upgrade SerpAPI**
- $50/month = 5,000 searches
- = 1,666 full searches (3 queries each)
- Perfect for daily job hunting

---

## 🔍 What You Get

### **Job Listing Details**

Each job shows:
- ✅ **Job Title** - Exact position name
- ✅ **Company Name** - Who's hiring
- ✅ **Location** - Where the job is
- ✅ **Description** - What the job entails
- ✅ **Source** - Where it came from (company site, LinkedIn, etc.)
- ✅ **Salary** - If available
- ✅ **Job Type** - Full-time, Part-time, Contract, etc.
- ✅ **Posted Date** - How recent
- ✅ **Direct URL** - Link to apply

### **Smart Features**

- **No duplicates** - Same job from multiple sources = 1 listing
- **Real sources** - Tries to find company website, not just job boards
- **Best results** - AI optimizes queries for maximum relevance
- **Fast** - 3-5 seconds for full search

---

## 🛠️ Troubleshooting

### **Error: "Gemini API key not configured"**

**Solution:**
1. Make sure `.env` file exists in project root
2. Check `GEMINI_API_KEY=your_key` is set
3. Restart the dev server: `npm run dev`

### **Error: "SerpAPI key not configured"**

**Solution:**
1. Make sure `.env` file exists
2. Check `SERP_API_KEY=your_key` is set
3. Restart dev server

### **No jobs found**

**Possible causes:**
1. **Query too specific** - Try broader terms
2. **Location too narrow** - Try "Remote" or remove location
3. **API limits** - Check your SerpAPI dashboard

**Solutions:**
- Try different keywords
- Make query more general
- Add "remote" to find more opportunities

### **Jobs not loading**

1. **Check API keys** in `.env`
2. **Check console** for errors (F12 in browser)
3. **Check server logs** in terminal
4. **Verify APIs are working:**
   - Gemini: https://aistudio.google.com/
   - SerpAPI: https://serpapi.com/dashboard

---

## 📊 Monitoring Usage

### **SerpAPI Dashboard**

1. Go to https://serpapi.com/dashboard
2. See "Searches This Month"
3. Tracks your 100 free searches

**Pro Tip:** Each search uses 3 API calls (for 3 queries), so you get ~33 full searches per month

### **Gemini Usage**

1. Go to https://aistudio.google.com/
2. Click your API key
3. See usage stats

**Note:** Highly unlikely to hit the 1,500/day limit

---

## 🎨 Customization

### **Change Number of Queries**

**File:** `src/app/api/search-jobs/route.ts`
**Line 18:**
```typescript
// Generate 3 queries (default)
const searchQueries = await generateSearchQueries(query, 3)

// Generate 1 query (saves API calls)
const searchQueries = await generateSearchQueries(query, 1)

// Generate 5 queries (more results, costs more)
const searchQueries = await generateSearchQueries(query, 5)
```

### **Filter Out Job Boards**

To only see company websites (no Indeed, LinkedIn, etc.):

**File:** `src/app/api/search-jobs/route.ts`
**Line 24:**
```typescript
// Include job boards (default)
false

// Exclude job boards (company sites only)
true
```

### **Change Location Default**

**File:** `src/services/serp-service.ts`
**Line 82:**
```typescript
location: location || "United States"

// Change to:
location: location || "Remote"
// or
location: location || "San Francisco"
```

---

## ✅ Verification

### **Test the Setup**

1. **Add API keys to .env**
2. **Restart server:** `npm run dev`
3. **Open:** http://localhost:3001/applications
4. **Click:** "Search Jobs"
5. **Search:** "developer"
6. **You should see:**
   - Loading spinner
   - "Generating search queries with AI..."
   - "Searching Google Jobs..."
   - Real job listings appear
   - Confirm/Delete buttons on each

If you see real job listings, **you're all set!** 🎉

---

## 🚀 Daily Workflow

### **Morning Routine (5-10 minutes)**

1. Open applications page
2. Click "Search Jobs"
3. Search for your target roles:
   - "Webflow developer"
   - "Frontend React developer"
   - "Full-stack engineer"
4. Review 10-20 jobs
5. Confirm 5-10 to add to applications
6. Reject the rest

### **Result**

- **10 applications** added in ~5 minutes
- All with company, title, URL auto-filled
- Ready to actually apply (open URLs)
- Track everything in your dashboard

---

## 📖 Related Files

### **Services Created**
- `src/services/gemini-service.ts` - AI query generation
- `src/services/serp-service.ts` - Google Jobs search

### **Components**
- `src/components/job-search.tsx` - Search UI
- `src/components/loading-spinner.tsx` - Loading animation

### **API Routes**
- `src/app/api/search-jobs/route.ts` - Search endpoint

### **Documentation**
- `AI-JOB-SEARCH-SETUP.md` - This file
- `JOB-SEARCH-INTEGRATION.md` - Previous integration docs

---

## 🎉 You're Ready!

Once you add the API keys, you have:

✅ **AI-powered job search**
✅ **Real Google Jobs results**
✅ **Smart query generation**
✅ **One-click adding to applications**
✅ **Beautiful loading states**
✅ **Confirm/reject workflow**

**Next Steps:**
1. Add API keys to `.env`
2. Restart server
3. Start searching for jobs!
4. Land that perfect role! 💼

---

**Questions?** Check the troubleshooting section or review the code in the files listed above.

**Happy job hunting! 🚀**
