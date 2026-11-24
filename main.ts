// "The Database Went for Coffee" — entry for
// u-po-pu-say-what-actually-broke-a2c153b5.
//
// A tiny, dependency-free Node 22 program. It holds the single line of
// software error copy that tells the user the brutal truth about what went
// wrong, checks it against the competition gate (1 to 200 Unicode code
// points, one line, never blank), then writes it to entry.txt inside the
// harness output directory and re-reads the file to prove the bytes
// survived the round trip.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

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
  if (line !== line.trimEnd()) {
    throw new Error("error line must not end with whitespace");
  }
  if (line !== line.trimStart()) {
    throw new Error("error line must not start with whitespace");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `error line must not contain control characters (U+${code.toString(16).padStart(4, "0")})`,
      );
    }
  }
  return count;
}

function run(): void {
  const count = assertValid(LINE);

  // Determinism self-check: write the line twice to a scratch directory
  // and byte-compare the copies before touching the real output. A
  // non-deterministic render would fail here instead of shipping a
  // different entry than the one that was validated.
  const scratch = mkdtempSync(join(tmpdir(), "entry-determinism-"));
  try {
    const first = join(scratch, "first.txt");
    const second = join(scratch, "second.txt");
    writeFileSync(first, LINE, { encoding: "utf8" });
    writeFileSync(second, LINE, { encoding: "utf8" });
    if (readFileSync(first).compare(readFileSync(second)) !== 0) {
      throw new Error("determinism check failed: repeated writes differ");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

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
