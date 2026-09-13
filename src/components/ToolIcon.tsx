import type { ComponentType } from "react";
import { TestTube, Smartphone, Coffee, Workflow, Kanban as KanbanIcon } from "lucide-react";
import {
  SiDocker,
  SiJenkins,
  SiGithubactions,
  SiGithub,
  SiSelenium,
  SiCypress,
  SiPostman,
  SiJira,
  SiK6,
  SiApachejmeter,
  SiGit,
  SiTestrail,
  SiTrello,
  SiGraphql,
  SiJavascript,
  SiBitbucket,
  SiOwasp,
} from "react-icons/si";

export type ToolSlug =
  | "playwright"
  | "cypress"
  | "selenium"
  | "postman"
  | "k6"
  | "jmeter"
  | "github-actions"
  | "jenkins"
  | "jira"
  | "testrail"
  | "maestro"
  | "graphql"
  | "javascript"
  | "java"
  | "docker"
  | "git"
  | "github"
  | "bitbucket"
  | "trello"
  | "scrum"
  | "kanban"
  | "owasp";

interface IconProps {
  size?: number;
  className?: string;
}

const REGISTRY: Record<ToolSlug, ComponentType<IconProps>> = {
  // real brand marks
  cypress: SiCypress,
  selenium: SiSelenium,
  postman: SiPostman,
  k6: SiK6,
  jmeter: SiApachejmeter,
  "github-actions": SiGithubactions,
  jenkins: SiJenkins,
  jira: SiJira,
  testrail: SiTestrail,
  graphql: SiGraphql,
  javascript: SiJavascript,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  bitbucket: SiBitbucket,
  trello: SiTrello,
  owasp: SiOwasp,
  // no real brand mark exists — semantically-fitting generic fallback
  playwright: TestTube,
  maestro: Smartphone,
  java: Coffee,
  scrum: Workflow,
  kanban: KanbanIcon,
};

/** Exact-match lookup for single-word tool labels, e.g. Skills' manifest items. */
const EXACT: Record<string, ToolSlug> = {
  playwright: "playwright",
  cypress: "cypress",
  selenium: "selenium",
  postman: "postman",
  k6: "k6",
  jmeter: "jmeter",
  "github actions": "github-actions",
  jenkins: "jenkins",
  javascript: "javascript",
  java: "java",
  jira: "jira",
  testrail: "testrail",
  trello: "trello",
  docker: "docker",
  "git / github / bitbucket": "git",
  git: "git",
  github: "github",
  bitbucket: "bitbucket",
  scrum: "scrum",
  kanban: "kanban",
  maestro: "maestro",
  graphql: "graphql",
  owasp: "owasp",
};

export function slugifyTool(label: string): ToolSlug | null {
  return EXACT[label.trim().toLowerCase()] ?? null;
}

/** Substring scan for phrase-y text, e.g. Projects' `stack` entries or free-form log lines. */
export function findToolMentions(text: string): ToolSlug[] {
  const lower = text.toLowerCase();
  const found = new Set<ToolSlug>();
  for (const [needle, slug] of Object.entries(EXACT)) {
    if (needle.length > 2 && lower.includes(needle)) found.add(slug);
  }
  return Array.from(found);
}

export default function ToolIcon({
  tool,
  size = 14,
  className = "",
}: {
  tool: ToolSlug;
  size?: number;
  className?: string;
}) {
  const Icon = REGISTRY[tool];
  return <Icon size={size} className={className} />;
}
