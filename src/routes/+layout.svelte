<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/state';

	let { children } = $props();

	const isEditorMode = $derived(
		/^\/templates\/[^/]+$/.test(page.url.pathname) && page.url.pathname !== '/templates/new'
	);
</script>

<div class="flex min-h-screen bg-slate-50">
	{#if !isEditorMode}
		<Sidebar />
	{/if}
	<div class="flex flex-1 flex-col overflow-hidden" class:md:ml-60={!isEditorMode}>
		{#if !isEditorMode}
			<Header />
		{/if}
		<main class:flex-1={true} class:p-6={!isEditorMode} class:overflow-hidden={isEditorMode}>
			{@render children()}
		</main>
	</div>
</div>
<Toaster />

