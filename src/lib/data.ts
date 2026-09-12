/* ------------------------------------------------------------------ */
/*  COVERAGE — content model                                           */
/*  Every entry sourced from the résumé. No fiction.                   */
/* ------------------------------------------------------------------ */

export const IDENTITY = {
  name: "NURUDDIN KAWSAR",
  short: "KAWSAR",
  role: "SQA ENGINEER",
  subRole: "Manual & Automated Testing · Web, API & SaaS Platforms",
  location: "DHAKA, BANGLADESH",
  coordinates: "23.8103° N / 90.4125° E",
  email: "nuruddinkawsar1995@gmail.com",
  phone: "+880 186 045 8130",
  github: "https://github.com/kawsar-95",
  linkedin: "https://www.linkedin.com/in/nuruddin-kawsar-3b5152279/",
  site: "https://nuruddinkawsar.me/",
  githubHandle: "kawsar-95",
};

export const STATS = [
  { value: "5+", label: "years across manual & automated QA — web, API, SaaS", mono: "years" },
  { value: "4", label: "engineers led on one QA team, one release train", mono: "team" },
  { value: "5", label: "roles climbed — intern to QA automation engineer", mono: "roles" },
  { value: "4", label: "platforms tested end-to-end — LMS, fintech, CRM, energy", mono: "cases" },
  { value: "3", label: "automation frameworks in daily rotation", mono: "frameworks" },
  { value: "3", label: "surfaces under one regression suite — web, mobile, API", mono: "surfaces" },
  { value: "7", label: "testing types covered, functional to security", mono: "types" },
  { value: "1", label: "UAT gate built from scratch — PM + QA sign-off, every release", mono: "process" },
];

export const PIPELINE_STAGES = [
  { id: "spec", label: "SPEC", act: "ACT I" },
  { id: "plan", label: "PLAN", act: "ACT II" },
  { id: "case", label: "CASE", act: "ACT III" },
  { id: "run", label: "RUN", act: "ACT IV" },
  { id: "report", label: "REPORT", act: "ACT V" },
  { id: "triage", label: "TRIAGE", act: "ACT VI" },
  { id: "signoff", label: "SIGNOFF", act: "ACT VII" },
] as const;

/* ------------------------------------------------------------------ */
/*  SKILLS — presented as a test manifest                              */
/* ------------------------------------------------------------------ */

export interface SkillLayer {
  directive: string;
  comment: string;
  items: string[];
}

export const SKILL_LAYERS: SkillLayer[] = [
  {
    directive: "TEST --suite=automation",
    comment: "the tests that run themselves",
    items: ["Cypress", "Selenium", "Playwright"],
  },
  {
    directive: "TEST --suite=api",
    comment: "what the UI can't catch",
    items: ["Postman", "K6", "JMeter"],
  },
  {
    directive: "RUN --pipeline=ci-cd",
    comment: "gate every merge before it ships",
    items: ["GitHub Actions", "Jenkins"],
  },
  {
    directive: "USE --lang=core",
    comment: "the code underneath the test code",
    items: ["JavaScript", "Java"],
  },
  {
    directive: "COVER --types=all",
    comment: "every angle a release can fail from",
    items: ["Functional", "Regression", "Performance", "API", "Security", "Smoke", "UAT"],
  },
  {
    directive: "TRACK --tooling=qa",
    comment: "where the work gets logged and proven",
    items: ["JIRA", "TestRail", "Trello", "Docker", "Git / GitHub / Bitbucket"],
  },
  {
    directive: "PLAN --method=agile",
    comment: "how a QA team actually ships",
    items: ["Scrum", "Kanban"],
  },
];

/* ------------------------------------------------------------------ */
/*  EXPERIENCE — a career run through environments                     */
/* ------------------------------------------------------------------ */

export interface Mission {
  env: string;
  envTone: "prod" | "stage" | "dev" | "cert";
  role: string;
  org: string;
  period: string;
  brief: string;
  log: string[];
}

export const MISSIONS: Mission[] = [
  {
    env: "PRODUCTION",
    envTone: "prod",
    role: "QA Automation Engineer",
    org: "Shomvob Technologies Ltd.",
    period: "JUL 2026 — PRESENT",
    brief:
      "Leading QA for an HRIS platform spanning web, mobile and API — built the process, the team, and the release gate from scratch.",
    log: [
      "Leads a 4-person QA team across web, mobile and API surfaces on a weekly release cadence",
      "Built the QA process from zero — module ownership, regression coverage, and a UAT gate requiring joint PM + QA sign-off before release",
      "Automates mobile flows for the Flutter app with Maestro, and API workflows with Postman",
      "Maintains multi-repo GitHub Actions pipelines — regression and smoke suites run on every build",
    ],
  },
  {
    env: "STAGING",
    envTone: "stage",
    role: "Software QA Engineer",
    org: "Nifty IT Solution",
    period: "AUG 2025 — JUN 2026",
    brief:
      "Manual and automated coverage across web, API and GraphQL — folding automation straight into CI/CD.",
    log: [
      "Designed and executed manual + automated test cases with Playwright, Postman and GraphQL",
      "Ran regression, performance and API testing; wired automation into CI/CD pipelines",
      "Partnered with developers and PMs to catch defects early and lift release quality",
      "Documented bugs in detail and pushed process improvements for smoother releases",
    ],
  },
  {
    env: "STAGING",
    envTone: "stage",
    role: "Software QA Engineer",
    org: "NextLevel Media Bangladesh (Remote, US HQ)",
    period: "MAR 2025 — JUL 2025",
    brief:
      "QA for a cloud CRM SaaS — client management, workflows, sales tracking — under load and under deadline.",
    log: [
      "Owned quality for a cloud-based CRM SaaS platform — client management, workflows, sales tracking",
      "Executed manual and automated tests across multiple modules, raising coverage and transparency",
      "Ran performance testing through release cycles to confirm stability under load",
      "Authored test plans, cases and reports that lifted test maturity and team communication",
    ],
  },
  {
    env: "STAGING",
    envTone: "stage",
    role: "Associate SDET",
    org: "Together Initiatives (P) Limited",
    period: "APR 2022 — FEB 2025",
    brief:
      "Where the automation habit was built — Cypress and Playwright frameworks from the ground up.",
    log: [
      "Built and maintained automation frameworks in Cypress and Playwright",
      "Automated UI and API test cases, wired test runs into GitHub Actions CI/CD",
      "Shortened release cycles by introducing automation into regression and smoke testing",
      "Partnered with developers on test-strategy design for consistently high-quality releases",
    ],
  },
  {
    env: "SANDBOX",
    envTone: "cert",
    role: "Junior SQA Intern",
    org: "Together Initiatives (P) Limited",
    period: "AUG 2021 — MAR 2022",
    brief:
      "First tests, first bug reports — manual and automated testing, defects logged in JIRA, early API automation in Postman.",
    log: [],
  },
  {
    env: "ACADEMY",
    envTone: "dev",
    role: "B.Sc. in Computer Science and Engineering",
    org: "Port City International University",
    period: "2016 — 2020",
    brief: "The origin commit — computer science fundamentals, Chittagong.",
    log: [],
  },
];

