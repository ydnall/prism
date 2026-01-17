<script lang="ts">
	const {
		children,
		variant = 'default',
		class: className,
		type = 'button',
		disabled = false,
		onclick
	} = $props<{
		children: import('svelte').Snippet;
		variant?: 'default' | 'secondary' | 'outline';
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
	}>();

	const base =
		'group rounded-xl px-12 py-6 text-xl font-semibold ' +
		'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ' +
		'disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

	const variants: Record<typeof variant, string> = {
		default: 'bg-pill text-white hover:bg-accent',
		secondary: 'bg-accent text-white hover:bg-accent-hover',
		outline: 'bg-surface border-2 border-transparent hover:border-accent hover:bg-accent/5'
	};
</script>

<button {type} {disabled} {onclick} class={`${base} ${variants[variant]} ${className ?? ''}`}>
	{@render children()}
</button>
