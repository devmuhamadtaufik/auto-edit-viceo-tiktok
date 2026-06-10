---
name: ffmpeg-job
description: "Add a new FFmpeg video processing job to the queue. Use when creating video editing operations, transcoding, trimming, filters, or any FFmpeg-based processing."
argument-hint: "[job description or operation type]"
---

# FFmpeg Job Builder

## When to Use

- Adding a new video processing operation (trim, crop, filter, transcode, etc.)
- Creating a new job type for the p-queue
- Modifying existing FFmpeg processing logic

## Constraints

This runs on a VPS with **1GB RAM and 1 CPU**. Every job must be memory-efficient.

- p-queue concurrency is always **1** — one FFmpeg job at a time
- Never introduce Redis, BullMQ, or any external queue service
- FFmpeg operations must be wrapped in promises

## Procedure

### Step 1: Define the Job

Create the job function in `src/lib/video/`:

```ts
import ffmpeg from 'fluent-ffmpeg';

export function processVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}
```

### Step 2: Add to Queue

Register the job in `src/lib/queue/`:

```ts
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

export function enqueueVideoJob(job: () => Promise<void>): Promise<void> {
  return queue.add(job);
}
```

### Step 3: Write Tests

Create a Vitest test in `tests/` that verifies:

- The job resolves successfully with valid input
- The job rejects with invalid input
- Queue processes jobs one at a time

### Step 4: Create API Endpoint

Build the SvelteKit `+server.ts` endpoint that accepts job parameters and enqueues the job.

## Memory Tips

- Use FFmpeg output options that minimize memory: `-preset ultrafast`, `-movflags +faststart`
- Process videos in segments when possible instead of loading entire files
- Clean up temporary files immediately after processing
- Monitor with `-progress` flag for status updates
