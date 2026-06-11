<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	const titles: Record<string, string> = {
		'/': 'Dashboard',
		'/videos': 'Videos',
		'/templates': 'Templates',
		'/media': 'Media',
		'/queue': 'Queue',
		'/settings': 'Settings'
	};

	function getTitle(pathname: string) {
		for (const [path, label] of Object.entries(titles)) {
			if (path !== '/' && pathname.startsWith(path)) return label;
		}
		return titles[pathname] || 'Dashboard';
	}

	const title = $derived(getTitle(page.url.pathname));
</script>

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
	<Button variant="ghost" size="icon" class="md:hidden">
		<Menu class="h-5 w-5" />
	</Button>
	<h1 class="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
</header>
