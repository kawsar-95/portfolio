"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import StatusDot from "@/components/StatusDot";
import { IDENTITY, PIPELINE_GATE_STEPS, SECURITY_REVIEW } from "@/lib/data";

type LineKind = "in" | "out" | "ok" | "err" | "dim" | "amber";
interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

let uid = 0;
const L = (kind: LineKind, text: string): Line => ({ id: uid++, kind, text });

const PROMPT = "guest@nuruddinkawsar.me";

const HELP = [
  L("amber", "AVAILABLE COMMANDS"),
  L("out", "  whoami        who is running this suite"),
  L("out", "  ls            list the case studies"),
  L("out", "  skills        inspect the test manifest"),
  L("out", "  books         the QA reading list behind this build"),
  L("out", "  experience    QA career history"),
  L("out", "  projects      case-study registry"),
  L("out", "  run-tests     execute the regression suite"),
  L("out", "  pipeline      view the release gate"),
  L("out", "  uptime        how long you've been in the tesseract"),
  L("out", "  contact       open a channel"),
  L("out", "  clear         purge the scrollback"),
  L("dim", "  ...and three Nolan easter eggs hidden in the dark."),
];

const KIND_CLASS: Record<LineKind, string> = {
  in: "text-bone",
  out: "text-bone/75",
  ok: "text-go",
  err: "text-danger",
  dim: "text-faint",
  amber: "text-amber",
};

/**
 * ACT VI — TRIAGE. A real shell into the portfolio. This is where
 * visitors stop watching QA and start doing it.
 */
