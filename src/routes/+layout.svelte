<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-slate-50">
	<Sidebar />
	<div class="flex flex-1 flex-col md:ml-60">
		<Header />
		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
</div>
<Toaster />

