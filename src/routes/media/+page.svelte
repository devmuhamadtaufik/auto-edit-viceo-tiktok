<script lang="ts">
	import { Upload, Trash2, Video, Loader2, Play } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	type VideoRecord = {
		id: string;
		filename: string;
		originalPath: string;
		thumbnailPath: string | null;
		status: string;
		createdAt: string;
		updatedAt: string;
	};

	let videos = $state<VideoRecord[]>([]);
	let uploading = $state(false);
	let deleteTarget = $state<VideoRecord | null>(null);
	let previewTarget = $state<VideoRecord | null>(null);
	let loading = $state(true);

	async function loadVideos() {
		loading = true;
		const res = await fetch('/api/media');
		videos = await res.json();
		loading = false;
	}

	async function handleUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		const formData = new FormData();
		formData.append('file', file);

		const res = await fetch('/api/media', { method: 'POST', body: formData });

		if (res.ok) {
			toast.success('Video uploaded successfully');
			await loadVideos();
		} else {
			toast.error('Failed to upload video');
		}

		uploading = false;
		input.value = '';
	}

	async function handleDelete() {
		if (!deleteTarget) return;

		const res = await fetch(`/api/media/${deleteTarget.id}`, { method: 'DELETE' });

		if (res.ok) {
			toast.success('Video deleted');
			await loadVideos();
		} else {
			toast.error('Failed to delete video');
		}

		deleteTarget = null;
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	$effect(() => {
		loadVideos();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Media</h2>
			<p class="text-sm text-slate-500">Upload and manage your video files</p>
		</div>
		<div class="flex items-center gap-3">
			<input
				type="file"
				id="video-upload"
				accept="video/*"
				onchange={handleUpload}
				class="hidden"
			/>
			<Button
				class="bg-violet-600 hover:bg-violet-500"
				onclick={() => document.getElementById('video-upload')?.click()}
				disabled={uploading}
			>
				{#if uploading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Uploading...
				{:else}
					<Upload class="mr-2 h-4 w-4" />
					Upload Video
				{/if}
			</Button>
		</div>
	</div>

	<Card>
		{#if loading}
			<div class="flex items-center justify-center p-12">
				<Loader2 class="h-6 w-6 animate-spin text-slate-400" />
			</div>
		{:else if videos.length === 0}
			<div class="flex flex-col items-center justify-center gap-4 p-12">
				<div class="rounded-full bg-slate-100 p-4">
					<Video class="h-8 w-8 text-slate-400" />
				</div>
				<div class="text-center">
					<h3 class="text-lg font-semibold text-slate-900">No videos uploaded</h3>
					<p class="mt-1 text-sm text-slate-500">Click "Upload Video" to add your first video</p>
				</div>
			</div>
		{:else}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Preview</TableHead>
						<TableHead>Filename</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Uploaded</TableHead>
						<TableHead class="w-20">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each videos as video (video.id)}
						<TableRow>
							<TableCell>
								<button
									class="group relative h-16 w-28 overflow-hidden rounded-md bg-slate-100"
									onclick={() => (previewTarget = video)}
								>
									{#if video.thumbnailPath}
										<img
												src={`/${video.thumbnailPath}`}
											alt={video.filename}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center">
											<Video class="h-6 w-6 text-slate-400" />
										</div>
									{/if}
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Play class="h-6 w-6 text-white" />
									</div>
								</button>
							</TableCell>
							<TableCell class="font-medium">{video.filename}</TableCell>
							<TableCell>
								<Badge variant="secondary" class="text-xs">{video.status}</Badge>
							</TableCell>
							<TableCell class="text-sm text-slate-500">{formatDate(video.createdAt)}</TableCell>
							<TableCell>
								<Button
									variant="ghost"
									size="icon"
									onclick={() => (deleteTarget = video)}
								>
									<Trash2 class="h-4 w-4 text-red-500" />
								</Button>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</Card>
</div>

<Dialog open={deleteTarget !== null} onOpenChange={() => (deleteTarget = null)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete Video</DialogTitle>
			<DialogDescription>
				Are you sure you want to delete "{deleteTarget?.filename}"? This action cannot be undone.
			</DialogDescription>
		</DialogHeader>
		<DialogFooter>
			<Button variant="outline" onclick={() => (deleteTarget = null)}>Cancel</Button>
			<Button variant="destructive" onclick={handleDelete}>Delete</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

<Dialog open={previewTarget !== null} onOpenChange={() => (previewTarget = null)}>
	<DialogContent class="max-w-3xl">
		<DialogHeader>
			<DialogTitle>{previewTarget?.filename}</DialogTitle>
		</DialogHeader>
		{#if previewTarget}
			<video
				controls
				playsinline
				preload="metadata"
				class="w-full rounded-md"
				src={`/${previewTarget.originalPath}`}
				poster={previewTarget.thumbnailPath ? `/${previewTarget.thumbnailPath}` : undefined}
			>
				<track kind="captions" />
			</video>
		{/if}
	</DialogContent>
</Dialog>