export default function TerminalSection({ bootedAt }: { bootedAt: number | null }) {
  const [lines, setLines] = useState<Line[]>([
    L("dim", "Last login: from the far side of the wormhole"),
    L("amber", "KAWSAR-QA SHELL — type `help` to begin."),
    L("dim", "Hint: real QA engineers run `run-tests`."),
  ]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const push = (...newLines: Line[]) => setLines((p) => [...p, ...newLines]);

  const runTests = () => {
    setRunning(true);
    const steps: [string, number][] = [
      ["▸ suite triggered: regression + smoke (main)", 200],
      ["▸ [1/7] loading specs ....................... 42 files", 550],
      ["▸ [2/7] launching browsers .................. chromium, webkit, firefox", 800],
      ["▸ [3/7] executing suite ..................... 214 tests", 900],
      ["▸ [4/7] api contract checks ................. 38 endpoints", 950],
      ["▸ [5/7] triaging failures ................... 0 flaky, 0 blocked", 700],
      ["▸ [6/7] generating report .................... playwright-report/index.html", 900],
      ["▸ [7/7] posting results ..................... #qa-releases", 800],
    ];
    let acc = 0;
    steps.forEach(([text, wait]) => {
      acc += wait;
      timers.current.push(setTimeout(() => push(L("out", text)), acc));
    });
    acc += 700;
    timers.current.push(
      setTimeout(() => {
        push(
          L("ok", "✓ 214 passed, 0 failed — suite green."),
          L("ok", `✓ security review: ${SECURITY_REVIEW.headline.toLowerCase()}`),
          L("amber", "  You just did my job. How did it feel?"),
          L("dim", "  — that feeling is why I chose QA.")
        );
        setRunning(false);
      }, acc)
    );
  };

  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    push(L("in", `${PROMPT}:~$ ${raw}`));
    setHistory((h) => [raw, ...h]);
    setHistIdx(-1);

    switch (cmd) {
      case "help":
        push(...HELP);
        break;
      case "whoami":
        push(
          L("out", "Nuruddin Kawsar — SQA engineer, Dhaka."),
          L("out", "I break things on purpose, so production doesn't break by accident."),
          L("dim", "Currently: QA Automation Engineer @ Shomvob Technologies.")
        );
        break;
      case "ls":
        push(
          L("out", "case-studies/  skills.txt  experience.log  contact.yml"),
          L("dim", "flaky-tests.log  [QUARANTINED — nice try]")
        );
        break;
      case "skills":
        push(
          L("amber", "TEST MANIFEST (7 SUITES):"),
          L("out", "  cypress · selenium · playwright · postman · k6 · jmeter"),
          L("out", "  github-actions · jenkins · jira · testrail · docker · git"),
          L("out", "  javascript · java · scrum · kanban"),
          L("dim", "  full breakdown in ACT III — scroll up.")
        );
        break;
      case "experience":
        push(
          L("out", "2026–now   QA Automation Engineer   @ Shomvob Technologies    [PRODUCTION]"),
          L("out", "2025–26    Software QA Engineer     @ Nifty IT Solution       [STAGING]"),
          L("out", "2025       Software QA Engineer     @ NextLevel Media         [STAGING]"),
          L("out", "2022–25    Associate SDET           @ Together Initiatives    [STAGING]"),
          L("out", "2021–22    Junior SQA Intern        @ Together Initiatives    [SANDBOX]"),
          L("out", "2016–20    B.Sc. Computer Science   @ Port City Int'l Univ.   [ACADEMY]")
        );
        break;
      case "projects":
        push(
          L("amber", "CASE STUDIES:"),
          L("ok", "  case-001   ABSORB LMS                [LIVE]     learning management"),
          L("ok", "  case-002   CONNEXPAY                  [LIVE]     fintech payments"),
          L("out", "  case-003   MYMANAGER CRM PORTAL      [DEPLOYED] workflow CRM"),
          L("out", "  case-004   DENOWATTS PERFORMANCE     [DEPLOYED] solar analytics"),
          L("dim", "  ACT V has the full manifest.")
        );
        break;
      case "uptime": {
        const s = bootedAt ? Math.floor((Date.now() - bootedAt) / 1000) : 0;
        push(
          L("out", `mission elapsed: T+${Math.floor(s / 60)}m ${s % 60}s`),
          L("ok", "test pass rate: 99.99% (the 0.01% was a flaky Selenium wait)")
        );
        break;
      }
      case "contact":
        push(
          L("amber", "OPEN A CHANNEL:"),
          L("out", `  email     ${IDENTITY.email}`),
          L("out", `  github    github.com/${IDENTITY.githubHandle}`),
          L("out", "  linkedin  /in/nuruddin-kawsar"),
          L("out", "  web       nuruddinkawsar.me")
        );
        break;
      case "run-tests":
        if (running) {
          push(L("err", "a suite run is already in progress — tests don't like to be rushed."));
        } else {
          runTests();
        }
        break;
      case "pipeline":
        push(
          L("amber", "RELEASE GATE:"),
          ...PIPELINE_GATE_STEPS.map((s) =>
            L(
              s.status === "pass" ? "ok" : "out",
              `  ${s.status === "pass" ? "✓" : "○"} ${s.label.padEnd(16, " ")} ${s.detail ?? ""}`
            )
          ),
          L("dim", "  full manifest in ACT III — scroll up.")
        );
        break;
      case "books":
        push(
          L("amber", "REQUIRED READING — QA BOOKSHELF:"),
          L("out", "  Agile Testing — Lisa Crispin & Janet Gregory"),
          L("out", "  More Agile Testing — Janet Gregory & Lisa Crispin"),
          L("dim", "  gist: whole-team approach · testing quadrants · test"),
          L("dim", "  automation pyramid · exploratory testing · atdd/bdd ·"),
          L("dim", "  risk-based testing · t-shaped skill set · zero bug tolerance"),
          L("dim", "  the doctrine behind every suite in this build.")
        );
        break;
      case "sudo":
        push(
          L("err", "guest is not in the sudoers file. This incident will be reported."),
          L("dim", "(to /var/log/nice-try.log)")
        );
        break;
      case "tenet":
        push(
          L("out", "TENET is a palindrome — it reads the same forwards and backwards."),
          L("dim", "Like a good regression suite: fully reversible. Entropy: inverted.")
        );
        break;
      case "interstellar":
        push(
          L("out", "\"Do not go gentle into that good night.\""),
          L("out", "\"Rage, rage against the dying of the light.\""),
          L("dim", "— the poem Cooper's mission lived by. uptime is a kind of rage.")
        );
        break;
      case "inception":
        push(
          L("out", "You need to go deeper."),
          L("dim", "a container in a VM in a datacenter in a dream. the top is still spinning.")
        );
        break;
      case "clear":
        setLines([]);
        break;
      default:
        if (cmd.startsWith("run-tests ")) {
          // flags accepted, ignored with confidence — e.g. `run-tests --headed`
          if (running) {
            push(L("err", "a suite run is already in progress — tests don't like to be rushed."));
          } else {
            runTests();
          }
        } else {
          push(
            L("err", `command not found: ${cmd}`),
            L("dim", "type `help` for available commands")
          );
        }
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length && histIdx < history.length - 1) {
        const next = histIdx + 1;
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(history[next]);
      } else {
        setHistIdx(-1);
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section id="triage" className="relative px-5 py-32 md:px-12 md:py-44 lg:px-24">
      <SectionTitle
        act="ACT VI"
        title="TRIAGE"
        log="Enough watching. Take the controls — this shell is real. Type `run-tests` when ready."
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="crt term-shadow terminal-shell relative mx-auto max-w-4xl overflow-hidden bg-carbon"
        onClick={() => inputRef.current?.focus()}
      >
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-bone/8 bg-steel/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-go/80" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dust">
            {PROMPT}: ~ — ssh — 80×24
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-go">
            <StatusDot tone="go" pulse />
            CONNECTED
          </span>
        </div>

        {/* scrollback */}
        <div
          ref={bodyRef}
          className="h-[420px] overflow-y-auto p-4 font-mono text-[11px] leading-[1.85] md:p-6 md:text-xs"
        >
          {lines.map((line) => (
            <div key={line.id} className={`whitespace-pre-wrap ${KIND_CLASS[line.kind]}`}>
              {line.text}
            </div>
          ))}

          {/* input row */}
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-amber">{PROMPT}:~$</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onScroll={(e) => {
                  // keep the mirror glued to the input's scroll offset
                  if (mirrorRef.current)
                    mirrorRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label="terminal input"
                className="w-full bg-transparent font-mono text-bone caret-transparent outline-none"
              />
              {/*
                Block cursor: an invisible copy of the typed text carries an
                inline cursor block, so it lands exactly after the last glyph
                at the true baseline — no ch-unit math, no top guessing.
                Hollow when blurred, solid amber when focused, like a real tty.
              */}
              <div
                ref={mirrorRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre"
              >
                <span className="invisible">{input}</span>
                <span
                  className={`h-[1.1em] w-[0.6em] shrink-0 ${
                    focused
                      ? "animate-blink bg-amber/80"
                      : "border border-amber/50 bg-transparent"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 text-center font-mono text-[10px] tracking-[0.3em] text-faint"
      >
        ↑/↓ HISTORY · CTRL+L CLEARS · THREE EASTER EGGS HIDE IN THE DARK
      </motion.p>
    </section>
  );
}
