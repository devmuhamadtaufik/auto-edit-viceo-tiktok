<script lang="ts">
	import { Film, Upload } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h2>
		<p class="text-sm text-slate-500">Overview of your video editing pipeline</p>
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		<Card class="p-4">
			<p class="text-xs font-medium text-slate-500">TOTAL VIDEOS</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">0</p>
		</Card>
		<Card class="p-4">
			<p class="text-xs font-medium text-slate-500">QUEUED JOBS</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">0</p>
		</Card>
		<Card class="p-4">
			<p class="text-xs font-medium text-slate-500">COMPLETED</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">0</p>
		</Card>
	</div>

	<Card class="flex flex-col items-center justify-center gap-4 p-12">
		<div class="rounded-full bg-slate-100 p-4">
			<Film class="h-8 w-8 text-slate-400" />
		</div>
		<div class="text-center">
			<h3 class="text-lg font-semibold text-slate-900">No videos yet</h3>
			<p class="mt-1 text-sm text-slate-500">Upload your first video to start editing</p>
		</div>
		<Button class="bg-violet-600 hover:bg-violet-500">
			<Upload class="mr-2 h-4 w-4" />
			Upload Video
		</Button>
	</Card>
</div>
