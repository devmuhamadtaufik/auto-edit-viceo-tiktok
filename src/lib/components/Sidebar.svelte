<script lang="ts">
	import { Video, Film, ListOrdered, Settings, LayoutTemplate, Images } from '@lucide/svelte';
	import { page } from '$app/state';

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: Film },
		{ href: '/videos', label: 'Videos', icon: Video },
		{ href: '/templates', label: 'Templates', icon: LayoutTemplate },
		{ href: '/media', label: 'Media', icon: Images },
		{ href: '/queue', label: 'Queue', icon: ListOrdered },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];
</script>

<aside class="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col bg-slate-900 text-slate-100 md:flex">
	<div class="flex h-14 items-center gap-2 border-b border-slate-700 px-4">
		<Film class="h-6 w-6 text-violet-400" />
		<span class="text-lg font-semibold tracking-tight">Video Editor</span>
	</div>
	<nav class="flex-1 space-y-1 p-3">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white"
				class:bg-slate-800={item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)}
				class:text-white={item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)}
				class:text-slate-400={item.href === '/' ? page.url.pathname !== '/' : !page.url.pathname.startsWith(item.href)}
			>
				<item.icon class="h-4 w-4" />
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="border-t border-slate-700 p-3">
		<p class="text-xs text-slate-500">Video Auto Editor v0.1</p>
	</div>
</aside>
