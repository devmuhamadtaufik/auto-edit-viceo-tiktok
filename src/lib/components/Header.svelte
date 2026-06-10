<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { title = 'Dashboard' }: { title?: string } = $props();
</script>

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
	<Button variant="ghost" size="icon" class="md:hidden">
		<Menu class="h-5 w-5" />
	</Button>
	<h1 class="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
</header>
