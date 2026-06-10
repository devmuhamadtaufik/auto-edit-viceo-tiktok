---
description: "Use when working with FFmpeg video processing, fluent-ffmpeg, or files in src/lib/video/. Covers memory constraints, queue patterns, and processing conventions."
applyTo: "src/lib/video/**"
---

# Video Processing Guidelines

## Memory Constraints

This runs on a VPS with 1GB RAM and 1 CPU. Every FFmpeg operation must be memory-efficient.

- Use `-preset ultrafast` for faster, lower-memory encoding
- Use `-movflags +faststart` for web-optimized output
- Process videos in segments when possible
- Clean up temporary files immediately after use

## Queue Pattern

All FFmpeg operations go through p-queue with concurrency: 1.

```ts
import PQueue from 'p-queue';
const queue = new PQueue({ concurrency: 1 });
```

Never run FFmpeg directly — always wrap in a promise and enqueue:

```ts
function runFfmpeg(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}
```

## Rules

- Never introduce Redis, BullMQ, or external queue services
- Never add inline comments (`//`)
- Keep functions small and single-purpose
- All FFmpeg operations return promises
