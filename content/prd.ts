export type Prd = {
  meta: { version: string; status: string; owner: string; updated: string };
  overview: string;
  goals: string[];
  nonGoals?: string[];
  personas?: { name: string; need: string }[];
  stories?: string[];
  requirements?: { id: string; priority: "P0" | "P1" | "P2"; title: string; detail: string; acceptance: string }[];
  nfr?: { area: string; requirement: string }[];
  scope?: { in: string[]; out: string[] };
  metrics?: { metric: string; target: string; status: string }[];
  phases?: { name: string; detail: string; state: string }[];
  risks?: { risk: string; mitigation: string }[];
  open?: string[];
  limits?: string[];
  note?: string;
};

const owner = "Mark Jerome Gomez, product owner and builder";
const updated = "2 Nov 2026";

export const prds: Record<string, Prd> = {
  "smart-city-intelligence-hub": {
    meta: { version: "1.0", status: "Live, in development", owner, updated },
    overview: "A free reference platform that explains the smart city and IoT ecosystem as one connected system. It combines a protocol library, subsystem guides, use cases, reference architectures, global deployments, career paths and interview preparation, and ties them together with an interactive knowledge graph so a reader can follow connections instead of reading isolated definitions.",
    goals: [
      "A complete beginner can build a working mental model of a smart city in one sitting.",
      "A practitioner can find a protocol, subsystem, use case or architecture and see what it connects to within a minute.",
      "Content is accurate and consistent enough to use in research, client conversations and solution design.",
      "The platform stays free to use and easy to extend as practitioners ask for more.",
    ],
    nonGoals: [
      "Not a vendor directory or product comparison site.",
      "Not a news feed. Content is structured reference material.",
      "Not a replacement for standards documents or vendor documentation.",
    ],
    personas: [
      { name: "Complete beginner", need: "Fundamentals first, in plain language, then a way to see which careers and use cases exist." },
      { name: "IoT technical", need: "Protocol depth, subsystem architecture and enterprise reference patterns." },
      { name: "Product manager", need: "Use cases with KPIs and ROI, market intelligence, career roadmaps and interview preparation." },
      { name: "Global projects analyst", need: "Real deployments with transferable lessons and strategic perspective." },
    ],
    stories: [
      "As a beginner, I want to be told where to start, so that I do not get lost in 150+ linked concepts.",
      "As an engineer, I want a protocol explained with an analogy and then in technical depth, so that I can teach it to others and still trust the detail.",
      "As a product manager, I want each use case to state the problem, architecture, KPIs and ROI, so that I can reuse it in a business case.",
      "As a practitioner, I want to click a concept in the knowledge graph and see everything it relates to, so that I understand dependencies before designing a solution.",
      "As a career changer, I want a 30, 60 and 90 day plan for a role, so that I know what to learn in what order.",
    ],
    requirements: [
      { id: "H1", priority: "P0", title: "Guided starting paths", detail: "The home page offers four starting paths: Complete Beginner, IoT Technical, Product Manager and Global Projects.", acceptance: "Each path leads to a relevant first page, and the home page shows the platform's coverage at a glance." },
      { id: "H2", priority: "P0", title: "Protocol library", detail: "22+ IoT protocols, from MQTT and CoAP to LoRaWAN and NB-IoT, each with a plain language analogy before technical depth.", acceptance: "Every entry carries a category such as application layer, LPWAN or cellular, and an everyday explanation." },
      { id: "H3", priority: "P0", title: "Subsystem guides", detail: "10+ core smart city subsystems such as BMS, SCADA and GIS, and how they interact.", acceptance: "Each subsystem links to the protocols and use cases that depend on it." },
      { id: "H4", priority: "P0", title: "Use case library", detail: "18+ real smart city use cases such as smart parking, waste management and street lighting.", acceptance: "Each use case states the problem, the technologies involved, the architecture and the ROI." },
      { id: "H5", priority: "P0", title: "Interactive knowledge graph", detail: "A graph of 150+ linked concepts built with React Flow.", acceptance: "Selecting a node shows its relationships, and links from a node open the matching page." },
      { id: "H6", priority: "P1", title: "Solution architectures", detail: "18+ solution architectures with KPIs and implementation notes.", acceptance: "Every architecture lists components, data flow and measurable KPIs." },
      { id: "H7", priority: "P1", title: "Global deployments", detail: "10 deployments from Singapore to NEOM, including Dubai, Barcelona, Amsterdam, Seoul and Masdar City.", acceptance: "Each case states what was built and the lessons that transfer to other cities." },
      { id: "H8", priority: "P1", title: "Career, market and interview sections", detail: "5 career paths with 30, 60 and 90 day plans, a market view, product manager interview preparation and a glossary.", acceptance: "Each career path has a dated plan, and glossary terms link back to the concept pages." },
      { id: "H9", priority: "P2", title: "Practitioner feedback loop", detail: "A simple way for practitioners to correct content and request additions.", acceptance: "Requests are recorded and drive the next content release." },
    ],
    nfr: [
      { area: "Responsive", requirement: "Works on phone, tablet and desktop. The sidebar collapses to give content more room." },
      { area: "Theming", requirement: "Light and dark theme toggle." },
      { area: "Consistency", requirement: "A content template per entry type keeps depth comparable across protocols, use cases and architectures." },
      { area: "Performance", requirement: "Mostly static content on a Next.js stack so pages load quickly." },
      { area: "Maintainability", requirement: "Content is structured data, so adding a protocol or use case does not need a redesign." },
    ],
    scope: {
      in: ["Reference content, learning paths and the knowledge graph", "Career and interview material for smart city and product roles", "Free access for learners and practitioners"],
      out: ["Vendor comparisons and sales content", "News and commentary", "Paid tiers or gated content", "User generated content in the first release"],
    },
    metrics: [
      { metric: "Content coverage", target: "22+ protocols, 10+ subsystems, 18+ use cases, 10 deployments, 5 career paths, 150+ concepts", status: "Met on the live site" },
      { metric: "Use in my own work", target: "Used for research, client conversations and solution design", status: "Met, personal use" },
      { metric: "Practitioner feedback", target: "A first round of corrections and requests from practitioners", status: "Not started" },
      { metric: "Readers reaching a second page", target: "To be set once usage data exists", status: "Not measured" },
    ],
    phases: [
      { name: "Phase 1: Content and navigation", detail: "Protocols, subsystems, use cases, architectures, deployments, career material and the knowledge graph.", state: "Done" },
      { name: "Phase 2: Practitioner feedback", detail: "Share with practitioners, collect corrections and requests.", state: "Next" },
      { name: "Phase 3: Requested additions", detail: "Add what users ask for, not what I assume they need.", state: "Later" },
    ],
    risks: [
      { risk: "Factual errors, because I am a practitioner and not a reference publisher.", mitigation: "Practitioner review and a visible way to report corrections." },
      { risk: "Uneven depth across 150+ concepts.", mitigation: "A content template for each entry type." },
      { risk: "The graph becomes unreadable as it grows.", mitigation: "Grouping and filtering before adding more nodes." },
      { risk: "Content goes stale as deployments and standards change.", mitigation: "Date sensitive entries and review them on a schedule." },
    ],
    open: [
      "Which subsystems and protocols do practitioners miss first?",
      "Should interview preparation become its own product for product managers?",
      "What lightweight usage measurement is acceptable for a free learning site?",
    ],
  },

  "life-os": {
    meta: { version: "1.0 MVP", status: "Prototype in daily use", owner, updated },
    overview: "A private, local first life execution system. It joins long term goals, a 2026 to 2035 roadmap, daily tasks, habits, a career pipeline, personal finances and weekly reviews, and it plans each day around the capacity I actually have. Its job is to make the next meaningful action obvious without constant replanning, and to survive a bad week without punishing me for it.",
    goals: [
      "Show the next meaningful action each day, sized to my real energy and time.",
      "Link every long term goal to milestones, projects and small daily actions.",
      "Recover from a missed day or week without guilt or a pile of overdue tasks.",
      "Keep all personal and financial data on my own machine, exportable at any time.",
      "Never present an estimate as a fact. Every number is labelled actual or estimate.",
    ],
    nonGoals: [
      "AI coaching, external integrations and complex forecasting before the MVP is proven.",
      "Multi user accounts, sharing or cloud sync in the first release.",
      "Social metrics, fabricated achievements or any pre filled personal data.",
    ],
    personas: [
      { name: "Person in transition", need: "Rebuilding routines, money or a career, wanting structure without guilt and without handing personal data to a cloud service." },
    ],
    stories: [
      "As someone with low energy today, I want a Minimum Day, so that I can still make progress on the essentials.",
      "As someone who missed a task, I want to move it to tomorrow, next week or a chosen date without changing the roadmap.",
      "As someone planning money, I want runway and payoff dates to stay blank until I enter real numbers, so that I am never shown a guess as a fact.",
      "As someone reviewing my week, I want statistics calculated for me, so that I spend my time reflecting instead of counting.",
      "As the owner of my data, I want to export everything and restore it from a backup in one step.",
    ],
    requirements: [
      { id: "L1", priority: "P0", title: "Command Center", detail: "The home screen shows today's top priorities, deadlines, financial risk signals, quick actions and weekly progress.", acceptance: "Opening the app answers what to do next within a few seconds." },
      { id: "L2", priority: "P0", title: "Today with three capacity modes", detail: "Minimum Day allows up to 3 tasks in 60 minutes. Standard Day allows up to 5 tasks in 240 minutes with one focus block. Deep Work Day allows up to 6 tasks in 360 minutes with up to 3 focus blocks.", acceptance: "A plan never exceeds the limits of the chosen mode, and anything that does not fit goes to Later and is never deleted. Covered by planner capacity tests." },
      { id: "L3", priority: "P0", title: "Explainable priority engine", detail: "Tasks are ranked by priority, life stage weight, due date and whether they are essential.", acceptance: "Hovering a task shows why it ranked where it did, and the ranking is reproducible." },
      { id: "L4", priority: "P0", title: "Rescheduling and recurrence", detail: "Move to tomorrow, next week or a chosen date, or skip today for a recurring task. The roadmap is unchanged.", acceptance: "Tasks moved three or more times are flagged to shrink or drop. Recurrence rules are unit tested." },
      { id: "L5", priority: "P0", title: "Roadmap to 2035", detail: "Six life stages with milestones, age at each milestone and conditional prerequisites.", acceptance: "Age is the completed years from the full birth date, not a subtraction of years, and is unit tested." },
      { id: "L6", priority: "P0", title: "Finances: actuals and scenarios", detail: "Manual entry of balances, debts with rates and minimums, monthly costs and dated one off obligations. Scenarios move job start, salary, cost cuts and extra repayments across conservative, baseline and optimistic bands.", acceptance: "Runway and payoff dates stay blank until actuals are entered. Projections are never stored as actuals. Accounts in other currencies are excluded from totals instead of converted with invented rates." },
      { id: "L7", priority: "P1", title: "Career pipeline", detail: "Applications, interviews, follow up dates and role specific CV references.", acceptance: "The pipeline shows the next action for every application." },
      { id: "L8", priority: "P1", title: "Habits and health", detail: "Movement, sleep, nutrition, reading and grooming habits, each with a minimum version for hard days.", acceptance: "Minimum Day shows the minimum version of each habit. Streaks use only what is logged." },
      { id: "L9", priority: "P1", title: "Check ins and reviews", detail: "Daily check ins for energy, mood, a win and a blocker, a weekly review with calculated statistics, and a monthly review.", acceptance: "Saved reviews form a persistent history that survives a refresh." },
      { id: "L10", priority: "P1", title: "Vision board", detail: "Cards linked to nine life pillars, with local image upload that is resized on the device.", acceptance: "Clicking a card shows its milestones, weekly commitments and next tasks." },
      { id: "L11", priority: "P0", title: "Data ownership", detail: "Export a JSON backup and restore it in one transaction. Archive instead of delete where offered. Optional passcode if the app is exposed beyond my machine.", acceptance: "A restore replaces all data from the backup file, and every record carries created and updated timestamps." },
    ],
    nfr: [
      { area: "Privacy", requirement: "Local first on a single SQLite file. No cloud account and no API keys." },
      { area: "Data integrity", requirement: "Additive migrations only. Financial rows carry provenance, actual or estimate." },
      { area: "Dates", requirement: "Calendar dates in the configured time zone, Asia/Dubai by default. Weeks run Monday to Sunday." },
      { area: "Transparency", requirement: "Calculation rules are shown in the app. No inflation, raises or investment returns are assumed." },
      { area: "Responsive", requirement: "Desktop first with a mobile layout. Tested on Chromium at 1440px and 390px." },
      { area: "Quality", requirement: "21 unit tests cover ages, dates, recurrence, runway, amortisation, avalanche and snowball ordering, and planner capacity." },
      { area: "Accessibility", requirement: "Required by the specification. A formal accessibility audit has not been done yet." },
    ],
    scope: {
      in: ["Command Center, Today, roadmap, vision board, habits and health, career pipeline, finances and reviews", "Plans seeded as templates, with no pre filled facts", "Export and restore"],
      out: ["AI coaching and external integrations", "Multi user support and sync", "Goals and projects screen, business idea portfolio, content studio, relationships tracker, analytics page, travel and home construction planners and a progress photo gallery, all sequenced for later"],
    },
    metrics: [
      { metric: "Product acceptance: enter a baseline, add a goal and milestone, create, complete and reschedule a task, and see progress after refresh", target: "Passes", status: "Tested on Chromium and through API and unit tests" },
      { metric: "Calculation correctness", target: "Ages, dates, recurrence, runway and debt maths correct", status: "21 unit tests" },
      { metric: "Bad week survival: share of hard days where a Minimum Day is completed", target: "To be set after a month of data", status: "Not yet measured" },
      { metric: "Follow through: top three tasks completed per week", target: "To be set after a month of data", status: "Not yet proven, needs weeks of real use" },
    ],
    phases: [
      { name: "MVP", detail: "Eight modules built, with plans seeded and no pre filled facts.", state: "Built" },
      { name: "Daily use", detail: "Use it every day, log honestly and fix what breaks.", state: "Now" },
      { name: "Sequenced modules", detail: "Goals and projects, business ideas, content studio, relationships, analytics and planners.", state: "Later" },
    ],
    risks: [
      { risk: "The tool becomes the project instead of helping with the plan.", mitigation: "Prioritise real life progress over perfecting the app, and sequence unbuilt modules." },
      { risk: "Data entry fatigue.", mitigation: "A five minute morning routine and minimum versions of every habit." },
      { risk: "Gaps in logging look like gaps in behaviour.", mitigation: "Say so in the app and avoid judging from missing data." },
      { risk: "Sensitive financial data.", mitigation: "Local only storage, optional passcode, export to an encrypted location." },
    ],
    open: [
      "Is it useful to anyone but me?",
      "Does a Sunday review notification help, or become noise?",
      "Which unbuilt module has the most value once the core is stable?",
    ],
    limits: [
      "Single user with no multi device sync. Phone access needs a local network or a small server.",
      "Skipped recurring tasks have no undo button.",
      "Habit streaks and analytics only reflect what is logged.",
      "Tested on Chromium. Not tested on Safari or Windows.",
    ],
  },

  careeros: {
    meta: { version: "0.2", status: "In development, milestones M0 and M1 complete", owner, updated },
    overview: "A local desktop app for job search. I paste a job description, approve it once, and receive a truthful, correctly formatted CV in my master template, tracked in a local pipeline. The AI may only select and order facts that I have already verified, and the database refuses to let anything else reach a CV.",
    goals: [
      "Tailor a CV to a role in minutes without fabricating a single claim.",
      "Produce Word and PDF files that need zero manual layout fixes.",
      "Keep every job search record on my own machine.",
      "Track each application through eight clear states.",
    ],
    nonGoals: [
      "No scraping of job boards. Their terms prohibit it, so discovery uses public employer feeds and manual import.",
      "No automatic submission. Nothing is ever applied for without me.",
      "No cover letters, email parsing, analytics or sync in the MVP.",
      "No multi user support and no Windows build in the MVP.",
    ],
    personas: [
      { name: "Me, the job seeker", need: "Tailor applications quickly while staying able to defend every line in an interview or background check." },
      { name: "Anyone with the same problem", need: "A reference design for AI assisted applications that cannot invent claims." },
    ],
    stories: [
      "As a job seeker, I want to import my master CV as individual facts, so that I can verify each one once and reuse it.",
      "As a job seeker, I want to paste a job description and see which verified facts answer each requirement, so that I know where I am strong and where I have gaps.",
      "As a job seeker, I want one approval click before generation, so that I stay in control without extra steps.",
      "As a job seeker, I want export blocked if any bullet cannot be traced to a verified fact, so that I never send an unsupported claim.",
    ],
    requirements: [
      { id: "F1", priority: "P0", title: "Fact base", detail: "Every CV usable fact has a source, a date range and a verification status.", acceptance: "Unverified facts cannot reach a CV. The rule is enforced twice, by a database constraint and by the single query path for eligible facts." },
      { id: "F2", priority: "P0", title: "Template capture", detail: "The master Word document becomes a template with placeholders, A4 with justified body text.", acceptance: "A render with the original content is visually identical to the master. The golden test matched 46 of 46 paragraphs in text and formatting." },
      { id: "F3", priority: "P0", title: "Job intake", detail: "Paste a job description, or fetch a public page and confirm the text.", acceptance: "A stored job record with title, company, location, raw text and first seen date." },
      { id: "F4", priority: "P0", title: "Requirement extraction", detail: "The description becomes structured data separating mandatory from preferred requirements, years, certifications and location or visa rules.", acceptance: "Output is validated against a schema. Invalid output is retried once, then flagged." },
      { id: "F5", priority: "P0", title: "Fit assessment", detail: "Hard filters, then a weighted score from 0 to 100 with reasons for and against, citing fact IDs.", acceptance: "A failed mandatory requirement shows Disqualified regardless of score. The label says suitability score, never chance." },
      { id: "F6", priority: "P0", title: "CV generation", detail: "The model returns content that references fact IDs only. A renderer fills the template.", acceptance: "Word and PDF files are saved to the application folder." },
      { id: "F7", priority: "P0", title: "Quality gate", detail: "Automatic checks before export.", acceptance: "Export is blocked if any bullet lacks a fact ID, any date differs from the fact base, the page count exceeds the variant limit, or the PDF text is not extractable." },
      { id: "F8", priority: "P0", title: "Tracker", detail: "Eight states: Saved, Approved, Docs ready, Applied, Screening, Interview, Offer and Closed with a reason.", acceptance: "A timestamp on every state change, plus notes and a follow up date." },
      { id: "F9", priority: "P1", title: "Cover letters, batch approval and employer feeds", detail: "Cover letters under the same fact rule, a queue of up to ten jobs, and public feeds for a list of target employers.", acceptance: "Starts only after the MVP exit test passes." },
      { id: "F10", priority: "P2", title: "Email and calendar matching, interview prep and outcome intelligence", detail: "Read only matching with review for low confidence results, and outcome analysis.", acceptance: "Needs real outcome data, at least 30 tracked applications, before it is meaningful." },
    ],
    nfr: [
      { area: "Shell", requirement: "Tauri 2 with React and TypeScript for a small local app with keychain access." },
      { area: "Storage", requirement: "SQLite with migrations in the repository. Local first with no operations to run." },
      { area: "AI boundary", requirement: "One AI provider. The model returns structured JSON only, and every bullet references a fact ID. This rule is never revisited." },
      { area: "Secrets", requirement: "The API key lives in the macOS keychain. Model calls run from the native side so the key never enters the interface." },
      { area: "Rendering", requirement: "The master Word file is filled by a template engine to preserve fonts and spacing, and PDFs are produced by a headless converter." },
      { area: "Privacy", requirement: "Real personal inputs are git ignored. Tests use synthetic data only." },
      { area: "Testing", requirement: "Unit tests for migrations, database constraints and fact eligibility, Rust tests, a smoke run, and a golden file comparison for the template." },
      { area: "Cost", requirement: "Every model run logs its cost." },
    ],
    scope: {
      in: ["Single user on one Mac", "Fact import from one master CV and manual review", "Job intake, requirement extraction, fit assessment and CV generation", "Two CV variants, product manager and PMO or delivery", "Local tracker with eight states"],
      out: ["Scraping of job boards", "Cover letters, analytics and LifeOS integration", "Cloud backend, sync and Windows", "Template designer and multiple layouts"],
    },
    metrics: [
      { metric: "MVP exit test", target: "For 10 real job descriptions in a row, the CV needs zero manual layout fixes and contains zero unverified claims", status: "Not yet run" },
      { metric: "Fit scoring agreement", target: "Agrees with my own verdict on at least 12 of 15 past job descriptions, and never rates a role I judged weak at 80 or above", status: "Not yet run" },
      { metric: "Template fidelity", target: "A render matches the master", status: "Met, 46 of 46 paragraphs identical, page 2 pixel identical" },
      { metric: "Fabricated claims reaching a CV", target: "Zero", status: "Enforced by the database and the quality gate" },
    ],
    phases: [
      { name: "M0: Foundation", detail: "Project setup, migrations, keychain storage and CI checks.", state: "Done" },
      { name: "M1: Fact base and template", detail: "Master CV imported as facts, reviewed by me, and the template captured with a golden render test.", state: "Done" },
      { name: "M2: Vertical slice", detail: "Paste a job description, approve it, and generate a CV through the quality gate.", state: "Next" },
      { name: "M3 and M4", detail: "Fit scoring against my evaluation set, the tracker, then the MVP exit test.", state: "Planned" },
    ],
    risks: [
      { risk: "Fact verification stalls the project.", mitigation: "M2 can run on the subset of facts already verified." },
      { risk: "Template drift between app output and the master.", mitigation: "A golden render comparison on every change." },
      { risk: "Invalid model output.", mitigation: "Schema validation, one retry, then flag the result." },
      { risk: "Unevidenced metrics in my history.", mitigation: "Unevidenced numbers stay unquantified until I can source them." },
      { risk: "Model cost grows.", mitigation: "A cost log per run and a monthly ceiling." },
    ],
    open: [
      "Confirm exact employer names and job titles against HR documents before verifying the related facts.",
      "Confirm the second CV variant, PMO or delivery.",
      "Collect 15 past job descriptions with my own strong, moderate or weak verdict for the evaluation.",
      "Set a monthly cost ceiling for model calls.",
    ],
  },

  "gulf-hiring-radar": {
    meta: { version: "0.1", status: "Prototype, refreshing each weekday", owner, updated },
    overview: "A tracker of live job openings and career portals across the UAE and Oman. A scheduled AI agent runs each weekday, finds new postings, applies my rules and records them in a shared database with a fit rating. It only adds information. It never applies, never messages anyone and never changes a status that I set.",
    goals: [
      "Surface new relevant roles within a weekday of publication.",
      "Remove roles that cannot work for me before I see them.",
      "Give each opening a fit rating so I can decide where to spend effort.",
      "Keep me in control of every action.",
    ],
    nonGoals: [
      "No automated applications and no automated messages.",
      "No replacement for networking or direct outreach.",
      "No claim that a fit rating predicts an offer.",
    ],
    personas: [{ name: "Me, during an active job search", need: "Stop checking dozens of career pages by hand and stop missing fresh postings." }],
    stories: [
      "As a job seeker, I want new postings recorded every weekday, so that I act on fresh roles first.",
      "As a job seeker, I want my hard blockers applied automatically, so that I never review a role that cannot work.",
      "As a job seeker, I want to set my own status on each role, so that the agent never overwrites my decisions.",
    ],
    requirements: [
      { id: "R1", priority: "P0", title: "Weekday agent run", detail: "A scheduled agent searches job sources and portals each weekday.", acceptance: "New postings appear as rows with a source link and posting date." },
      { id: "R2", priority: "P0", title: "Hard blocker filters", detail: "My own blockers are written into the agent's instructions as rules.", acceptance: "Roles that match a blocker are not recorded as openings." },
      { id: "R3", priority: "P0", title: "Fit rating", detail: "Each opening gets a rating against my profile.", acceptance: "The rating is stored with the row and treated as a guide, not a verdict." },
      { id: "R4", priority: "P0", title: "Human controlled status", detail: "A status field I can change on every row.", acceptance: "The agent never changes a status I set." },
      { id: "R5", priority: "P0", title: "No autonomous actions", detail: "The agent can read and record only.", acceptance: "It never applies to a job and never sends a message to anyone." },
      { id: "R6", priority: "P1", title: "Career portal tracker", detail: "A list of employer career portals across the UAE and Oman.", acceptance: "Each portal is checked as part of the weekday run." },
      { id: "R7", priority: "P1", title: "Freshness view", detail: "Newest postings first, with age shown on each row.", acceptance: "Stale postings are easy to see and ignore." },
      { id: "R8", priority: "P2", title: "Outcome review", detail: "Link radar finds to applications and outcomes.", acceptance: "I can see how many applications started from a radar find." },
    ],
    nfr: [
      { area: "Safety", requirement: "Read and record permissions only, written as explicit hard limits in the instructions." },
      { area: "Auditability", requirement: "Every row keeps its source link and the date it was first seen." },
      { area: "Reliability", requirement: "The agent follows the same rules every run, so results are comparable day to day." },
      { area: "Privacy", requirement: "The database and profile are private to me." },
    ],
    scope: {
      in: ["Weekday scheduled search", "Blocker filters and fit rating", "Shared database with a status I control"],
      out: ["Applying or messaging on my behalf", "Public access", "Any claim of predicting outcomes"],
    },
    metrics: [
      { metric: "Refresh cadence", target: "Every weekday", status: "Met" },
      { metric: "Freshness", target: "Postings recorded within one weekday of publication", status: "Not yet measured" },
      { metric: "Precision", target: "Share of recorded rows that pass my own review", status: "Not yet measured" },
      { metric: "Applications that started from a radar find", target: "To be set after a month of use", status: "Not yet measured" },
    ],
    phases: [
      { name: "Prototype", detail: "Weekday agent, shared database, blockers and fit rating.", state: "Built" },
      { name: "Tighten the rules", detail: "Adjust ratings and blockers from the roles I actually pursue.", state: "Next" },
      { name: "Outcome review", detail: "Measure how many applications came from radar finds.", state: "Later" },
    ],
    risks: [
      { risk: "Duplicate or stale postings across sources.", mitigation: "Record the source and first seen date, and match on title and company." },
      { risk: "Ratings give false confidence.", mitigation: "Label them as a guide and review every row myself." },
      { risk: "An agent acts on my behalf by mistake.", mitigation: "Explicit hard limits and read only permissions." },
    ],
    open: ["Which sources produce the most roles I actually pursue?", "How should blockers change as my search narrows?"],
  },

  "wakeful-morning": {
    meta: { version: "0.1 prototype", status: "Working cross platform prototype", owner, updated },
    overview: "A mobile alarm and morning focus app for heavy sleepers. Instead of a snooze button, the alarm keeps ringing until the user completes a sequence of wake challenges: walking, a camera check at a chosen wake location and a short movement task, followed by a focus reminder. The prototype is built with managed Expo and structured so that native alarm modules can replace the managed parts later.",
    goals: [
      "Make it hard to dismiss an alarm and fall back asleep.",
      "Confirm that the user is physically up, moving and awake.",
      "Protect the first minutes of the morning with a focus step.",
      "Be honest about what the platform can and cannot guarantee.",
    ],
    nonGoals: [
      "No claim of overriding silent mode or Do Not Disturb in the managed prototype.",
      "No real blocking of other apps. Focus mode is a reminder only.",
      "No face recognition, GPS verification or machine learning scene matching.",
    ],
    personas: [{ name: "Heavy sleeper", need: "An alarm that cannot be dismissed half asleep, with an exit if something goes wrong." }],
    stories: [
      "As a heavy sleeper, I want the alarm to continue until I complete a challenge, so that I cannot go back to sleep.",
      "As a user, I want to preview and choose my alarm sound, so that waking up is not unpleasant.",
      "As a user, I want an assisted exit, so that I am never trapped by my own alarm.",
    ],
    requirements: [
      { id: "W1", priority: "P0", title: "Alarm management", detail: "Create, edit, enable, disable and delete alarms.", acceptance: "Alarms persist on the device." },
      { id: "W2", priority: "P0", title: "Notification delivery", detail: "Local notifications, with a maximum importance channel on Android.", acceptance: "A scheduled alarm raises a notification with sound and vibration while the app is running." },
      { id: "W3", priority: "P0", title: "Looping alarm audio", detail: "Looping sound with preview, sound selection, a volume ramp over about 15 seconds and haptics.", acceptance: "Audio continues through every challenge screen and stops only on success or an assisted exit." },
      { id: "W4", priority: "P0", title: "Wake challenge flow", detail: "Walking, then a camera check, then a 20 second movement challenge, then focus.", acceptance: "The alarm stops only when the sequence is complete." },
      { id: "W5", priority: "P0", title: "Wake location check", detail: "A reference photo of the wake location compared with a live photo.", acceptance: "The check is a labelled image fingerprint heuristic and is described that way in the interface." },
      { id: "W6", priority: "P1", title: "Morning focus reminder", detail: "A reminder after waking to start the first task.", acceptance: "Clearly labelled as a reminder, not app blocking." },
      { id: "W7", priority: "P1", title: "Permission handling", detail: "Handles granted, denied, restricted and unavailable states.", acceptance: "Each state has a clear explanation and a safe fallback." },
      { id: "W8", priority: "P1", title: "Web simulation", detail: "A simulation mode for web with guarded native calls.", acceptance: "No sensor, camera or notification call is made on web." },
      { id: "W9", priority: "P2", title: "Native alarm modules", detail: "Swap the alarm scheduler and audio services for native implementations.", acceptance: "The interface does not change when the services are replaced." },
    ],
    nfr: [
      { area: "Persistence", requirement: "Alarms, settings, onboarding, history and the active alarm session are stored on the device." },
      { area: "Safety", requirement: "An assisted exit always exists. Safety requirements are defined before features." },
      { area: "Architecture", requirement: "Swappable service interfaces for scheduling, audio and app blocking." },
      { area: "Quality", requirement: "TypeScript checks, linting and Jest tests." },
      { area: "Honesty", requirement: "Interface copy never claims capabilities the platform does not provide." },
    ],
    scope: {
      in: ["Alarms, looping audio, challenge flow, wake location photo, focus reminder, local storage and web simulation"],
      out: ["Guaranteed delivery after force quit", "Silent mode and Do Not Disturb override", "Cross app blocking", "Cloud accounts"],
    },
    metrics: [
      { metric: "Wake success rate", target: "Alarm dismissed only after a completed challenge", status: "Not yet measured on real mornings" },
      { metric: "Camera check accuracy", target: "Low false negatives in normal lighting", status: "Not yet measured" },
      { metric: "Alarm reliability after force quit", target: "Reliable on native builds", status: "Not available in managed Expo" },
    ],
    phases: [
      { name: "Prototype on managed Expo", detail: "Full challenge flow, local storage and web simulation.", state: "Built" },
      { name: "Native Android", detail: "Exact alarms, a foreground service and full screen alerts.", state: "Next" },
      { name: "Native iOS", detail: "AlarmKit or critical alerts and a stronger audio session.", state: "Later" },
      { name: "Optional app blocking", detail: "Screen Time on iOS and Usage Access on Android through custom native modules.", state: "Later" },
    ],
    risks: [
      { risk: "Scheduled notifications may not fire after a force quit.", mitigation: "Move to native alarms. Document the limit until then." },
      { risk: "Android battery savers delay notifications and background audio.", mitigation: "Native foreground service and user guidance." },
      { risk: "The camera heuristic produces false results with lighting changes.", mitigation: "Label it honestly and keep an assisted exit." },
      { risk: "Silent mode and Do Not Disturb can mute lock screen sounds.", mitigation: "Do not claim an override. Use native alarm audio sessions later." },
    ],
    open: ["How many challenges are too many for a half awake user?", "Which native platform to build first?"],
    limits: [
      "Managed Expo cannot guarantee alarm delivery after force quit.",
      "Silent mode and Do Not Disturb are not overridden.",
      "Camera verification is a rough heuristic.",
      "Pedometer availability varies, so an accelerometer fallback is used.",
      "Focus mode is a reminder only.",
    ],
  },

  "arte-creative-hub": {
    meta: { version: "0.1 concept", status: "Concept with demo and walkthrough", owner: "Mark Jerome Gomez, product lead", updated },
    overview: "A creative technology studio inside an events and creative agency. Its first product is one connected platform for conferences and corporate events that covers the guest journey from invitation to follow up, and the organiser's view of the event as it happens. The agency runs the platform for each client as a service.",
    goals: [
      "Replace spreadsheets, chat threads and paper lists with one guest record.",
      "Let guests register in under a minute and carry their ticket on their phone.",
      "Remove queues at the door with QR check in.",
      "Give organisers real time data during the event and a follow up afterwards.",
    ],
    nonGoals: ["No standalone software for clients to adopt. The agency operates it.", "No development before the full guest journey is designed and demonstrated."],
    personas: [
      { name: "Event organiser", need: "One place for invitations, guest lists, check in and results." },
      { name: "Guest", need: "A fast, clear journey from invitation to entry and follow up." },
      { name: "Business association or corporate team", need: "A branded event experience without new software to learn." },
    ],
    requirements: [
      { id: "A1", priority: "P0", title: "Branded invitation", detail: "An invitation with one tap RSVP.", acceptance: "A guest responds from the invitation without creating an account." },
      { id: "A2", priority: "P0", title: "Mobile registration", detail: "Mobile first registration.", acceptance: "Registration takes under a minute." },
      { id: "A3", priority: "P0", title: "QR ticket", detail: "An instant QR ticket, calendar invite and reminders.", acceptance: "The ticket lives on the phone and is ready immediately after registration." },
      { id: "A4", priority: "P0", title: "QR check in", detail: "Scan at the entrance and print a badge.", acceptance: "A guest is checked in and holds a badge in seconds." },
      { id: "A5", priority: "P1", title: "Live program", detail: "A live program with Q&A and polls.", acceptance: "Guests can ask questions and vote during sessions." },
      { id: "A6", priority: "P1", title: "Organiser dashboard", detail: "Registrations, check ins and session ratings in real time.", acceptance: "The organiser sees the state of the event without asking anyone." },
      { id: "A7", priority: "P1", title: "Post event follow up", detail: "Follow up messages and results from the shared guest record.", acceptance: "Follow up uses the same record as registration and check in." },
    ],
    nfr: [
      { area: "Mobile first", requirement: "Guest screens are designed for phones first, with tablet check in at the door." },
      { area: "Brand", requirement: "Each event can carry its own branding across invitation, ticket and badge." },
      { area: "Delivery model", requirement: "Operated by the agency per event, so clients need no onboarding." },
    ],
    scope: {
      in: ["The guest journey from invitation to follow up", "Organiser dashboard", "A studio website and a two minute narrated walkthrough"],
      out: ["Self service software for clients", "Full development before a first live event"],
    },
    metrics: [
      { metric: "Registration time", target: "Under one minute", status: "Design target, not yet tested with guests" },
      { metric: "Check in at the door", target: "To be set after the first live event", status: "Not measured" },
      { metric: "Organiser data after the event", target: "Registrations, attendance and ratings in one dashboard", status: "Designed in the demo" },
    ],
    phases: [
      { name: "Concept, website and walkthrough", detail: "Studio offer, five page website, event platform demo and narrated walkthrough.", state: "Done" },
      { name: "MVP for a first live event", detail: "Build the minimum platform for one real event.", state: "Next" },
    ],
    risks: [
      { risk: "Events vary widely, so a single flow may not fit every client.", mitigation: "Run the first event closely and adjust the flow." },
      { risk: "Live event conditions such as poor connectivity at the door.", mitigation: "Plan an offline friendly check in and a manual fallback." },
    ],
    open: ["Which event type should be the first live test?", "What should the first measurement targets be?"],
  },

  "aldar-connected-communities": {
    meta: { version: "Summary", status: "Completed employer work, kept high level", owner: "Mark Jerome Gomez, Product Owner and Smart City Lead", updated },
    overview: "Smart community technology across Saadiyat, Mamsha and The Grove, moving from master plan vision to daily operations. The work spanned smart home, mobility, parking, building intelligence, a resident app, predictive maintenance and a Command and Control Centre, coordinated across several vendors and internal ICT, sustainability and operations teams.",
    goals: [
      "Turn the smart community vision into operating platforms across several developments.",
      "Choose and sequence use cases with a repeatable, vendor agnostic method.",
      "Track adoption after deployment, not only delivery.",
    ],
    personas: [
      { name: "Residents", need: "Services such as parking and smart home that work every day." },
      { name: "Operations and sustainability teams", need: "Monitoring, faster response to failures and lower energy use." },
      { name: "ICT and vendors", need: "Clear requirements and integration scope." },
    ],
    scope: {
      in: ["Smart home, mobility and parking, building intelligence, the Harbour resident app, predictive maintenance and the Command and Control Centre", "Vendor coordination with Siemens, ID Cube and Parkonic", "MVP site selection criteria and post deployment adoption tracking"],
      out: ["Proprietary commercial and technical detail, which is omitted here"],
    },
    metrics: [
      { metric: "Monitoring efficiency", target: "Improve", status: "About 30% better" },
      { metric: "Response to infrastructure failures", target: "Faster", status: "About 40% faster" },
      { metric: "Energy costs", target: "Lower", status: "About 25% lower" },
      { metric: "Digital platforms portfolio", target: "Deliver", status: "AED 30M+ in value" },
    ],
    note: "Employer work. Results are approximate and proprietary detail is left out.",
  },

  "terminus-presales-programmes": {
    meta: { version: "Summary", status: "Completed employer work, kept high level", owner: "Mark Jerome Gomez, Product and Presales Manager", updated },
    overview: "Presales and solution definition for municipal, destination and smart home opportunities across the GCC, turning enterprise and government needs into solutions that engineering could validate and deliver.",
    goals: [
      "Translate client needs into clear solution definitions.",
      "Confirm feasibility with engineering and solution architecture before committing.",
      "Document requirements and integration so delivery teams start from a shared specification.",
    ],
    personas: [
      { name: "Government and enterprise clients", need: "A credible, deliverable solution for their problem." },
      { name: "Engineering and solution architects", need: "Requirements they can validate." },
    ],
    scope: {
      in: ["A Dubai Municipality wastewater management initiative", "Miral Smart Destination and Al Wasl Smart Home", "An Aldar smart home mock up villa", "Terminus AI City Operating System (TacOS) and IoC digital twin solutions", "Product requirement documents and integration specifications"],
      out: ["Commercial terms and client confidential detail"],
    },
    note: "Employer work. Contributed to proposals, solution definition and requirements. No outcome figures are claimed.",
  },

  "disrupt-x-iot-platforms": {
    meta: { version: "Summary", status: "Completed employer work, kept high level", owner: "Mark Jerome Gomez, Product Engineer then Product Manager", updated },
    overview: "IoT SaaS for smart city and enterprise clients in the UAE, Saudi Arabia and Oman. Clients were buying IoT hardware but struggling to turn it into operational value, so adoption, not connectivity, was the bottleneck.",
    goals: [
      "Own the lifecycle from concept to market deployment.",
      "Improve onboarding and product market fit.",
      "Run structured quality assurance and cross functional testing before each deployment.",
    ],
    personas: [
      { name: "Facility and operations teams", need: "Live visibility of conditions and assets." },
      { name: "Enterprise and government clients", need: "Operational value from IoT, not just devices." },
    ],
    scope: {
      in: ["Connectivity across LoRaWAN, NB-IoT, Sigfox, BLE and cellular", "Environmental monitoring, asset tracking and occupancy tracking deployments", "User acceptance testing"],
      out: ["Client confidential configuration"],
    },
    metrics: [
      { metric: "Platform adoption", target: "Grow", status: "About 15% growth" },
      { metric: "User acceptance testing success", target: "High", status: "95%+ across deployments" },
    ],
    note: "Employer work. Figures are approximate.",
  },
  "abu-dhabi-equestrian-club": {
    meta: { version: "Summary", status: "Completed client work, kept high level", owner: "Disrupt-X product team", updated },
    overview: "Environmental monitoring for an equestrian club, with live ambient data in one view for the operations team. Delivered on the Disrupt-X IoT SaaS platform.",
    goals: ["Give the operator one live view instead of manual checks.", "Turn connected devices into operational value, since adoption and not connectivity was the bottleneck.", "Confirm the deployment worked through structured testing and user acceptance testing before handover."],
    personas: [{ name: "Operations team", need: "Facility and operations teams responsible for stables, arenas and public areas." }],
    scope: { in: ["Environmental Monitoring", "Platform onboarding and user acceptance testing"], out: ["Client confidential configuration, device counts and figures"] },
    note: "Client project at Disrupt-X. Detail is kept high level and no project level figures are claimed. Disrupt-X wide results appear on the Disrupt-X IoT SaaS Platforms page.",
  },
  "emirates-golf-club": {
    meta: { version: "Summary", status: "Completed client work, kept high level", owner: "Disrupt-X product team", updated },
    overview: "Environmental monitoring and asset tracking for a golf club, covering conditions on site and the equipment that moves around it. Delivered on the Disrupt-X IoT SaaS platform.",
    goals: ["Give the operator one live view instead of manual checks.", "Turn connected devices into operational value, since adoption and not connectivity was the bottleneck.", "Confirm the deployment worked through structured testing and user acceptance testing before handover."],
    personas: [{ name: "Operations team", need: "Grounds, facilities and operations teams." }],
    scope: { in: ["Environmental Monitoring", "Asset Tracking", "Platform onboarding and user acceptance testing"], out: ["Client confidential configuration, device counts and figures"] },
    note: "Client project at Disrupt-X. Detail is kept high level and no project level figures are claimed. Disrupt-X wide results appear on the Disrupt-X IoT SaaS Platforms page.",
  },
  "masdar-city": {
    meta: { version: "Summary", status: "Completed client work, kept high level", owner: "Disrupt-X product team", updated },
    overview: "Smart city solutions with environmental monitoring and occupancy tracking in a sustainable city district. Delivered on the Disrupt-X IoT SaaS platform.",
    goals: ["Give the operator one live view instead of manual checks.", "Turn connected devices into operational value, since adoption and not connectivity was the bottleneck.", "Confirm the deployment worked through structured testing and user acceptance testing before handover."],
    personas: [{ name: "Operations team", need: "City district operators, facility managers and sustainability teams." }],
    scope: { in: ["Smart City Solutions", "Environmental Monitoring", "Occupancy Tracking", "Platform onboarding and user acceptance testing"], out: ["Client confidential configuration, device counts and figures"] },
    note: "Client project at Disrupt-X. Detail is kept high level and no project level figures are claimed. Disrupt-X wide results appear on the Disrupt-X IoT SaaS Platforms page.",
  },
  "al-ghurair-centre": {
    meta: { version: "Summary", status: "Completed client work, kept high level", owner: "Disrupt-X product team", updated },
    overview: "Environmental monitoring and asset tracking for a large commercial and retail centre. Delivered on the Disrupt-X IoT SaaS platform.",
    goals: ["Give the operator one live view instead of manual checks.", "Turn connected devices into operational value, since adoption and not connectivity was the bottleneck.", "Confirm the deployment worked through structured testing and user acceptance testing before handover."],
    personas: [{ name: "Operations team", need: "Building and facilities management teams." }],
    scope: { in: ["Environmental Monitoring", "Asset Tracking", "Platform onboarding and user acceptance testing"], out: ["Client confidential configuration, device counts and figures"] },
    note: "Client project at Disrupt-X. Detail is kept high level and no project level figures are claimed. Disrupt-X wide results appear on the Disrupt-X IoT SaaS Platforms page.",
  },
  "al-wasl-residence": {
    meta: { version: "Summary", status: "Completed client work, kept high level", owner: "Disrupt-X product team", updated },
    overview: "Smart city solutions and environmental monitoring for a residential development. Delivered on the Disrupt-X IoT SaaS platform.",
    goals: ["Give the operator one live view instead of manual checks.", "Turn connected devices into operational value, since adoption and not connectivity was the bottleneck.", "Confirm the deployment worked through structured testing and user acceptance testing before handover."],
    personas: [{ name: "Operations team", need: "Community management teams and residents." }],
    scope: { in: ["Smart City Solutions", "Environmental Monitoring", "Platform onboarding and user acceptance testing"], out: ["Client confidential configuration, device counts and figures"] },
    note: "Client project at Disrupt-X. Detail is kept high level and no project level figures are claimed. Disrupt-X wide results appear on the Disrupt-X IoT SaaS Platforms page.",
  },
};
