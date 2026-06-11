<script lang="ts">
	import { Plus, Trash2, LayoutTemplate, Smartphone, Monitor } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	type Template = {
		id: string;
		name: string;
		ratio: string;
		config: string;
		createdAt: string;
		updatedAt: string;
	};

	let templates = $state<Template[]>([]);
	let loading = $state(true);
	let deleteTarget = $state<Template | null>(null);

	async function loadTemplates() {
		loading = true;
		const res = await fetch('/api/templates');
		templates = await res.json();
		loading = false;
	}

	async function handleDelete() {
		if (!deleteTarget) return;

		const res = await fetch(`/api/templates/${deleteTarget.id}`, { method: 'DELETE' });

		if (res.ok) {
			toast.success('Template deleted');
			await loadTemplates();
		} else {
			toast.error('Failed to delete template');
		}

		deleteTarget = null;
	}



	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	$effect(() => {
		loadTemplates();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Templates</h2>
			<p class="text-sm text-slate-500">Create and manage video templates</p>
		</div>
		<a href="/templates/new">
			<Button class="bg-violet-600 hover:bg-violet-500">
				<Plus class="mr-2 h-4 w-4" />
				New Template
			</Button>
		</a>
	</div>

	{#if loading}
		<div class="flex items-center justify-center p-12">
			<div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600"></div>
		</div>
	{:else if templates.length === 0}
		<Card class="flex flex-col items-center justify-center gap-4 p-12">
			<div class="rounded-full bg-slate-100 p-4">
				<LayoutTemplate class="h-8 w-8 text-slate-400" />
			</div>
			<div class="text-center">
				<h3 class="text-lg font-semibold text-slate-900">No templates yet</h3>
				<p class="mt-1 text-sm text-slate-500">Create your first template to speed up video editing</p>
			</div>
			<a href="/templates/new">
				<Button class="bg-violet-600 hover:bg-violet-500">
					<Plus class="mr-2 h-4 w-4" />
					Create Template
				</Button>
			</a>
		</Card>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each templates as template (template.id)}
				<Card class="group relative flex flex-col p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="flex items-center gap-2">
							{#if template.ratio === 'portrait'}
								<Smartphone class="h-4 w-4 text-slate-500" />
							{:else}
								<Monitor class="h-4 w-4 text-slate-500" />
							{/if}
							<Badge variant="secondary" class="text-xs">{template.ratio}</Badge>
						</div>
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
							onclick={() => (deleteTarget = template)}
						>
							<Trash2 class="h-4 w-4 text-red-500" />
						</Button>
					</div>
					<a href={`/templates/${template.id}`} class="block">
						<h3 class="text-lg font-semibold text-slate-900 hover:text-violet-600">{template.name}</h3>
						<p class="mt-1 text-xs text-slate-500">{formatDate(template.createdAt)}</p>
					</a>
					<div class="mt-3 text-xs text-slate-400">
						{JSON.parse(template.config).length} components
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>


<Dialog open={deleteTarget !== null} onOpenChange={() => (deleteTarget = null)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete Template</DialogTitle>
			<DialogDescription>
				Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
			</DialogDescription>
		</DialogHeader>
		<DialogFooter>
			<Button variant="outline" onclick={() => (deleteTarget = null)}>Cancel</Button>
			<Button variant="destructive" onclick={handleDelete}>Delete</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
