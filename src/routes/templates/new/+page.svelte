<script lang="ts">
	import { ArrowLeft, Smartphone, Monitor, LayoutTemplate, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';

	let templateName = $state('');
	let selectedRatio = $state('portrait');
	let submitting = $state(false);

	let isValid = $derived(templateName.trim().length > 0);

	async function handleSubmit() {
		if (!isValid || submitting) return;

		submitting = true;

		const res = await fetch('/api/templates', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: templateName.trim(),
				ratio: selectedRatio,
				config: []
			})
		});

		if (res.ok) {
			const data = await res.json();
			window.location.href = `/templates/${data.id}`;
		} else {
			toast.error('Failed to create template');
			submitting = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl space-y-8">
	<div class="flex items-center gap-4">
		<a href="/templates">
			<Button variant="ghost" size="icon" class="h-9 w-9">
				<ArrowLeft class="h-5 w-5 text-slate-600" />
			</Button>
		</a>
		<div>
			<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Create New Template</h2>
			<p class="text-sm text-slate-500">Set up a new video template to get started</p>
		</div>
	</div>

	<Card class="border-slate-200 p-6 shadow-sm">
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-6"
		>
			<div class="space-y-2">
				<label for="template-name" class="text-sm font-medium text-slate-700">
					Template Name
				</label>
				<Input
					id="template-name"
					type="text"
					placeholder="e.g. TikTok Promo, Story Highlight"
					bind:value={templateName}
					class="text-sm"
				/>
			</div>

			<div class="space-y-2">
				<p class="text-sm font-medium text-slate-700">Aspect Ratio</p>
				<div class="grid grid-cols-2 gap-4">
					<button
						type="button"
						class={`flex flex-col items-center gap-3 rounded-xl border-2 p-8 transition-all ${
							selectedRatio === 'portrait'
								? 'border-violet-600 bg-violet-50 shadow-sm'
								: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
						}`}
						onclick={() => (selectedRatio = 'portrait')}
					>
						<div
							class={`rounded-full p-3 ${
								selectedRatio === 'portrait' ? 'bg-violet-100' : 'bg-slate-100'
							}`}
						>
							<Smartphone
								class={`h-6 w-6 ${
									selectedRatio === 'portrait' ? 'text-violet-600' : 'text-slate-500'
								}`}
							/>
						</div>
						<div class="text-center">
							<span
								class={`text-sm font-semibold ${
									selectedRatio === 'portrait' ? 'text-violet-700' : 'text-slate-700'
								}`}
							>
								Portrait
							</span>
							<span class="mt-0.5 block text-xs text-slate-500">9:16</span>
						</div>
					</button>

					<button
						type="button"
						class={`flex flex-col items-center gap-3 rounded-xl border-2 p-8 transition-all ${
							selectedRatio === 'landscape'
								? 'border-violet-600 bg-violet-50 shadow-sm'
								: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
						}`}
						onclick={() => (selectedRatio = 'landscape')}
					>
						<div
							class={`rounded-full p-3 ${
								selectedRatio === 'landscape' ? 'bg-violet-100' : 'bg-slate-100'
							}`}
						>
							<Monitor
								class={`h-6 w-6 ${
									selectedRatio === 'landscape' ? 'text-violet-600' : 'text-slate-500'
								}`}
							/>
						</div>
						<div class="text-center">
							<span
								class={`text-sm font-semibold ${
									selectedRatio === 'landscape' ? 'text-violet-700' : 'text-slate-700'
								}`}
							>
								Landscape
							</span>
							<span class="mt-0.5 block text-xs text-slate-500">16:9</span>
						</div>
					</button>
				</div>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
				<a href="/templates">
					<Button type="button" variant="outline">Cancel</Button>
				</a>
				<Button
					type="submit"
					class="bg-violet-600 hover:bg-violet-500"
					disabled={!isValid || submitting}
				>
					{#if submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Creating...
					{:else}
						<LayoutTemplate class="mr-2 h-4 w-4" />
						Create Template
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