/* ------------------------------------------------------------------ */
/*  PROJECTS — case studies                                            */
/* ------------------------------------------------------------------ */

export interface Artifact {
  id: string;
  version: string;
  name: string;
  kind: string;
  status: "LIVE" | "REDEPLOYING" | "DEPLOYED" | "ARCHIVED";
  description: string;
  stack: string[];
  proof: string[];
  url?: string;
  repo?: string;
  links?: { label: string; url: string }[];
}

export const CASE_STUDIES: Artifact[] = [
  {
    id: "CASE-001",
    version: "v1",
    name: "ABSORB LMS",
    kind: "LEARNING MANAGEMENT SYSTEM",
    status: "LIVE",
    description:
      "A commercial LMS — course creation, user management, assignments. I automated the UI and API workflows end to end and folded the suites into CI/CD, cutting the feedback loop from a full manual pass to minutes.",
    stack: ["UI automation", "API automation", "CI/CD integration", "Regression suite"],
    proof: [
      "Led regression and smoke testing that caught defects before they reached staging",
      "Automated course-creation, user-management and assignment workflows end to end",
    ],
  },
  {
    id: "CASE-002",
    version: "v1",
    name: "CONNEXPAY",
    kind: "FINTECH PAYMENT PLATFORM",
    status: "LIVE",
    description:
      "A payment-gateway platform where a missed edge case means a mischarged transaction. I automated payment-gateway and transaction-validation flows with Selenium WebDriver, backed by manual verification of every compliance-sensitive path.",
    stack: ["Selenium WebDriver", "Manual compliance testing", "API automation"],
    proof: [
      "Automated payment gateway and transaction validation with Selenium WebDriver",
      "Manual testing of payment flows for regulatory compliance",
    ],
  },
  {
    id: "CASE-003",
    version: "v1",
    name: "MYMANAGER CRM PORTAL",
    kind: "WORKFLOW-DRIVEN CRM",
    status: "DEPLOYED",
    description:
      "A workflow-driven CRM handling onboarding, task fulfillment, automated triggers and exception handling. I built end-to-end and automation suites for its state-based workflows, routing logic and data reconciliation, wired into CI/CD.",
    stack: ["End-to-end testing", "Workflow/state automation", "CI/CD integration"],
    proof: [
      "Verified cross-module data sync and resolved defects across the workflow engine",
      "Automation suites covered state-based workflows, routing, and reconciliation",
    ],
  },
  {
    id: "CASE-004",
    version: "v1",
    name: "DENOWATTS PERFORMANCE PORTAL",
    kind: "SOLAR PERFORMANCE ANALYTICS",
    status: "DEPLOYED",
    description:
      "A commissioning and energy-reporting portal for solar performance tracking. I validated commissioning workflows and energy-data reporting, and automated the critical workflows that keep production stable for the product and data teams.",
    stack: ["Commissioning workflow QA", "Reporting validation", "Cross-team collaboration"],
    proof: [
      "Automated critical workflows for production stability",
      "Validated energy-data reporting alongside product and data teams",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Terminal content                                                   */
/* ------------------------------------------------------------------ */

export const BOOT_SEQUENCE = [
  { text: "KAWSAR.OS — QA runtime v7.7.0", delay: 60 },
  { text: "[ OK ] mounting /dev/imagination ............ done", delay: 42 },
  { text: "[ OK ] loading modules: playwright cypress selenium postman", delay: 50 },
  { text: "[ OK ] establishing uplink: dhaka → the_world", delay: 46 },
  { text: "[ OK ] calibrating tesseract .................. 4D", delay: 52 },
  { text: "[ OK ] entropy levels nominal. time is relative.", delay: 44 },
  { text: "", delay: 30 },
  { text: "COVERAGE READY — 7 stages loaded", delay: 60 },
  { text: "> execute: scroll --to-execute", delay: 80 },
];

export const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "ls",
  "skills",
  "experience",
  "projects",
  "run-tests",
  "uptime",
  "contact",
  "interstellar",
  "tenet",
  "inception",
  "sudo",
  "clear",
];
