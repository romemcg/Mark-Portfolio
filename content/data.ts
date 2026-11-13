// All public content lives here. Edit this file (or the typed objects below) to change the site.
// All public content lives here.

export const site = {
  url: "https://mark-gomez.vercel.app", // production URL: single constant used for canonical, Open Graph, sitemap and robots
  name: "Mark Gomez",
  fullName: "Mark Jerome Castillo Gomez",
  seoName: "Mark Jerome Gomez",
  title: "Mark Gomez",
  tagline: "Technical product manager, AIoT and smart city platforms, based in the UAE.",
  email: "mjerome.gomez@gmail.com",
  phone: "+971558443157",
  phoneDisplay: "+971 55 844 3157",
  linkedin: "https://www.linkedin.com/in/romemcg",
  github: "https://github.com/romemcg",
  base: "United Arab Emirates",
  home: "Batangas, Philippines",
  updated: "22 October 2026",
  // Set to a Formspree (or similar) endpoint to turn the contact form on. Leave empty for email only.
  formEndpoint: "",
};

// Rotating hero subtitle (components/Hero.tsx cycles through these every 2.6 s). Keep the full sequence.
export const identity = [
  "Engineer by training.",
  "AI product manager.",
  "Builder by curiosity.",
  "Product thinker.",
  "Always evolving.",
];

export type Status = "Concept" | "Research" | "Prototype" | "In Development" | "Launched" | "Archived";

export type Outcome = { value: string; label: string; where: string };
export const outcomes: Outcome[] = [
  { value: "~40%", label: "faster infrastructure failure response", where: "Aldar" },
  { value: "~30%", label: "gain in monitoring efficiency", where: "Aldar" },
  { value: "~25%", label: "lower energy costs", where: "Aldar" },
  { value: "~15%", label: "platform adoption growth", where: "Disrupt-X" },
];

export type Role = {
  id: string;
  logo?: string;
  company: string;
  place: string;
  title: string;
  earlier?: string;
  dates: string;
  start: number; // year, for ordering
  summary: string;
  bullets: string[];
  tools: string[];
  transferable: string[];
};

export const roles: Role[] = [
  {
    id: "terminus",
    company: "Terminus Group",
    place: "Dubai, UAE",
    title: "Product Manager, Enterprise AI and IoT Platforms",
    dates: "Oct 2025 to Aug 2026",
    start: 2025,
    summary: "AIoT and Digital Twin platforms for large real estate and infrastructure portfolios across the GCC, with presales and solution definition alongside product ownership.",
    bullets: [
      "Owned product definition and the documentation suite: PRDs, system blueprints and integration flow specifications across device, middleware and application layers.",
      "Structured and prioritised the roadmap from field deployment feedback, system constraints and long term scalability.",
      "Set technical governance standards covering cybersecurity, data integrity and lifecycle maintainability.",
      "Supported presales and solution development for enterprise and government opportunities, including Dubai Municipality wastewater management, Miral Smart Destination and Al Wasl Smart Home.",
      "Supported portfolio development for Terminus' AI City Operating System (TacOS) and IoC digital twin command centre solutions.",
    ],
    tools: ["PRDs", "System blueprints", "Integration specs", "Digital twin", "AIoT", "AI City OS (TacOS)"],
    transferable: ["AI and AIoT product strategy", "Presales and solution framing", "Technical governance"],
  },
  {
    id: "aldar",
    company: "Aldar Properties PJSC",
    place: "Abu Dhabi, UAE",
    title: "Product Owner and Smart City Lead, Digital Platforms",
    dates: "Oct 2024 to Oct 2025",
    start: 2024,
    summary: "Took smart community technology from master plan vision to daily operations across Saadiyat, Mamsha and The Grove, with multiple vendors and thousands of homes.",
    bullets: [
      "Owned digital use cases, technical standards and integration frameworks across IoT, mobility, parking and building intelligence, for a digital platforms portfolio valued at AED 30M+.",
      "Coordinated Siemens, ID Cube, Parkonic and internal ICT, sustainability and operations teams through design, integration, testing and acceptance.",
      "Designed the Smart City Solution Blueprint, a reusable scoring framework for use cases and vendors, applied across three developments.",
      "Set MVP site selection criteria and post deployment adoption tracking.",
      "Platform and workflow improvements contributed to about 30% better environmental monitoring efficiency, about 40% faster infrastructure failure response and about 25% lower energy costs.",
    ],
    tools: ["Power BI", "Jira", "RAID and change control", "Vendor management", "Requirements"],
    transferable: ["Multi vendor delivery", "Stakeholder alignment", "Framework design"],
  },
  {
    id: "disruptx",
    company: "Disrupt-X DMCC",
    place: "Dubai, UAE",
    title: "Product Manager, IoT Solutions and SaaS Platforms",
    earlier: "Product Engineer, Mar 2023 to Aug 2023, then Product Manager",
    dates: "Mar 2023 to Oct 2024",
    start: 2023,
    summary: "Promoted from Product Engineer to Product Manager within six months. Owned IoT SaaS platforms for smart city and enterprise clients across the UAE, Saudi Arabia and Oman.",
    bullets: [
      "Led product development for IoT SaaS platforms from concept to market deployment.",
      "Grew platform adoption by about 15% by improving onboarding and product market fit.",
      "Held a 95%+ UAT success rate across deployments through structured QA and cross functional testing.",
      "Represented the company at GITEX Dubai and supported presales and solution scoping.",
      "As Product Engineer: tested and integrated devices over LoRaWAN, NB-IoT, Sigfox, BLE, Wi-Fi and cellular, and wrote integration guides and onboarding procedures.",
    ],
    tools: ["LoRaWAN", "NB-IoT", "Sigfox", "BLE", "Cellular", "UAT"],
    transferable: ["Full product lifecycle", "Client discovery", "Quality assurance"],
  },
  {
    id: "samsung",
    company: "Samsung Electro-Mechanics (Philippines)",
    place: "Philippines",
    title: "Product Development Manager",
    earlier: "Product Development Engineer, Jul 2020 to Feb 2022, promoted to Product Development Manager in Feb 2022",
    dates: "Jul 2020 to Feb 2023",
    start: 2020,
    summary: "Electronic components for global manufacturing, from concept validation to mass production, working across R&D, process engineering, quality and production.",
    bullets: [
      "Led product development from concept validation through production ramp up.",
      "Coordinated R&D, process engineering, manufacturing, quality and production teams, including teams at Samsung headquarters in South Korea.",
      "Analysed production and quality data to find root causes and drive process improvement.",
      "Recognised with the Best Practitioner Award, Plating R&D (May 2022) and the Most Improved Process Award (2022).",
    ],
    tools: ["Root cause analysis", "Reliability testing", "Process improvement", "NPI"],
    transferable: ["Systems thinking", "Data informed problem solving", "Shipping when mistakes are costly"],
  },
];

export type Chapter = { id: string; year: string; title: string; kind: "Origin" | "Education" | "Work" | "Milestone" | "Now"; body: string; words?: string };
export const chapters: Chapter[] = [
  { id: "batangas", year: "Home", title: "Batangas, Philippines", kind: "Origin", body: "Batangas is home province. This is where the story starts." },
  { id: "scout", year: "2009 to 2015", title: "Eagle Scout", kind: "Milestone", body: "Six years with the Boy Scouts of the Philippines, finishing as a full pledged Eagle Scout. Leadership, community service and practical skills came from here." },
  { id: "uni", year: "2015 to 2020", title: "BS Electronics Engineering", kind: "Education", body: "University of Batangas. An internship as a system administrator at ResultsCX in 2019 was an early taste of real systems." },
  { id: "samsung", year: "2020 to 2023", title: "Samsung Electro-Mechanics", kind: "Work", body: "First career chapter: electronic components, from R&D concept to mass production. Promoted to Product Development Manager in February 2022.", words: "It taught me what it means to ship when a mistake costs a production line, not a sprint." },
  { id: "licence", year: "Apr 2022", title: "Licensed Electronics Engineer", kind: "Milestone", body: "Passed the Philippine Electronics Engineer Licensure Examination." },
  { id: "uae", year: "2023", title: "Moving to the UAE", kind: "Milestone", body: "Joined Disrupt-X in Dubai as a Product Engineer, then became Product Manager within six months.", words: "I kept applying frameworks I had learned elsewhere, and they did not land until I understood the context. Relationships here are the business layer." },
  { id: "aldar", year: "2024 to 2025", title: "Aldar Properties", kind: "Work", body: "Product Owner and Smart City Lead in Abu Dhabi, moving from owning one product to orchestrating an ecosystem of vendors and operations teams." },
  { id: "mba", year: "2024 to 2025", title: "MBA with Distinction", kind: "Education", body: "Philippine Christian University. Strategy, finance, operations and entrepreneurship, alongside full time work." },
  { id: "terminus", year: "2025 to 2026", title: "Terminus Group", kind: "Work", body: "Product Manager for AIoT and Digital Twin platforms, with presales across the GCC." },
  { id: "now", year: "Today", title: "Building what is next", kind: "Now", body: "Building my own products and learning how to make AI reliable inside real systems. See the Now page for the current picture." },
];

