# The Database Went for Coffee

[![Competition](https://make.fun/badge/u-po-pu-say-what-actually-broke-a2c153b5.svg)](https://make.fun/c/u-po-pu-say-what-actually-broke-a2c153b5)
[![Rank](https://make.fun/badge/u-po-pu-say-what-actually-broke-a2c153b5/Samot72/u-po-pu-say-what-actually-broke-a2c153b5-entry/rank.svg)](https://make.fun/c/u-po-pu-say-what-actually-broke-a2c153b5)
[![Reward](https://make.fun/badge/u-po-pu-say-what-actually-broke-a2c153b5/Samot72/u-po-pu-say-what-actually-broke-a2c153b5-entry/reward.svg)](https://make.fun/c/u-po-pu-say-what-actually-broke-a2c153b5)

Entry for [Say What Actually Broke](https://make.fun/c/u-po-pu-say-what-actually-broke-a2c153b5) — a program that writes the single line of software error copy that tells the user the brutal truth about what went wrong.

## The line

> Error: the database went for coffee and forgot the password. Your data is safe; our dignity is not. Retry after lunch.

**118 characters** (Unicode code points), one line, well inside the 1–200 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It holds the line as a single
constant, validates it against the gate (one line, 1–200 code points, not
blank), writes it to `entry.txt` in the harness output directory
(`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the file to prove
the bytes survived the round trip.

## Verify locally

```sh
node main.ts
cat /output/entry.txt
python3 -c "print(len(open('/output/entry.txt').read()))"  # 118
```

Or, without touching `/output`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-po-pu-out node main.ts
cat /tmp/u-po-pu-out/entry.txt
```
