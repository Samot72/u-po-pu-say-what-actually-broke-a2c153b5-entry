// "The Database Went for Coffee" — entry for
// u-po-pu-say-what-actually-broke-a2c153b5.
//
// A tiny, dependency-free Node 22 program. It holds the single line of
// software error copy that tells the user the brutal truth about what went
// wrong, checks it against the competition gate (1 to 200 Unicode code
// points, one line, never blank), then writes it to entry.txt inside the
// harness output directory and re-reads the file to prove the bytes
// survived the round trip.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// The error line, exactly as it will be judged: the database left, the
// data is fine, only our dignity took the hit.
const LINE =
  "Error: the database went for coffee and forgot the password. Your data is safe; our dignity is not. Retry after lunch.";

const GATE_MIN = 1;
const GATE_MAX = 200;

/** Enforce the gate: one line, length counted in code points, not blank. */
function assertValid(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("error line must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(
      `error line must be ${GATE_MIN}-${GATE_MAX} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("error line must not be blank");
  }
  return count;
}

function run(): void {
  const count = assertValid(LINE);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, LINE, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== LINE) {
    throw new Error(
      "verification failed: file content differs from the error line",
    );
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(LINE);
}

run();
