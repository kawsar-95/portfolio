"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import ToolIcon, { slugifyTool } from "@/components/ToolIcon";
import PipelineGate from "@/components/devsecops/PipelineGate";
import { SKILL_LAYERS, PIPELINE_GATE_STEPS } from "@/lib/data";

/**
 * ACT III — CASE. Skills the way a QA engineer actually stores them:
 * as layers of a test manifest. Read top to bottom — each layer builds on the last.
 */
export default function Skills() {
  let lineNo = 0;

  return (
    <section id="case" className="relative px-5 py-32 md:px-12 md:py-44 lg:px-24">
      <SectionTitle
        act="ACT III"
        title="CASE"
        log="A suite is built in layers. So is a QA engineer. Here is my test manifest."
      />

      <div className="mx-auto max-w-5xl">
        {/* dockerfile window */}
        <div className="artifact overflow-hidden">
          <div className="flex items-center justify-between border-b border-bone/8 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-go/70" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-dust">
              ~/kawsar/test-manifest.yml
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
              8 SUITES
            </span>
          </div>

          <div className="p-5 md:p-9">
            {SKILL_LAYERS.map((layer, i) => {
              const current = ++lineNo;
              return (
                <motion.div
                  key={layer.directive}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  className="group border-l border-faint/40 py-5 pl-5 transition-colors duration-500 first:pt-0 last:pb-0 hover:border-amber/60 md:pl-8"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-sm md:text-base">
                    <span className="w-7 select-none text-right text-[10px] text-faint">
                      {current}
                    </span>
                    <span className="text-amber">{layer.directive.split(" ")[0]}</span>
                    <span className="text-bone">
                      {layer.directive.split(" ").slice(1).join(" ")}
                    </span>
                    <span className="text-[10px] italic tracking-wider text-faint md:text-xs">
                      # {layer.comment}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pl-7 md:pl-11">
                    {layer.items.map((item) => {
                      const slug = slugifyTool(item);
                      return (
                        <span
                          key={item}
                          className="flex items-center gap-1.5 border border-bone/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-dust transition-colors duration-300 group-hover:border-amber/25 group-hover:text-bone/80 md:text-[11px]"
                        >
                          {slug && <ToolIcon tool={slug} size={12} />}
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            {/* build success */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 border-t border-bone/8 pt-6 font-mono text-xs leading-loose md:text-sm"
            >
              <div className="text-dust">
                [8/8] RUNNING final_checks --zero-defects
              </div>
              <div className="text-go">
                ✓ All suites green — <span className="text-bone">kawsar/sqa-engineer:latest</span>
              </div>
              <div className="text-go">
                ✓ Coverage report published —{" "}
                <span className="text-bone">kawsar/sqa-engineer:signed-off</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8"
        >
          <PipelineGate title="~/kawsar/ci — release gate" steps={PIPELINE_GATE_STEPS} />
        </motion.div>
      </div>
    </section>
  );
}
