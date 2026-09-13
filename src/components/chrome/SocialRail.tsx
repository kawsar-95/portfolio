"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { IDENTITY } from "@/lib/data";

const LINKS = [
  { label: "GITHUB", href: IDENTITY.github, icon: FaGithub, cursor: "OPEN" },
  { label: "LINKEDIN", href: IDENTITY.linkedin, icon: FaLinkedin, cursor: "OPEN" },
  { label: "EMAIL", href: `mailto:${IDENTITY.email}`, icon: FaEnvelope, cursor: "SEND" },
];

/**
 * Persistent social rail — GitHub/LinkedIn/email reachable from any
 * scroll position, no trip down to the sign-off section required.
 */
export default function SocialRail() {
  return (
    <div className="fixed left-6 top-1/2 z-[100] hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex">
      {LINKS.map(({ label, href, icon: Icon, cursor }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          data-cursor={cursor}
          className="text-dust transition-colors duration-300 hover:text-amber"
        >
          <Icon size={15} />
        </a>
      ))}
      <span className="h-14 w-px bg-faint/50" />
    </div>
  );
}
