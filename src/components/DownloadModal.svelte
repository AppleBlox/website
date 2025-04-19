<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { X, Cpu, ArrowRight } from "lucide-svelte";
	import { isAppleSilicon } from "../lib/deviceDetection";

	export let show = false;
	export let arm64Url = "";
	export let x64Url = "";
	export let version = "";

	const dispatch = createEventDispatcher();

	// Close modal if ESC key is pressed
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			closeModal();
		}
	}

	function closeModal() {
		dispatch("close");
	}

	function downloadVersion(url: string) {
		window.location.href = url;
		closeModal();
	}

	// Prevent scrolling when modal is open
	$: if (show && typeof document !== "undefined") {
		document.body.style.overflow = "hidden";
	} else if (typeof document !== "undefined") {
		document.body.style.overflow = "";
	}

	// Auto-detect Apple Silicon
	let isAS = false;

	onMount(() => {
		// Check if running on macOS and detect CPU architecture
		const userAgent = navigator.userAgent;
		const isMac = /Mac/.test(userAgent);

		if (isMac) {
			// Check for "arm64" in the user agent
			isAS = isAppleSilicon();
			console.log(`Is Apple Sillicion: ${isAS}`);
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center" transition:fade={{ duration: 200 }}>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/70 backdrop-blur-sm" on:click={closeModal}></div>

		<!-- Modal -->
		<div class="modal-content relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl" transition:fly={{ y: 20, duration: 200 }}>
			<button class="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors" on:click={closeModal}>
				<X size={18} />
			</button>

			<div class="mb-6">
				<h3 class="text-xl font-semibold text-white mb-2">Download AppleBlox {version}</h3>
				<p class="text-neutral-400 text-sm">Choose the version that matches your Mac's processor:</p>
			</div>

			<div class="space-y-4">
				<!-- Apple Silicon / ARM64 option -->
				<button
					class="w-full flex items-center justify-between p-4 rounded-lg border
                   {isAS ? 'border-primary/50 bg-primary/5' : 'border-neutral-800 bg-neutral-800/50'} 
                   hover:bg-neutral-800 transition-colors text-left group"
					on:click={() => downloadVersion(arm64Url)}
				>
					<div class="flex items-center">
						<div class="rounded-full bg-primary/10 p-2 mr-3">
							<Cpu size={20} class="text-primary" />
						</div>
						<div>
							<h4 class="font-medium text-white">Apple Silicon (ARM64)</h4>
							<p class="text-neutral-400 text-xs">For M1/M2/M3 Macs (2020 or newer)</p>
						</div>
					</div>
					<ArrowRight size={16} class="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
				</button>

				<!-- Intel / x64 option -->
				<button
					class="w-full flex items-center justify-between p-4 rounded-lg border
                   {!isAS ? 'border-primary/50 bg-primary/5' : 'border-neutral-800 bg-neutral-800/50'} 
                   hover:bg-neutral-800 transition-colors text-left group"
					on:click={() => downloadVersion(x64Url)}
				>
					<div class="flex items-center">
						<div class="rounded-full bg-primary/10 p-2 mr-3">
							<Cpu size={20} class="text-primary" />
						</div>
						<div>
							<h4 class="font-medium text-white">Intel (x64)</h4>
							<p class="text-neutral-400 text-xs">For Intel Macs (pre-2020)</p>
						</div>
					</div>
					<ArrowRight size={16} class="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
				</button>

				<div class="mt-4 text-xs text-neutral-500">
					<p>Not sure which to choose? We've automatically highlighted the recommended version for your Mac.</p>
				</div>
			</div>
		</div>
	</div>
{/if}
