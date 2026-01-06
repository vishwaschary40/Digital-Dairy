Build a complete full-stack personal quantified-self diary & dashboard website using:
- Next.js 14 with App Router
- Typescript
- TailwindCSS + shadcn/ui + dark theme design
- Firebase (Firestore database + Firebase Storage + Firebase Auth)
- Recharts or Chart.js for graphs
- Mobile-first responsive UI

💡 Project Purpose:
This website is for a single user (me) to track my life in 2026 using a calendar layout, daily notes, media uploads, counters, and personal goals. It should be like a black-themed digital diary + habit stats dashboard + goal tracker.

🖥️ Pages & Routing:
- Home page: `/` shows counters, statistics, goals, and calendar grid of all 2026 dates
- Calendar navigation: clicking any date opens that day’s log
- Dynamic date page: `/2026/[date]` such as `/2026/03-15`
- Authentication: login page (Google Sign-in + Email/Password)
- Optional settings page for export/backup

📆 Calendar View Requirements:
- display all days of 2026 in a grid monthly layout
- clickable dates route to individual date pages
- show indicators if a day has notes / media / goals progress logged

📝 Daily Log Page (`/2026/[date]`):
- Rich text editor for notes (Markdown or WYSIWYG)
- upload multiple photos and short videos using Firebase Storage
- habit inputs (checklist): gym, study, wake time, sleep time, reading, meditation etc.
- mood slider (1-10)
- expense input and savings input
- masturbation counter (integer)
- mutual fund investment update (number)
- portfolio value update (number)
- save button writes to Firestore under collection `daily_logs/{date}`

📊 Home Dashboard Features:
- Graphs based on daily logs:
  * productivity line graph
  * masturbation counter trend
  * investment growth over time
  * mood chart
  * gym streak bar chart
- card components displaying:
  * total masturbation count
  * current gym streak
  * total savings
  * current portfolio value
  * total reading hours
- short-term & long-term goals display with progress bars
- show goals nearing deadlines

🎯 Goals Page / Section:
- Two categories: short-term goals & long-term goals
- each goal has: title, description, progress %, deadline
- progress editable from goal card or daily log

📂 Firebase Data Structure:
daily_logs collection:
{
  date: "YYYY-MM-DD",
  notes: string,
  mood: number,
  photos: array(storage URLs),
  videos: array(storage URLs),
  habits: {
    gym: boolean,
    meditation: boolean,
    study: number (hours),
    reading: number (minutes)
  },
  masturbation_count: number,
  mutual_fund_value: number,
  portfolio_value: number,
  expenses: number,
  savings: number
}

goals collection:
{
  id,
  type: "short" | "long",
  title: string,
  description: string,
  progress: number,
  deadline: date
}

👤 Authentication:
- Firebase Auth
- user must be logged in to view any page
- persistent login on mobile

📱 UI + Design:
- full black / dark theme with glass effects
- clean, minimal dashboard look like Linear.app + Apple Fitness UI
- mobile-first responsive for daily usage on phone
- grid layout cards on desktop
- bottom navigation for mobile: Home / Calendar / Goals / Profile

📌 Data Backup:
- add button to export all daily_logs + goals to JSON downloadable file
- ability to import JSON later

⚙️ Additional Requirements:
- use server actions & Firebase Admin SDK where needed
- optimize media upload & compress images
- lazy-load calendar months
- smooth animations using Framer Motion

🎯 Final Output Expectations:
- full working project scaffold with pages, components, hooks, Firestore integration
- reusable components for cards, counters, charts, photo upload
- good code organization under `/components`, `/lib/firebase`, `/app/...`
- clear instructions for running locally and deployment to Vercel

Please generate:
1. project folder structure
2. all essential pages, components & hooks
3. firebase config & data access utilities
4. example UI for dashboard, calendar, and a daily log page
5. charts & counters implementation
6. goal tracking components
7. backup export/import logic
8. responsive styling with Tailwind

Start building now.
