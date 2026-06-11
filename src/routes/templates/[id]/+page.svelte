<script lang="ts">
	import {
		ArrowLeft,
		Type,
		Video,
		Trash2,
		Clock,
		PanelRightClose,
		PanelRightOpen,
		Loader2,
		Plus,
		Layers
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';

	type ComponentType = 'video' | 'text';

	type TemplateComponent = {
		id: string;
		type: ComponentType;
		content: string;
		startTime: number;
		duration: number;
		x: number;
		y: number;
		width: number;
		height: number;
	};

	const templateId = page.params.id;

	let name = $state('');
	let ratio = $state('portrait');
	let components = $state<TemplateComponent[]>([]);
	let selectedId = $state<string | null>(null);
	let saving = $state(false);
	let loading = $state(true);
	let currentTime = $state(0);
	let draggingId = $state<string | null>(null);
	let dragMode = $state<'move' | 'resize'>('move');
	let dragStartX = $state(0);
	let dragStartTime = $state(0);
	let dragStartDuration = $state(0);
	let propertiesOpen = $state(true);

	const isPortrait = $derived(ratio === 'portrait');
	const selected = $derived(components.find((c) => c.id === selectedId));
	const totalDuration = $derived(Math.max(10, ...components.map((c) => c.startTime + c.duration)));
	const pxPerSecond = 60;

	function generateTicks(duration: number, pxPerSec: number) {
		const ticks: { time: number; pos: number }[] = [];
		const step = duration > 60 ? 10 : duration > 30 ? 5 : 1;
		for (let t = 0; t <= duration; t += step) {
			ticks.push({ time: t, pos: t * pxPerSec });
		}
		return ticks;
	}

	function tickLabel(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	async function loadTemplate() {
		const res = await fetch(`/api/templates/${templateId}`);
		if (!res.ok) {
			toast.error('Template not found');
			window.location.href = '/templates';
			return;
		}

		const data = await res.json();
		name = data.name;
		ratio = data.ratio;
		components = JSON.parse(data.config);
		loading = false;
	}

	function addComponent(type: ComponentType) {
		const id = crypto.randomUUID();
		const newComp: TemplateComponent = {
			id,
			type,
			content: type === 'text' ? 'New Text' : '',
			startTime: 0,
			duration: 5,
			x: type === 'text' ? 10 : 0,
			y: type === 'text' ? 10 : 0,
			width: type === 'text' ? 80 : 100,
			height: type === 'text' ? 20 : 100
		};
		components = [...components, newComp];
		selectedId = id;
	}

	function removeComponent(id: string) {
		components = components.filter((c) => c.id !== id);
		if (selectedId === id) selectedId = null;
	}

	function updateComponent(id: string, updates: Partial<TemplateComponent>) {
		components = components.map((c) => (c.id === id ? { ...c, ...updates } : c));
	}

	async function saveTemplate() {
		if (!name.trim()) {
			toast.error('Template name is required');
			return;
		}

		saving = true;
		const res = await fetch(`/api/templates/${templateId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name.trim(),
				ratio,
				config: components
			})
		});

		if (res.ok) {
			toast.success('Template updated');
		} else {
			toast.error('Failed to update template');
		}

		saving = false;
	}

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function startDrag(e: MouseEvent, id: string, mode: 'move' | 'resize') {
		e.preventDefault();
		draggingId = id;
		dragMode = mode;
		dragStartX = e.clientX;
		const comp = components.find((c) => c.id === id);
		if (comp) {
			dragStartTime = comp.startTime;
			dragStartDuration = comp.duration;
		}
		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd);
	}

	function onDragMove(e: MouseEvent) {
		if (!draggingId) return;
		const deltaPx = e.clientX - dragStartX;
		const deltaSec = deltaPx / pxPerSecond;
		components = components.map((c) => {
			if (c.id !== draggingId) return c;
			if (dragMode === 'move') {
				const newStart = Math.max(0, dragStartTime + deltaSec);
				return { ...c, startTime: newStart };
			}
			const newDuration = Math.max(1, dragStartDuration + deltaSec);
			return { ...c, duration: newDuration };
		});
	}

	function onDragEnd() {
		draggingId = null;
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
	}

	$effect(() => {
		loadTemplate();
	});
</script>

{#if loading}
	<div class="flex h-screen items-center justify-center bg-slate-50">
		<div class="flex flex-col items-center gap-3">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600"></div>
			<p class="text-sm text-slate-500">Loading template...</p>
		</div>
	</div>
{:else}
	<div class="flex h-screen flex-col overflow-hidden bg-slate-50">
		<div class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
			<div class="flex items-center gap-3">
				<a href="/templates">
					<Button variant="ghost" size="icon" class="h-9 w-9">
						<ArrowLeft class="h-5 w-5 text-slate-600" />
					</Button>
				</a>
				<Separator orientation="vertical" class="h-6" />
				<Input
					bind:value={name}
					class="h-9 w-56 border-transparent bg-transparent text-sm font-semibold text-slate-900 hover:border-slate-200 focus:border-violet-300"
					placeholder="Template name"
				/>
				<Badge variant="secondary" class="shrink-0">{isPortrait ? '9:16' : '16:9'}</Badge>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					class="h-9 w-9"
					onclick={() => (propertiesOpen = !propertiesOpen)}
					title={propertiesOpen ? 'Hide properties' : 'Show properties'}
				>
					{#if propertiesOpen}
						<PanelRightClose class="h-4 w-4" />
					{:else}
						<PanelRightOpen class="h-4 w-4" />
					{/if}
				</Button>
				<Button
					class="h-9 bg-violet-600 px-4 text-sm hover:bg-violet-500"
					onclick={saveTemplate}
					disabled={saving}
				>
					{#if saving}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Saving...
					{:else}
						Save Changes
					{/if}
				</Button>
			</div>
		</div>

		<div class="flex min-h-0 flex-1 overflow-hidden">
			<div class="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-3">
				<button
					class="flex flex-col items-center gap-1 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
					onclick={() => addComponent('video')}
				>
					<Video class="h-5 w-5" />
					<span class="text-[10px] font-medium">Video</span>
				</button>
				<button
					class="flex flex-col items-center gap-1 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
					onclick={() => addComponent('text')}
				>
					<Type class="h-5 w-5" />
					<span class="text-[10px] font-medium">Text</span>
				</button>
			</div>

			<div class="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-slate-100 p-4">
				<div
					class="relative rounded-lg bg-black shadow-xl ring-1 ring-black/10 {isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'}"
					style="max-height: 100%; max-width: 100%; {isPortrait ? 'height: 100%' : 'width: 100%'};"
				>
					{#each components as comp (comp.id)}
						<button
							class="absolute cursor-pointer border-2 transition-colors"
							class:border-violet-500={selectedId === comp.id}
							class:border-transparent={selectedId !== comp.id}
							class:hover:border-slate-400={selectedId !== comp.id}
							style="left: {comp.x}%; top: {comp.y}%; width: {comp.width}%; height: {comp.height}%;"
							onclick={() => (selectedId = comp.id)}
						>
							{#if comp.type === 'text'}
								<div class="flex h-full w-full items-center justify-center bg-white/90 px-2 text-center text-sm font-medium text-slate-900">
									{comp.content}
								</div>
							{:else}
								<div class="flex h-full w-full items-center justify-center bg-slate-800/80">
									<Video class="h-8 w-8 text-slate-500" />
								</div>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			{#if propertiesOpen}
				<div class="w-64 shrink-0 overflow-y-auto border-l border-slate-200 bg-white">
					{#if selected}
						<div class="p-4">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-sm font-semibold text-slate-900">Properties</h3>
								<Badge variant="secondary" class="text-xs capitalize">{selected.type}</Badge>
							</div>

							<div class="flex flex-col gap-5">
								{#if selected.type === 'text'}
									<div class="flex flex-col gap-1.5">
										<label for="prop-text" class="text-xs font-medium text-slate-500">Text</label>
										<Input
											id="prop-text"
											value={selected.content}
											onchange={(e) => updateComponent(selected.id, { content: e.currentTarget.value })}
										/>
									</div>
									<Separator />
								{/if}

								<div>
									<p class="mb-2 text-xs font-medium text-slate-400">TIMING</p>
									<div class="grid grid-cols-2 gap-3">
										<div class="flex flex-col gap-1.5">
											<label for="prop-start" class="text-xs font-medium text-slate-500">Start (s)</label>
											<Input
												id="prop-start"
												type="number"
												value={selected.startTime}
												onchange={(e) => updateComponent(selected.id, { startTime: Number(e.currentTarget.value) })}
											/>
										</div>
										<div class="flex flex-col gap-1.5">
											<label for="prop-duration" class="text-xs font-medium text-slate-500">Duration (s)</label>
											<Input
												id="prop-duration"
												type="number"
												value={selected.duration}
												onchange={(e) => updateComponent(selected.id, { duration: Number(e.currentTarget.value) })}
											/>
										</div>
									</div>
								</div>

								<Separator />

								<div>
									<p class="mb-2 text-xs font-medium text-slate-400">POSITION</p>
									<div class="grid grid-cols-2 gap-3">
										<div class="flex flex-col gap-1.5">
											<label for="prop-x" class="text-xs font-medium text-slate-500">X (%)</label>
											<Input
												id="prop-x"
												type="number"
												value={selected.x}
												onchange={(e) => updateComponent(selected.id, { x: Number(e.currentTarget.value) })}
											/>
										</div>
										<div class="flex flex-col gap-1.5">
											<label for="prop-y" class="text-xs font-medium text-slate-500">Y (%)</label>
											<Input
												id="prop-y"
												type="number"
												value={selected.y}
												onchange={(e) => updateComponent(selected.id, { y: Number(e.currentTarget.value) })}
											/>
										</div>
									</div>
								</div>

								<Separator />

								<div>
									<p class="mb-2 text-xs font-medium text-slate-400">SIZE</p>
									<div class="grid grid-cols-2 gap-3">
										<div class="flex flex-col gap-1.5">
											<label for="prop-width" class="text-xs font-medium text-slate-500">Width (%)</label>
											<Input
												id="prop-width"
												type="number"
												value={selected.width}
												onchange={(e) => updateComponent(selected.id, { width: Number(e.currentTarget.value) })}
											/>
										</div>
										<div class="flex flex-col gap-1.5">
											<label for="prop-height" class="text-xs font-medium text-slate-500">Height (%)</label>
											<Input
												id="prop-height"
												type="number"
												value={selected.height}
												onchange={(e) => updateComponent(selected.id, { height: Number(e.currentTarget.value) })}
											/>
										</div>
									</div>
								</div>

								<Separator />

								<Button
									variant="destructive"
									size="sm"
									class="w-full"
									onclick={() => removeComponent(selected.id)}
								>
									<Trash2 class="mr-2 h-4 w-4" />
									Remove Component
								</Button>
							</div>
						</div>
					{:else}
						<div class="flex h-full flex-col items-center justify-center p-6 text-center">
							<div class="mb-3 rounded-full bg-slate-100 p-3">
								<Layers class="h-6 w-6 text-slate-400" />
							</div>
							<p class="text-sm font-medium text-slate-700">No component selected</p>
							<p class="mt-1 text-xs text-slate-500">Click a component on the canvas or timeline to edit its properties</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="shrink-0 overflow-hidden border-t border-slate-200 bg-white">
			<div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2">
				<Clock class="h-4 w-4 text-slate-400" />
				<span class="text-xs font-medium text-slate-600">Timeline</span>
				<span class="text-xs text-slate-400">{tickLabel(currentTime)} / {tickLabel(totalDuration)}</span>
				<span class="ml-auto text-xs text-slate-400">{components.length} layer{components.length !== 1 ? 's' : ''}</span>
			</div>

			{#if components.length === 0}
				<div class="flex h-32 flex-col items-center justify-center gap-2">
					<Plus class="h-5 w-5 text-slate-300" />
					<p class="text-xs text-slate-400">Add a video or text component to get started</p>
				</div>
			{:else}
				<div class="h-44 overflow-x-auto overflow-y-auto">
					<div class="relative px-4 pb-2" style="width: {totalDuration * pxPerSecond + 32}px; min-width: 100%;">
						<div class="relative mb-2 ml-7 h-5">
							{#each generateTicks(totalDuration, pxPerSecond) as tick}
								<div
									class="absolute top-0 text-[10px] text-slate-400"
									style="left: {tick.pos}px; transform: translateX(-50%);"
								>
									{tickLabel(tick.time)}
								</div>
								<div
									class="absolute top-3 h-2 w-px bg-slate-300"
									style="left: {tick.pos}px;"
								></div>
							{/each}
						</div>

						{#each components as comp (comp.id)}
							<div class="relative mb-1 flex h-10 items-center">
								<div class="absolute left-0 top-0 flex h-full w-6 items-center justify-center">
									{#if comp.type === 'video'}
										<Video class="h-3.5 w-3.5 text-slate-400" />
									{:else}
										<Type class="h-3.5 w-3.5 text-slate-400" />
									{/if}
								</div>
								<div
									role="button"
									tabindex="0"
									class="absolute flex h-9 cursor-grab items-center overflow-hidden rounded border-2 border-l-4 px-2 text-xs transition-colors select-none active:cursor-grabbing"
									class:border-violet-500={selectedId === comp.id}
									class:bg-violet-50={selectedId === comp.id}
									class:text-violet-700={selectedId === comp.id}
									class:border-slate-300={selectedId !== comp.id}
									class:bg-slate-50={selectedId !== comp.id}
									class:text-slate-600={selectedId !== comp.id}
									class:hover:border-slate-400={selectedId !== comp.id}
									style="left: {comp.startTime * pxPerSecond + 28}px; width: {Math.max(comp.duration * pxPerSecond - 4, 40)}px;"
									onclick={() => (selectedId = comp.id)}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectedId = comp.id; }}
									onmousedown={(e) => startDrag(e, comp.id, 'move')}
								>
									<span class="truncate font-medium">{comp.type === 'text' ? comp.content : 'Video'}</span>
									<span class="ml-1 shrink-0 text-[10px] opacity-50">{formatTime(comp.startTime)}–{formatTime(comp.startTime + comp.duration)}</span>
									<span
										class="absolute right-0 top-0 h-full w-3 cursor-ew-resize rounded-r bg-transparent hover:bg-slate-200/50"
										role="none"
										onmousedown={(e) => { e.stopPropagation(); startDrag(e, comp.id, 'resize'); }}
									></span>
								</div>
							</div>
						{/each}

						<div
							class="pointer-events-none absolute top-5 bottom-0 w-px bg-violet-600"
							style="left: {currentTime * pxPerSecond + 28 + 16}px;"
						>
							<div class="absolute -top-1 -left-1.5 h-3 w-3 rounded-full bg-violet-600"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