export type Capability = { id: string; name: string; short: string; links: string[]; evidence: string[] };
export const capabilities: Capability[] = [
  { id: "ai", name: "AI Product Management", short: "LLM features, agents, guardrails", links: ["product", "platforms", "research", "data"], evidence: ["CareerOS: an LLM feature that can only select from verified facts, enforced in the database", "Gulf Hiring Radar: a scheduled AI agent that finds and rates openings every weekday, with no autonomous actions", "Terminus: AIoT platforms and the AI City Operating System (TacOS)", "LIFE OS, Smart City Intelligence Hub and Wakeful Morning built with AI assisted development"] },
  { id: "product", name: "Product Strategy", short: "Roadmaps, PRDs, prioritisation", links: ["systems", "platforms", "business", "ai"], evidence: ["Terminus: roadmap built from field feedback and constraints", "Disrupt-X: IoT SaaS from concept to deployment", "LIFE OS: scoped a broad brief into an eight module MVP"] },
  { id: "delivery", name: "Technical Delivery", short: "Multi vendor programmes, UAT", links: ["stakeholders", "analysis", "iot"], evidence: ["Aldar: Siemens, ID Cube and Parkonic through acceptance", "Disrupt-X: 95%+ UAT success rate", "Samsung: concept to mass production"] },
  { id: "systems", name: "Systems Thinking", short: "Engineering mindset", links: ["product", "iot", "research"], evidence: ["Electronics Engineering degree and licence", "Samsung: root cause analysis on production data", "Smart City Intelligence Hub: protocols and architectures mapped as a graph"] },
  { id: "analysis", name: "Business Analysis", short: "Requirements and use cases", links: ["delivery", "data", "platforms"], evidence: ["Aldar: use case and integration frameworks", "Terminus: system blueprints and integration flow specs", "Smart City Solution Blueprint"] },
  { id: "platforms", name: "Digital Platforms", short: "Enterprise and SaaS", links: ["product", "analysis", "iot", "ai"], evidence: ["Terminus: AIoT and Digital Twin platforms", "Disrupt-X: IoT SaaS platforms", "Technical governance across cybersecurity and data integrity"] },
  { id: "research", name: "Research and Prototyping", short: "Learn, build, test", links: ["systems", "business", "data", "ai"], evidence: ["Smart City Intelligence Hub", "Wakeful Morning prototype in Expo and React Native", "CareerOS and LIFE OS"] },
  { id: "stakeholders", name: "Stakeholder Management", short: "Across cultures and functions", links: ["delivery", "business"], evidence: ["Government, developers, vendors and operations at Aldar", "Clients in the UAE, Saudi Arabia and Oman at Disrupt-X", "Teams at Samsung headquarters in South Korea"] },
  { id: "data", name: "Data Informed Decisions", short: "Measure, then decide", links: ["analysis", "research", "ai"], evidence: ["Aldar: post deployment adoption tracking", "Power BI dashboards for executives", "Samsung: production and quality data analysis"] },
  { id: "iot", name: "IoT and AIoT", short: "Connected technologies", links: ["systems", "delivery", "platforms"], evidence: ["LoRaWAN, NB-IoT, Sigfox, BLE, Wi-Fi, cellular integration", "Digital twin and smart city programmes", "Smart City Intelligence Hub: 22+ protocols"] },
  { id: "business", name: "Business and Entrepreneurial Thinking", short: "MBA, products, presales", links: ["product", "stakeholders", "research"], evidence: ["MBA with Distinction", "Presales at Disrupt-X and Terminus", "Five products built on my own time"] },
];

export type Project = {
  slug: string;
  name: string;
  status?: Status;
  type: "Personal" | "Professional";
  period: string;
  blurb: string;
  tech: string[];
  problem?: string;
  users?: string;
  role?: string;
  approach?: string[];
  decisions?: string[];
  results?: string[];
  roadmap?: string[];
  links?: { label: string; href: string }[];
  shot?: { src: string; alt: string; caption: string };
  cover?: string;
  flow?: string[];
  gallery?: { src: string; alt: string; caption: string }[];
  features?: string[];
  challenges?: string[];
  caseStudies?: string[];
  parent?: string;
};

