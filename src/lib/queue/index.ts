import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

export function enqueue<T>(fn: () => Promise<T>): Promise<T> {
	return queue.add(fn);
}

export function getQueueSize(): { pending: number; size: number } {
	return { pending: queue.pending, size: queue.size };
}
