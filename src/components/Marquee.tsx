"use client";

const TOOLS = [
  "PLAYWRIGHT", "CYPRESS", "SELENIUM", "POSTMAN", "K6", "JMETER",
  "GITHUB ACTIONS", "JENKINS", "JIRA", "TESTRAIL", "MAESTRO", "GRAPHQL",
  "JAVASCRIPT", "JAVA", "DOCKER", "GIT", "SCRUM", "KANBAN",
];

/**
 * The toolchain conveyor — an infinite strip of everything that ships.
 */
export default function Marquee() {
  const row = [...TOOLS, ...TOOLS];
  return (
    <div className="relative overflow-hidden border-y border-bone/8 py-5">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {row.map((tool, i) => (
          <span key={`${tool}-${i}`} className="flex items-center gap-8">
            <span
              className={`display-xl text-2xl md:text-3xl ${
                i % 2 === 0 ? "text-bone/80" : "text-outline"
              }`}
            >
              {tool}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-amber/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