export const projects: Project[] = [
  {
    slug: "smart-city-intelligence-hub",
    name: "Smart City Intelligence Hub",
    status: "In Development",
    type: "Personal",
    period: "May 2026 to present",
    blurb: "A free, interactive platform that maps the smart city and IoT ecosystem as one connected knowledge graph.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "React Flow"],
    problem: "Information in smart cities and IoT is fragmented. MQTT is explained in one place, digital twins in another and smart buildings somewhere else, so it is hard to see how it all connects. Newcomers do not know where to start, and practitioners rarely get one place that links protocols, subsystems, use cases and real deployments.",
    users: "People entering or advancing in smart cities, IoT and product management, from complete beginners to technical engineers and product managers preparing for interviews.",
    role: "Product owner, designer and builder. I defined the content model, wrote the explanations, designed the navigation and built the site with AI assisted development.",
    features: [
      "Protocol library: 22+ IoT protocols, from MQTT and CoAP to LoRaWAN and NB-IoT, each explained with a plain analogy first and technical depth after.",
      "Subsystems: 10+ core smart city subsystems such as BMS, SCADA and GIS, and how they interact.",
      "Use case library: 18+ use cases with problem statement, architecture, KPIs and ROI notes, for example smart parking, waste and street lighting.",
      "Global deployments: 10 real programmes, from Singapore to NEOM, with transferable lessons.",
      "Knowledge graph: 150+ linked concepts you can explore by connection instead of by list.",
      "Career and interview sections: 5 career paths with 30, 60 and 90 day plans, a market view, a glossary and product manager interview preparation.",
    ],
    approach: [
      "Four starting paths on the home page: Complete Beginner, IoT Technical, Product Manager and Global Projects, so each visitor gets an order to read in.",
      "Every concept links to related protocols, subsystems and use cases, so the graph is the navigation, not an extra.",
      "Beginner first writing. Each protocol opens with an everyday analogy, then moves to architecture and trade offs.",
    ],
    decisions: [
      "Learning paths over a flat library. A visitor who does not know what to open first leaves, so the home page asks who they are.",
      "The graph is a primary view, not a decoration. The point of the product is the connections.",
      "Free and open. It started as my own learning tool and works best when practitioners can test and correct it.",
    ],
    challenges: [
      "Keeping depth consistent across 22+ protocols and 18+ use cases. A content template for each type kept entries comparable.",
      "Making a dense graph readable. Grouping and filtering matter more than adding more nodes.",
      "Accuracy. I am a practitioner, not a reference publisher, so feedback from other practitioners is the quality check.",
    ],
    results: ["Started as a personal learning tool. I now use it for research, client conversations and solution design."],
    roadmap: ["Gather feedback from practitioners", "Decide what to add next, based on what users ask for"],
    gallery: [
      { src: "/img/projects/hub-home.webp", alt: "Smart City Intelligence Hub home page with platform statistics and four starting paths", caption: "Home page: platform coverage at a glance and four starting paths." },
      { src: "/img/projects/hub-graph.webp", alt: "Interactive knowledge graph of smart city and IoT concepts", caption: "Knowledge graph: concepts linked by how they relate." },
      { src: "/img/projects/hub-protocols.webp", alt: "Protocol library listing IoT protocols with plain language explanations", caption: "Protocol library, explained from beginner to technical depth." },
      { src: "/img/projects/hub-usecases.webp", alt: "Use case library with smart parking, waste and street lighting", caption: "Use cases with problem, architecture and ROI." },
      { src: "/img/projects/hub-architecture.webp", alt: "Solution architecture reference page", caption: "Reference architectures with KPIs and implementation notes." },
      { src: "/img/projects/hub-career.webp", alt: "Career paths page with 30, 60 and 90 day plans", caption: "Career paths with 30, 60 and 90 day plans." },
    ],
    caseStudies: ["smart-education-smart-cities"],
    links: [
      { label: "Live platform", href: "https://smart-city-intelligence-hub.vercel.app" },
    ],
  },
  {
    slug: "life-os",
    name: "LIFE OS (Project 2035)",
    status: "Prototype",
    type: "Personal",
    period: "2026 to present",
    blurb: "A local first planning app that connects long term goals to what to do today, and adapts when you fall behind.",
    tech: ["Next.js", "TypeScript", "SQLite", "Automated tests"],
    problem: "Goals fall apart the first time you miss a week. Goals lived in notes, numbers lived in my head, and daily tasks had no link to either. Most planners punish a bad week by piling up overdue items.",
    users: "Someone in a transition, rebuilding routines, money or a career, who wants structure without guilt and does not want to hand personal data to a cloud service.",
    role: "Product owner, designer and builder. I wrote the product requirements, the data model and the calculation rules, then built and tested the app with AI assisted development.",
    features: [
      "Command Center: the day's top priorities, deadlines and weekly progress on one screen.",
      "Today with three capacity modes. Minimum Day allows up to 3 tasks in 60 minutes, Standard up to 5 in 240, and Deep Work up to 6 in 360. Whatever does not fit goes to Later, never deleted.",
      "Explainable ranking. Hover a task to see why it ranked where it did: priority, life stage weight, due date and whether it is essential.",
      "Roadmap from 2026 to 2035 with ages calculated from the full birth date, plus a vision board linked to nine life pillars.",
      "Career pipeline for applications, interviews and follow ups.",
      "Finances split into actuals and scenarios. Runway and debt payoff stay blank until real numbers are entered, and projections are labelled as scenarios.",
      "Check ins for energy, mood, a win and a blocker, and a weekly review with statistics calculated for you.",
      "Export and restore as JSON, because personal data should be portable.",
    ],
    approach: [
      "Every long term goal is cut into milestones and small daily actions.",
      "Plans adapt to capacity. A missed task can move to tomorrow, next week or a chosen date, and tasks moved three or more times are flagged to shrink or drop.",
      "Built local first on a single SQLite file, with an optional passcode if it is ever exposed beyond my own machine.",
    ],
    decisions: [
      "Staged, not parallel. Six ordered life stages, one in focus at a time, because nine areas competing for attention is how people quit.",
      "A Minimum Day. Every routine has a smaller version that still counts, because the product is judged on whether it survives a bad week.",
      "Plans are seeded, facts are not. No balance, application or achievement is pre filled, so every number on screen was entered by the user.",
      "Scope is a feature. A broad brief became eight modules. The rest is sequenced, not dropped, and unbuilt screens are listed as unavailable.",
    ],
    challenges: [
      "Deciding what the app should refuse to guess. Missing financial inputs leave runway empty instead of showing a made up number.",
      "Keeping date maths right. Ages, weeks and recurrence are covered by unit tests so a birthday or month end does not break the plan.",
      "Honest limits. It is single user, has no automatic notifications yet, and I have not proven it changes how I follow through. That needs weeks of real use.",
    ],
    results: [
      "Works as a personal tool, with a public demo on fictional data.",
      "21 unit tests cover ages, dates, recurrence, runway, debt repayment, avalanche and snowball ordering, and planner capacity.",
    ],
    roadmap: ["Keep using it daily and fix what breaks", "Decide whether it is useful to anyone but me"],
    gallery: [
      { src: "/img/projects/lifeos-dashboard.webp", alt: "LIFE OS command center dashboard", caption: "Command Center. Demo with fictional data." },
      { src: "/img/projects/lifeos-today.webp", alt: "LIFE OS Today screen with capacity modes", caption: "Today: pick a capacity mode and see only what fits." },
      { src: "/img/projects/lifeos-roadmap.webp", alt: "LIFE OS roadmap through 2035", caption: "Roadmap with life stages and milestones." },
      { src: "/img/projects/lifeos-career.webp", alt: "LIFE OS career pipeline", caption: "Career pipeline with next actions." },
      { src: "/img/projects/lifeos-finances.webp", alt: "LIFE OS finances screen with actuals and scenarios", caption: "Finances: actuals kept separate from scenarios." },
      { src: "/img/projects/lifeos-checkins.webp", alt: "LIFE OS daily check ins", caption: "Check ins for energy, mood, wins and blockers." },
    ],
    caseStudies: ["personal-execution-system"],
    links: [
      { label: "Live demo (fictional data)", href: "https://lifeos35-demo.vercel.app" },
      { label: "Code on GitHub", href: "https://github.com/romemcg/life-os" },
      { label: "Walkthrough (LinkedIn)", href: "https://lnkd.in/dT7yqCMx" },
    ],
  },
  {
    slug: "careeros",
    name: "CareerOS",
    status: "In Development",
    type: "Personal",
    period: "2026 to present",
    blurb: "A local desktop app for job search that builds tailored CVs from verified facts only, so it cannot invent claims.",
    tech: ["LLM API", "Tauri 2", "React", "TypeScript", "SQLite", "Rust"],
    problem: "Tailoring a CV for every role by hand is slow, and AI tools are happy to invent metrics. A CV that cannot survive a background check is worse than none.",
    users: "Me first. Anyone who needs to tailor applications without fabricating.",
    role: "Product owner, designer and builder. I wrote the build brief and the rules the system must never break, and I am building it milestone by milestone.",
    features: [
      "Fact base: import a master CV and split it into individual facts, each marked unverified until I confirm it.",
      "Job match: paste a job description and see which verified facts answer each requirement, and where there is a gap.",
      "Tailored CV: generate a CV in the exact master template from verified facts only, then review and approve it.",
      "Application tracking kept on the same machine.",
    ],
    approach: [
      "Import a master CV, verify each fact, then match facts against a job description.",
      "Generate a tailored CV from verified facts in an exact template. A golden render test compares the output against the master pixel by pixel.",
      "Everything runs locally on the Mac. The API key lives in the system keychain, never in the interface.",
    ],
    decisions: [
      "The database itself enforces that only verified facts can appear on a CV.",
      "The AI only selects and orders pre verified bullets. It never writes new claims.",
      "Local first, because a job search holds private data.",
      "Milestones with gates. Each milestone ends with automated checks before the next one starts.",
    ],
    challenges: [
      "Making the rule structural. A prompt that says do not invent can be ignored, so the constraint sits in the data layer.",
      "Reproducing a CV template exactly. The golden render test catches layout drift.",
      "Keeping real personal data out of the repository. Inputs are git ignored and tests use synthetic fixtures.",
    ],
    results: ["Fact base and verified fact rules are built and tested, and the template render passes its golden check. The full paste a job description to approved CV flow is next."],
    roadmap: ["Finish the paste a job description, review, approve, generate flow", "Use it on real applications and measure what helps"],
    gallery: [
      { src: "/img/projects/careeros-facts.webp", alt: "Illustration of the CareerOS fact base with verified and unverified facts", caption: "Fact base. Illustrative mockup with sample data, not a screenshot." },
      { src: "/img/projects/careeros-match.webp", alt: "Illustration of matching a job description to verified facts", caption: "Job match. Gaps stay gaps, nothing is invented. Illustrative mockup." },
      { src: "/img/projects/careeros-cv.webp", alt: "Illustration of a tailored CV generated from verified facts", caption: "Tailored CV from verified facts in the master template. Illustrative mockup." },
    ],
    flow: ["Master CV", "Verify facts", "Match job", "Select and order", "Tailored CV"],
    caseStudies: ["ai-that-cannot-invent"],
  },
  {
    slug: "gulf-hiring-radar",
    name: "Gulf Hiring Radar",
    status: "Prototype",
    type: "Personal",
    period: "Oct 2026",
    blurb: "A tracker of live openings and career portals across the UAE and Oman, refreshed each weekday by a scheduled agent.",
    tech: ["Scheduled AI agent", "Shared database", "Job search APIs"],
    problem: "Checking dozens of career pages by hand is slow, and good postings go stale within days. Being early matters.",
    users: "Me, during an active job search.",
    role: "Product definition, filters and rules, and the agent's instructions.",
    features: [
      "Live openings with a fit rating, posting date and a status I can change.",
      "Newest postings first, because the freshest roles are the ones worth acting on.",
      "A tracker of career portals across the UAE and Oman.",
      "My own hard blockers applied as filters, so roles that cannot work never reach the list.",
    ],
    approach: [
      "A daily agent runs each weekday, finds new postings and records them in a shared database.",
      "It never applies for a job or messages anyone for me. I review every row and decide.",
      "Rating rules and blockers are written down, so the agent behaves the same way each run.",
    ],
    decisions: [
      "Read only agent. It adds rows and never acts on my behalf, because an automated application can cost a real opportunity.",
      "Rules written as instructions, not guessed. Blockers are explicit.",
      "A human sets status. The agent never changes a status I set.",
    ],
    challenges: [
      "Duplicates and stale postings across sources.",
      "Fit ratings are a rough guide, not a verdict, and I treat them that way.",
    ],
    results: ["A working tracker that refreshes every weekday."],
    roadmap: ["Measure how many applications came from radar finds", "Tighten the rating rules from what I actually pursue"],
    flow: ["Weekday run", "Search", "Apply blockers", "Rate fit", "Record"],
    gallery: [
      { src: "/img/projects/radar-openings.webp", alt: "Illustration of the open roles table with fit ratings", caption: "Open roles table. Illustrative mockup with fictional companies." },
      { src: "/img/projects/radar-agent.webp", alt: "Diagram of the weekday agent steps and its hard limits", caption: "Agent design and hard limits. Illustrative diagram." },
    ],
  },
  {
    slug: "aldar-connected-communities",
    name: "Aldar Connected Communities",
    type: "Professional",
    period: "Oct 2024 to Oct 2025",
    blurb: "Smart community technology across Saadiyat, Mamsha and The Grove, from master plan vision to daily operations.",
    tech: ["IoT", "Building systems", "BIM", "Power BI"],
    problem: "Move smart community technology from vision to operations across several developments, with multiple vendors and thousands of homes.",
    role: "Product Owner and Smart City Lead for the digital platforms.",
    approach: [
      "Capabilities spanned smart home, mobility, parking, building intelligence, the Harbour resident app, predictive maintenance and the Command and Control Centre.",
      "Coordinated Siemens, ID Cube and Parkonic with internal ICT, sustainability and operations teams.",
      "Set MVP site selection criteria and post deployment adoption tracking.",
    ],
    results: ["About 30% better monitoring efficiency, about 40% faster failure response and about 25% lower energy costs. Digital platforms portfolio valued at AED 30M+."],
    gallery: [
      { src: "/img/projects/saadiyat.webp", alt: "Smart parking and mobility across Saadiyat and Mamsha", caption: "Smart parking and mobility platform across Saadiyat and Mamsha." },
      { src: "/img/projects/nexus.webp", alt: "Command and Control Centre review", caption: "Project Nexus: Command and Control Centre." },
      { src: "/img/projects/smartcomm.webp", alt: "Smart communities and digital experience strategy", caption: "Smart communities and digital experience strategy." },
      { src: "/img/projects/blueprint.webp", alt: "Smart city use case blueprint", caption: "Reusable use case blueprint." },
    ],
    caseStudies: ["smart-city-solution-blueprint", "live-aldar-app-review"],
  },
  {
    slug: "terminus-presales-programmes",
    name: "Terminus Government and Enterprise Programmes",
    type: "Professional",
    period: "Oct 2025 to Aug 2026",
    blurb: "Presales and solution definition for municipal, destination and smart home opportunities across the GCC.",
    tech: ["AIoT", "Digital twin", "PRDs", "Integration specs"],
    problem: "Turn enterprise and government needs into solutions that engineering can validate and deliver.",
    role: "Product and Presales Manager.",
    approach: [
      "Opportunities included a Dubai Municipality wastewater management initiative, Miral Smart Destination and Al Wasl Smart Home.",
      "Also supported an Aldar smart home mock up villa and Terminus' AI City Operating System (TacOS) and IoC digital twin solutions.",
      "Coordinated feasibility with engineering and solution architecture, and wrote the requirements and integration documentation.",
    ],
    flow: ["Client need", "Discovery", "Solution definition", "Feasibility", "Requirements and integration specs", "Proposal"],
    results: ["Contributed to proposals, solution definition and requirements across these opportunities."],
  },
  {
    slug: "disrupt-x-iot-platforms",
    name: "Disrupt-X IoT SaaS Platforms",
    type: "Professional",
    period: "Mar 2023 to Oct 2024",
    blurb: "IoT SaaS for smart city and enterprise clients in the UAE, Saudi Arabia and Oman.",
    tech: ["LoRaWAN", "NB-IoT", "Sigfox", "BLE", "Cellular", "UAT"],
    problem: "Enterprise and government clients were buying IoT hardware but struggling to turn it into operational value. Adoption, not connectivity, was the bottleneck.",
    role: "Product Engineer, then Product Manager within six months.",
    approach: ["Owned the lifecycle from concept to market deployment.", "Improved onboarding and product market fit.", "Ran structured QA and cross functional testing."],
    results: ["About 15% platform adoption growth and a 95%+ UAT success rate across deployments."],
    gallery: [
      { src: "/img/projects/masdar.webp", alt: "Masdar City smart city solutions", caption: "Masdar City: smart city solutions, environmental monitoring and occupancy tracking." },
      { src: "/img/projects/equestrian.webp", alt: "Abu Dhabi Equestrian Club", caption: "Abu Dhabi Equestrian Club: environmental monitoring." },
      { src: "/img/projects/golf.webp", alt: "Emirates Golf Club", caption: "Emirates Golf Club: environmental monitoring and asset tracking." },
      { src: "/img/projects/ghurair.webp", alt: "Al Ghurair Centre", caption: "Al Ghurair Centre: environmental monitoring and asset tracking." },
    ],
  },
  {
    slug: "disrupt-x-marketplace",
    name: "Disrupt-X Marketplace",
    type: "Professional",
    period: "Disrupt-X",
    blurb: "An enterprise marketplace and content management product experience at Disrupt-X.",
    tech: ["Marketplace", "Content management"],
    role: "Product Manager.",
    results: ["Employer work, kept high level."],
  },
  {
    slug: "wakeful-morning",
    name: "Wakeful Morning",
    status: "Prototype",
    type: "Personal",
    period: "Jul 2026 to present",
    shot: { src: "/img/projects/wakeful-morning-onboarding.webp", alt: "Wakeful Morning onboarding screen listing the four wake-up steps", caption: "The onboarding screen of the Wakeful Morning prototype." },
    blurb: "A mobile alarm and morning focus app for heavy sleepers, built around wake challenges instead of a snooze button.",
    tech: ["Expo", "React Native", "Device sensors", "Local storage"],
    problem: "For heavy sleepers, a normal alarm is easy to dismiss and go back to sleep.",
    users: "Heavy sleepers who want to wake up and stay awake.",
    role: "Product definition, behavioural design, safety requirements and the prototype build.",
    features: [
      "Configurable alarms with motion based wake challenges instead of a snooze button.",
      "Camera assisted location verification, so getting out of bed is part of turning the alarm off.",
      "Post wake distraction controls to protect the first minutes of the morning.",
      "Everything stored on the device.",
    ],
    approach: [
      "Configurable alarms with motion based wake challenges.",
      "Camera assisted location verification and post wake distraction controls.",
      "Structured for a future native Android and iOS build, where system level alarms and stronger app restrictions are possible.",
    ],
    flow: ["Alarm rings", "Wake challenge", "Location check", "Focus mode"],
    decisions: [
      "Challenge over snooze. The design removes the easy way back to sleep.",
      "Safety requirements first. An alarm that fails to ring is worse than no app, so limits are defined before features.",
    ],
    challenges: [
      "A cross platform prototype cannot fully control system alarms or lock other apps. That needs a native build.",
    ],
    results: ["A working cross platform prototype."],
    roadmap: ["Native Android and iOS integration for system level alarms"],
  },
  {
    slug: "abu-dhabi-equestrian-club",
    name: "Abu Dhabi Equestrian Club",
    type: "Professional",
    period: "Disrupt-X, 2023 to 2024",
    parent: "disrupt-x-iot-platforms",
    blurb: "Environmental monitoring for an equestrian club, with live ambient data in one view for the operations team.",
    tech: ["Environmental monitoring", "IoT", "UAT"],
    problem: "Conditions in and around equestrian facilities affect the comfort and welfare of animals and people, and teams that check them by hand react late.",
    users: "Facility and operations teams responsible for stables, arenas and public areas.",
    role: "Part of the Disrupt-X product team delivering IoT SaaS platforms. Project level detail is kept high level because it is client work.",
    gallery: [{ src: "/img/projects/equestrian.webp", alt: "Abu Dhabi Equestrian Club", caption: "Abu Dhabi Equestrian Club: Environmental Monitoring." }],
  },
  {
    slug: "emirates-golf-club",
    name: "Emirates Golf Club",
    type: "Professional",
    period: "Disrupt-X, 2023 to 2024",
    parent: "disrupt-x-iot-platforms",
    blurb: "Environmental monitoring and asset tracking for a golf club, covering conditions on site and the equipment that moves around it.",
    tech: ["Environmental monitoring", "Asset tracking", "IoT", "UAT"],
    problem: "A large site with many assets and changing conditions is hard to supervise without live data, and equipment is easy to lose track of.",
    users: "Grounds, facilities and operations teams.",
    role: "Part of the Disrupt-X product team delivering IoT SaaS platforms. Project level detail is kept high level because it is client work.",
    gallery: [{ src: "/img/projects/golf.webp", alt: "Emirates Golf Club", caption: "Emirates Golf Club: Environmental Monitoring and Asset Tracking." }],
  },
  {
    slug: "masdar-city",
    name: "Masdar City",
    type: "Professional",
    period: "Disrupt-X, 2023 to 2024",
    parent: "disrupt-x-iot-platforms",
    blurb: "Smart city solutions with environmental monitoring and occupancy tracking in a sustainable city district.",
    tech: ["Smart city", "Environmental monitoring", "Occupancy tracking", "IoT", "UAT"],
    problem: "A district built around sustainability needs measured data on conditions and on how spaces are used, so that decisions about energy, comfort and space rest on evidence.",
    users: "City district operators, facility managers and sustainability teams.",
    role: "Part of the Disrupt-X product team delivering IoT SaaS platforms. Project level detail is kept high level because it is client work.",
    gallery: [{ src: "/img/projects/masdar.webp", alt: "Masdar City", caption: "Masdar City: Smart City Solutions, Environmental Monitoring and Occupancy Tracking." }],
  },
  {
    slug: "al-ghurair-centre",
    name: "Al Ghurair Centre",
    type: "Professional",
    period: "Disrupt-X, 2023 to 2024",
    parent: "disrupt-x-iot-platforms",
    blurb: "Environmental monitoring and asset tracking for a large commercial and retail centre.",
    tech: ["Environmental monitoring", "Asset tracking", "IoT", "UAT"],
    problem: "Large public buildings need to keep conditions comfortable and equipment accounted for, and managing both manually does not scale.",
    users: "Building and facilities management teams.",
    role: "Part of the Disrupt-X product team delivering IoT SaaS platforms. Project level detail is kept high level because it is client work.",
    gallery: [{ src: "/img/projects/ghurair.webp", alt: "Al Ghurair Centre", caption: "Al Ghurair Centre: Environmental Monitoring and Asset Tracking." }],
  },
  {
    slug: "al-wasl-residence",
    name: "Al Wasl Residence",
    type: "Professional",
    period: "Disrupt-X, 2023 to 2024",
    parent: "disrupt-x-iot-platforms",
    blurb: "Smart city solutions and environmental monitoring for a residential development.",
    tech: ["Smart city", "Environmental monitoring", "IoT", "UAT"],
    problem: "Residential communities benefit from a shared view of conditions and building systems, so management can respond before residents notice a problem.",
    users: "Community management teams and residents.",
    role: "Part of the Disrupt-X product team delivering IoT SaaS platforms. Project level detail is kept high level because it is client work.",
    gallery: [{ src: "/img/projects/alwasl.webp", alt: "Al Wasl Residence", caption: "Al Wasl Residence: Smart City Solutions and Environmental Monitoring." }],
  },
  {
    slug: "arte-creative-hub",
    name: "Arte Creative Hub",
    status: "Concept",
    type: "Professional",
    period: "Oct 2026 to present",
    cover: "/img/projects/arte-cover.webp",
    blurb: "A creative technology studio inside an events and creative agency, starting with one connected platform for conferences and corporate events.",
    tech: ["Web platform", "Mobile first UX", "QR check in", "Live dashboards"],
    problem: "Event teams run invitations, guest lists, check in and follow up across spreadsheets, chat threads and paper lists. Guests feel it as queues at the door, and organisers are left with little data once the day ends.",
    users: "Event organisers, business associations and corporate teams running conferences, and the guests who attend them.",
    role: "Product lead. I shaped the studio offer and service lines, designed the studio website and the event platform, and produced the product walkthrough.",
    approach: [
      "Eight service lines for creatives and event clients, from websites and online stores to booking portals, creative automation and interactive event experiences.",
      "A five page studio website in a magenta and plum palette, with light and dark modes and a mobile layout.",
      "An event platform concept that covers the whole guest journey: branded invitation, mobile registration, QR ticket, check in with a printed badge, a live program with Q&A and polls, an organiser dashboard and post event follow up.",
      "A two minute narrated product walkthrough with motion design and sound.",
    ],
    decisions: [
      "One guest journey, not separate tools. Invitation, registration, check in and follow up share one guest record, so organisers see the whole event in one place.",
      "Mobile first for guests. Registration takes under a minute and the ticket lives on the phone.",
      "Delivered as a service. The agency runs the platform for each event, so clients get the experience without adopting new software.",
      "Design the full experience first. A complete demo and walkthrough define every step of the guest journey before development starts.",
    ],
    flow: ["Invite", "Register", "QR ticket", "Check in", "Live program", "Follow up"],
    gallery: [
      { src: "/img/projects/arte-cover.webp", alt: "Arte Creative Hub website home page on desktop and mobile", caption: "Studio website, desktop and mobile." },
      { src: "/img/projects/arte-services.webp", alt: "Arte Creative Hub services page", caption: "Service lines on the studio website." },
      { src: "/img/projects/arte-invite.webp", alt: "Branded event invitation on a phone", caption: "Step 1. A branded invitation with one tap RSVP." },
      { src: "/img/projects/arte-ticket.webp", alt: "QR ticket and reminder on a phone", caption: "Step 2. Instant QR ticket, calendar invite and reminders." },
      { src: "/img/projects/arte-checkin.webp", alt: "Tablet check in screen scanning a QR code and showing a guest badge", caption: "Step 3. QR check in at the entrance, badge ready." },
      { src: "/img/projects/arte-dashboard.webp", alt: "Organiser dashboard with registrations, check ins and session ratings", caption: "Step 4. Organiser dashboard in real time." },
    ],
    roadmap: ["Build an MVP for a first live event"],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  context: string;
  blurb: string;
  problem: string;
  approach: string[];
  decisions: string[];
  outcome: string[];
  learned: string;
  flow: string[];
  studio?: {
    role: string;
    hypothesis: string;
    workflow: { title: string; description: string }[];
    outputs: { title: string; status: string; description: string }[];
    challenges: string[];
    roadmap: string[];
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "smart-city-solution-blueprint",
    title: "From vendor pitches to a repeatable decision",
    category: "Product Management and Digital Transformation",
    context: "Aldar Properties, Abu Dhabi. Proprietary details are left out.",
    blurb: "How a reusable scoring framework replaced ad hoc smart city vendor selection across three developments.",
    problem: "Smart city solutions were being evaluated one at a time, often from vendor pitches. Each development repeated the planning work, and there was no shared way to compare options or to say why one was chosen.",
    approach: [
      "Defined a reusable blueprint covering digital use cases, a vendor evaluation checklist, scoring criteria and an impact assessment.",
      "Used seven evaluation criteria so different solutions could be compared on the same basis.",
      "Applied it across Saadiyat, Mamsha and The Grove, and paired it with MVP site selection criteria and post deployment adoption tracking.",
    ],
    decisions: [
      "Score first, shortlist second. Vendors are compared on criteria agreed before the pitch, not after.",
      "Reusable over perfect. One framework applied three times beat three bespoke assessments.",
      "Track adoption after launch. Delivery is not the finish line, adoption is.",
    ],
    outcome: [
      "The framework was applied across three developments.",
      "It structured solution evaluation and reduced repeated planning work.",
    ],
    flow: ["Vendor pitches", "Common criteria", "Scoring matrix", "Impact assessment", "Repeatable decision"],
    learned: "A framework is a product. It needs users, a clear job and a reason to be used again.",
  },
  {
    slug: "smart-education-smart-cities",
    title: "Smart education in the smart city",
    category: "Research and Strategy",
    context: "Independent research report, 2025.",
    blurb: "A research report on where technology has worked in education, from classrooms and campus operations to safety, energy and lifelong learning.",
    problem: "Smart city programmes often treat education as a service to be digitised. The question I set out to answer was whether education is better understood as a driver of the city's intelligence, and what has worked in practice.",
    approach: [
      "Reviewed published case studies and programmes across six areas: learning, campus operations, safety, sustainability, workforce development and lifelong learning.",
      "Mapped each use case to the technologies involved and the benefit it produced.",
      "Linked the findings to the six smart city pillars: people, living, mobility, economy, environment and governance.",
    ],
    decisions: [
      "Treat education as a driver of the city, not only a user of its technology.",
      "Judge a use case by the outcome it produced, for example a sensor based parking system at the University of Delaware or solar plus batteries offsetting up to 60% of energy costs at Stockton Unified School District.",
      "Name the conditions for success: stakeholder collaboration, data privacy and digital equity, and phased rollouts.",
    ],
    outcome: [
      "A structured report with comparison tables of use cases, technologies and illustrative implementations.",
      "A set of success factors for planning smart education inside a city programme.",
    ],
    flow: ["Education in the smart city", "Use cases by area", "Technologies and benefits", "Case studies", "Success factors"],
    learned: "Technology adoption is the easy part. Privacy, equity and community buy in decide whether it lasts.",
  },
  {
    slug: "live-aldar-app-review",
    title: "Live Aldar app: a product review",
    category: "Product Analysis",
    context: "Hands on review of the public Live Aldar mobile app, Android and iOS.",
    blurb: "A manual, scenario based review of the Live Aldar app, looking at usability, performance and design in the flows anyone can reach without an account.",
    problem: "Most reviews of a resident app start from a logged in user. I wanted to see what a person experiences before signing up, and where the public flows lose them.",
    approach: [
      "Tested on mid range and flagship phones running current Android and iOS, over Wi-Fi and mobile data, against production servers.",
      "Used manual exploratory testing and scenario checks: the Education section, Manage Properties, Property Search, Explore a Community and Darna Rewards.",
      "Stayed inside publicly accessible features. No sign up flow was pursued.",
    ],
    decisions: [
      "Test real devices and real networks, not only the ideal case.",
      "Review the public journey separately from the account journey.",
    ],
    outcome: [
      "A written review of usability, performance and design gaps in the public flows.",
    ],
    flow: ["Scope public flows", "Test on devices", "Switch networks", "Log gaps", "Review summary"],
    learned: "The first minutes without an account are a product in their own right.",
  },
  {
    slug: "personal-execution-system",
    title: "Turning a long plan into today\u2019s three tasks",
    category: "Personal Experiments and Product Discovery",
    context: "LIFE OS, personal project, 2026.",
    blurb: "A private planning app that fits ranked tasks into the capacity I have today, and says plainly what it has and has not proven.",
    problem: "A ten year plan is clear, but the day is not. Income, health routines, a job search and longer term goals compete for the same hours, and a tool that lists everything makes the choice harder.",
    approach: [
      "Specified the product before building: nine life pillars, a roadmap to 2035, and a daily planner as the central feature.",
      "Built it local first on a single SQLite file, using AI assisted development.",
      "Fitted tasks into three capacity modes: Minimum, Standard and Deep Work. Anything that does not fit goes to Later and is never deleted.",
    ],
    decisions: [
      "Explainable rules before AI. Each task shows why it ranked where it did, and the arithmetic is reproducible.",
      "Actuals and estimates are labelled separately. Projections are never stored as actuals, and no balance or result is pre filled.",
      "Show what is not built. Unfinished screens are listed as unavailable so the scope stays honest.",
    ],
    outcome: [
      "A working MVP with 21 unit tests covering ages, dates, recurrence, runway, debt repayment and planner capacity, plus manual checks on Chromium.",
      "Not yet shown: that it changes how I follow through. That needs weeks of real use.",
    ],
    flow: ["Ten year plan", "Ranked tasks", "Capacity mode", "Today\u2019s three", "Weekly review"],
    learned: "A planning tool earns its place by lowering the cost of the next action, not by holding more of the plan.",
  },
  {
    slug: "ai-that-cannot-invent",
    title: "Designing AI that cannot invent facts",
    category: "Product Management and Technology Research",
    context: "CareerOS, personal project, 2026.",
    blurb: "A job search tool where the AI can only choose from facts I have already verified.",
    problem: "AI writing tools will invent metrics if asked, and screeners probe for consistency. In a job search, one fabricated number can end an application.",
    approach: [
      "Split the system in two: a verified fact store, and an AI step that only selects and orders from it.",
      "Made the rule structural, not a prompt instruction, by enforcing it in the database.",
      "Kept everything on the local machine, with the API key in the keychain.",
    ],
    decisions: [
      "Constrain the system instead of trusting the model.",
      "Verification is a human step, done once, then reused.",
      "Local first, because the data is private.",
    ],
    outcome: ["The fact importer and verification screen work on a real master CV."],
    flow: ["Master CV", "Verified fact store", "AI selects and orders", "Tailored CV"],
    learned: "Reliability in AI products usually comes from the structure around the model.",
  },
  {
    slug: "ai-maintenance-queue",
    title: "Prioritizing maintenance before a service disruption",
    category: "AI Product Concept: Connected Buildings",
    context: "Independent concept study, 2026. Not a deployed project.",
    blurb: "A maintenance queue that turns equipment data into a defensible inspection priority, showing the evidence and its limits.",
    problem: "A facilities team starts a shift with repeated alarms, open work orders and limited technicians. A pump shows unusual readings while a sensor elsewhere has stopped reporting. Both look urgent on a dashboard.",
    approach: [
      "Combine asset condition, service criticality, data freshness and open work orders into one queue.",
      "Start with one equipment class at one site, such as comparable water pumps. Fire and life safety stay outside the pilot.",
      "Show the evidence, its limits and the next inspection step. The supervisor accepts, defers or rejects, with a reason.",
    ],
    decisions: [
      "Fixed thresholds are the baseline. A contextual anomaly model has to show added value on local data.",
      "Call the output an anomaly needing review until verified failure labels exist, rather than quoting a failure probability.",
      "Mandatory alarms keep running independently of the queue.",
    ],
    outcome: [
      "Proposed measures: actionable inspection yield, unnecessary workload, useful warning time and operational effect. No results are claimed.",
      "Stop condition: if the queue adds workload without beating simple rules, improve instrumentation or work order records instead.",
    ],
    flow: ["Equipment data", "Quality checks", "Compare like conditions", "Inspection queue", "Technician feedback"],
    learned: "A maintenance model earns its place when its recommendations fit the team’s capacity, not when its anomaly score is high.",
  },
  {
    slug: "ai-resident-services",
    title: "Helping a resident reach a verified resolution",
    category: "AI Product Concept: Resident Services",
    context: "Independent concept study, 2026. Not a deployed project.",
    blurb: "An assistant that retrieves approved guidance, checks authorised records and prepares the next permitted action, instead of only explaining.",
    problem: "A resident writes that parking access stopped working after renewing a tenancy. A fluent explanation is not enough if the access issue is still unresolved.",
    approach: [
      "Retrieve approved policy documents with property, version, effective date and owner metadata.",
      "Take account specific facts from authenticated system queries, not from a shared document index.",
      "Prepare a ticket or reconciliation request. Access changes need staff approval at first, and payment disputes go to a person.",
    ],
    decisions: [
      "Separate explanation, recommendation and execution in the interface.",
      "Never say access is restored until there is evidence of completion.",
      "Treat retrieved text and resident messages as content, never as authority to bypass permissions.",
    ],
    outcome: [
      "Proposed measures: verified resolution, repeat contact, answer support, action integrity, and privacy. No results are claimed.",
      "Pause the pilot for any cross resident disclosure or unauthorised action.",
    ],
    flow: ["Resident request", "Policy retrieval", "Record check", "Prepared action", "Verified resolution"],
    learned: "A conversation can feel helpful while the underlying problem is untouched. Measure the whole journey, not ticket deflection.",
  },
  {
    slug: "ai-manufacturing-experiments",
    title: "Choosing the next experiment to reduce defects",
    category: "AI Product Concept: Manufacturing Quality",
    context: "Independent concept study, 2026. Not a deployed project.",
    blurb: "An investigation workspace that turns a model association into a testable hypothesis, without claiming a root cause from correlation.",
    problem: "Defect rates rise after a product mix change on an electronics line. Engineers have to pick which possible cause to investigate without disrupting a stable process.",
    approach: [
      "Link inspection results to lot, tool, recipe, material batch and process timestamps.",
      "Compare affected and unaffected lots, inspect missing data and record competing explanations.",
      "Pair a statistical baseline with a tabular model only if the data supports it. Split evaluation by time and keep lots together.",
    ],
    decisions: [
      "A strong predictor that engineers cannot change, or one that stands in for product mix, ranks below an actionable, plausible and testable hypothesis.",
      "If product type and bath age are too tightly linked, flag the evidence gap and propose a controlled trial.",
      "Only a quality approved trial can support a claim of improvement.",
    ],
    outcome: [
      "Proposed measures: investigation effort, predictive usefulness, trial effect and production guardrails. No results are claimed.",
      "Pause if lot traceability is unreliable or the model needs information that is not available at decision time.",
    ],
    flow: ["Defect pattern", "Lot comparison", "Hypothesis", "Controlled trial", "Release decision"],
    learned: "A predictor can show where to investigate without showing what to change.",
  },
  {
    slug: "ai-menu-to-meal",
    title: "Turning a delivery meal into a realistic cooking plan",
    category: "AI Product Concept: Everyday Decisions",
    context: "Independent concept study, 2026. Not a deployed project.",
    blurb: "An app that turns a delivery menu item into a cooking plan and shopping list, and shows when cooking tonight is not practical.",
    problem: "Someone sees a meal they would enjoy in a delivery app and would consider cooking it, but choosing a recipe, estimating cost and checking equipment feels like extra work.",
    approach: [
      "Accept a dish name, menu description or screenshot, and ask only for constraints that change feasibility.",
      "Adapt reviewed recipe templates to the available equipment and time. Deterministic checks handle quantities, pack sizes and grocery arithmetic.",
      "Show both the checkout cost and the ingredient cost used in the meal.",
    ],
    decisions: [
      "Do not claim to reproduce a restaurant recipe, and confirm an unclear image rather than guess.",
      "Never certify a meal as allergen free from a photo or a generated recipe.",
      "Avoid a business model that rewards adding unnecessary groceries.",
    ],
    outcome: [
      "Proposed measures: meal completion, planning effort, estimate accuracy, practical fit and repeat use. No results are claimed.",
      "Start with interviews, a diary study and a concierge pilot before building integrations.",
    ],
    flow: ["Delivery menu", "Dish and constraints", "Cooking plan", "Shopping list", "Meal cooked"],
    learned: "A recommendation becomes useful when someone can act on it under real constraints.",
  },
];


export const ai = {
  headline: "AI product management, built in practice.",
  body: "I treat AI like any other platform decision: start from the job to be done, constrain the model with structure, and keep a human in the loop wherever a wrong answer is costly.",
  skills: [
    "AI product strategy and use case prioritisation",
    "LLM features with grounding and guardrails",
    "Human in the loop verification",
    "AI agents and scheduled automation",
    "AIoT and digital twin platforms",
    "AI assisted prototyping",
  ],
  proof: [
    { name: "CareerOS", what: "An LLM can only select and order facts I have verified. The rule lives in the database, not in a prompt.", href: "/case-studies/ai-that-cannot-invent/" },
    { name: "Gulf Hiring Radar", what: "A scheduled AI agent finds and rates new openings every weekday, and never applies or messages anyone.", href: "/projects/gulf-hiring-radar/" },
    { name: "Terminus Group", what: "Product and presales for AIoT platforms, the AI City Operating System (TacOS) and IoC digital twin solutions.", href: "/career/" },
  ],
};

export const now = {
  focus: "Building products, learning how to make AI reliable inside real systems, and working out what comes next.",
  building: ["CareerOS, the local first job search tool", "LIFE OS, a planning app that survives a bad week", "Smart City Intelligence Hub, adding what practitioners ask for", "Wakeful Morning, moving toward native alarms"],
  learning: ["Agentic AI and multi agent systems", "Model Context Protocol", "AI evaluation frameworks", "Production AI architectures"],
  recent: ["EPFL: Smart Cities, Management of Smart Urban Infrastructures (Sep 2026)", "PMI: Introduction to Large Language Models (Jul 2026)"],
};

export const certs = [
  "Licensed Electronics Engineer (Philippines), April 2022",
  "Registered Electronics Technician (Philippines), 2022",
  "Certified Scrum Product Owner (CSPO), Scrum Alliance",
  "EPFL: Smart Cities, Management of Smart Urban Infrastructures, Sep 2026",
  "PMI: Introduction to Large Language Models, Jul 2026",
  "Pendo: AI in Product Management",
];

export const education = [
  { school: "Philippine Christian University", what: "Master of Business Administration, with Distinction", dates: "2024 to 2025" },
  { school: "University of Batangas", what: "BS Electronics Engineering", dates: "2015 to 2020" },
];

export const recruiter = {
  name: "Mark Jerome Gomez",
  headline: "Technical Product Manager | Product Owner",
  domains: "AI · IoT · Smart Cities · Digital Twins · Enterprise Platforms",
  statement: "Product ownership, electronics engineering and enterprise technology, applied to connected platforms across the UAE and the Philippines.",
  impact: [
    { value: "~40%", label: "faster infrastructure failure response", where: "Aldar" },
    { value: "~30%", label: "improvement in monitoring efficiency", where: "Aldar" },
    { value: "~25%", label: "reduction in energy costs", where: "Aldar" },
    { value: "~15%", label: "growth in platform adoption", where: "Disrupt-X" },
    { value: "AED 30M+", label: "digital platforms portfolio exposure", where: "Aldar" },
    { value: "95%+", label: "reported UAT success rate", where: "Disrupt-X" },
  ],
  impactNote: "~ marks approximate estimates. Results were delivered with cross functional teams and vendors, and reflect my contribution to shared outcomes.",
  experience: {
    terminus: ["Defined enterprise AIoT products and smart city solutions, from PRDs and system blueprints to integration requirements.", "Built predictive maintenance business cases and supported TacOS and IoC digital twin solutions for GCC enterprise and government opportunities."],
    aldar: ["Delivered connected community platforms across Saadiyat, Mamsha and The Grove with Siemens, ID Cube and Parkonic, including smart parking and building intelligence.", "Created the Smart City Solution Blueprint, a reusable scoring framework for use cases and vendors, applied across three developments."],
    disruptx: ["Promoted from Product Engineer to Product Manager within six months, owning IoT SaaS platforms across the UAE, Saudi Arabia and Oman.", "Drove platform development and device integrations over LoRaWAN, NB-IoT, Sigfox and BLE through structured UAT."],
    samsung: ["Led electronic component development from concept validation to mass production, working across R&D, quality and Samsung headquarters in South Korea.", "Recognised with the Best Practitioner Award, Plating R&D (May 2022) and the Most Improved Process Award (2022)."],
  } as Record<string, string[]>,
  strengths: [
    { group: "Product Strategy and Ownership", items: ["Product Discovery", "Roadmaps", "PRDs", "Backlog Management", "Agile Delivery", "Stakeholder Management"] },
    { group: "AI and Connected Platforms", items: ["AI Products", "LLM Applications", "AI Agents", "IoT", "AIoT", "Smart Cities", "Digital Twins"] },
    { group: "Technical Delivery and Integration", items: ["APIs", "System Integration", "Data Flows", "Solution Blueprints", "UAT", "Release Readiness"] },
    { group: "Programme and Delivery Governance", items: ["Multi Vendor Delivery", "RAID Management", "Change Control", "Requirements Traceability"] },
    { group: "Tools and Prototyping", items: ["Jira", "Confluence", "Power BI", "Excel", "MS Project", "n8n", "AI Assisted Prototyping"] },
  ],
  credentials: [
    { group: "Professional Licences", items: ["Registered Electronics Engineer (REE), Philippines", "Registered Electronics Technician (RTech), Philippines"] },
    { group: "Product and Agile", items: ["Certified Scrum Product Owner (CSPO), Scrum Alliance", "Professional Scrum Product Owner I (PSPO I), Scrum.org", "SAFe Product Owner / Product Manager 6.0, Scaled Agile"] },
    { group: "AI, Technology and Analytics", items: ["Smart Cities: Management of Smart Urban Infrastructures, EPFL", "Introduction to Large Language Models, PMI", "AI in Product Management, Pendo", "Google Data Analytics Professional Certificate", "Google Cybersecurity Professional Certificate"] },
    { group: "Professional Development", items: ["PMP Exam Preparation, 35 Contact Hours (training, not a PMP certification)"] },
  ],
  docs: {
    cv: { href: "/Mark-Gomez-CV.pdf", title: "Download CV (PDF)", note: "Complete, ATS friendly professional CV" },
    onePager: { href: "/Mark-Gomez-One-Pager.pdf", title: "Download One-Pager (PDF)", note: "One page summary of experience, achievements, capabilities and credentials" },
  },
};

export const recruiterSummary =
  "Technical Product Manager with nearly six years across electronics manufacturing, IoT SaaS, smart city programmes and AIoT platforms in the Philippines and the UAE. Builds AI products end to end, from LLM features with guardrails that keep outputs grounded in verified data to scheduled AI agents. Licensed Electronics Engineer, MBA with Distinction, CSPO. Strongest at platform product ownership, technical documentation, multi vendor delivery and turning stakeholder needs into shippable scope.";

export type Rec = { name: string; role: string; org: string; quote: string };
export const recommendations: Rec[] = [
  {
    "name": "Tony Pagliocco",
    "role": "Associate Director, Product Management",
    "org": "Aldar Properties PJSC",
    "quote": "Mark’s contributions to our Smart City IoT team were exceptional from day one. He brought both practical and forward-thinking expertise, quickly becoming indispensable to our agile delivery teams. His attention to detail, commitment to quality, and constant drive to learn set him apart. What impressed me most was his ability to combine technical depth with human empathy, earning respect, elevating those around him, and driving true innovation."
  },
  {
    "name": "Salah Berkane",
    "role": "IoT Director",
    "org": "Tadoom Oman",
    "quote": "Mark has a deep understanding of IoT technologies and consistently demonstrates a strong problem-solving ability. He always approaches challenges with a positive attitude and is always willing to go the extra mile to ensure our satisfaction. His collaborative mindset and willingness to share knowledge helped us a lot as well."
  },
  {
    "name": "Nazha Nayim",
    "role": "Lead Product Manager",
    "org": "Disrupt-X",
    "quote": "I’ve had the pleasure of working closely with Mark, and his highly organized and structured approach has been invaluable. He’s a true team player, always willing to help, and consistently takes the initiative in identifying and addressing gaps. What sets Mark apart is his ability to quickly learn and adapt to new challenges, making his contributions on the product management side particularly commendable."
  },
  {
    "name": "Muhammad Uzair Akhtar",
    "role": "Product Specialist",
    "org": "DynaSys Network Pakistan",
    "quote": "Mark is a great professional with extensive knowledge of IoT. I had the pleasure of being trained by him on the importance of having a marketplace and a CMS for the success of any IoT Platform."
  },
  {
    "name": "Ronnie Francisco",
    "role": "Technical Supervisor",
    "org": "ABM Olayan Saudi Arabia",
    "quote": "He has consistently impressed me with his expertise as an IoT Product Manager. His deep understanding of IoT technologies, combined with his ability to manage complex projects, sets him apart in the industry. Mark has an exceptional talent for collaborating across teams, solving challenges, and driving innovation. I’ve seen firsthand how his leadership and strategic thinking have contributed to the success of key projects."
  },
  {
    "name": "Ruba Ibrahim",
    "role": "Lead Product Manager",
    "org": "Disrupt-X",
    "quote": "Mark is a proactive and detail-oriented Product Manager with a remarkable ability to visualize product requirements in a creative and comprehensive manner. They excel at breaking down complex needs into detailed story maps, ensuring clear communication and smooth delivery to the development team."
  },
  {
    "name": "Hanaa Othman",
    "role": "Marketing Manager",
    "org": "Disrupt-X",
    "quote": "It’s been great working alongside Mark. He’s incredibly organized, attentive to detail, and always open to feedback. His proactive approach and positive attitude will be missed. Even from the marketing side, it’s clear he’s dedicated and collaborative. Wishing him a great success in his next role!"
  },
  {
    "name": "Kuhan Jaganathan",
    "role": "Product Manager",
    "org": "Disrupt-X",
    "quote": "Mark has been an invaluable member that has constantly prioritises self improvement. His efforts in product development has been of great value as he has the ability to concisely deliver large scale ideas. Never walking away from a task, he has supported numerous developments. With excellent documentation skills, he has elevated collaboration across the teams and clients. Great experience working with him."
  },
  {
    "name": "George Ding",
    "role": "VP of Delivery, Partnership, Operations",
    "org": "Terminus Group",
    "quote": "Mark is a hard working and reliable member, while working as product & presales manager in my team. He is very responsible for any work assigned to him, which usually requires multi-tasking and quick learning capabilities. He demonstrated a very proactive attitude and willingness to take extra effort to deliver quality results. He attended to details to produce thoroughly analyzed and well structured documentations for product requirement specs. He was able to contribute to major opportunities with real estate and municipality customers in UAE, for solutions in the domains of AIoT, smart-city, digital-twin and smart home/building devices."
  },
  {
    "name": "Numan Al Omary",
    "role": "Senior Commercial, Sales and Transformation Leader",
    "org": "",
    "quote": "Mark has been great to work with. He's highly collaborative, quickly understands customer requirements, and does an excellent job turning them into practical solutions. He has a keen attention to detail, builds clear and professional customer and product presentations, and explains complex technical concepts in a simple, engaging way. Always willing to support the team, Mark is a real asset to any organization."
  }
];

export const transformation = {
  from: "110 kg",
  to: "67 kg",
  text: "A 43 kg transformation. It strengthened my discipline, focus and resilience, and I bring the same habits to every product challenge.",
};

export const disruptxProjects = [
  { name: "Abu Dhabi Equestrian Club", scope: "Environmental Monitoring", img: "equestrian", slug: "abu-dhabi-equestrian-club" },
  { name: "Emirates Golf Club", scope: "Environmental Monitoring and Asset Tracking", img: "golf", slug: "emirates-golf-club" },
  { name: "Masdar City", scope: "Smart City Solutions, Environmental Monitoring and Occupancy Tracking", img: "masdar", slug: "masdar-city" },
  { name: "Al Ghurair Centre", scope: "Environmental Monitoring and Asset Tracking", img: "ghurair", slug: "al-ghurair-centre" },
  { name: "Al Wasl Residence", scope: "Smart City Solutions and Environmental Monitoring", img: "alwasl", slug: "al-wasl-residence" },
];

export const aldarProjects = [
  { name: "Saadiyat District: Smart Parking and Mobility Platform", body: "Assessed and coordinated a unified smart parking integration across Mamsha and Saadiyat communities.", img: "saadiyat" },
  { name: "Project Nexus: Command and Control Centre", body: "Reviewed technical site surveys for 80+ assets across BMS, security, access control, CCTV and fire alarm systems, and produced consultant ready review summaries.", img: "nexus" },
  { name: "Smart Communities and Digital Experience Strategy", body: "Refined Aldar's smart community and digital experience blueprint using reusable IoT modules and prioritised, vendor agnostic use cases.", img: "smartcomm" },
  { name: "Smart City Use Case Blueprint (Confluence)", body: "Built vendor agnostic Confluence templates for wayfinding, access, air quality, irrigation, safety, waste and more, linking personas, use cases, value and ROI.", img: "blueprint" },
];
