<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { X, Cpu, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Terminal, Settings, Copy, Check } from "lucide-svelte";
	import { isAppleSilicon } from "../lib/deviceDetection";

	export let show = false;
	export let arm64Url = "";
	export let x64Url = "";
	export let version = "";

	const dispatch = createEventDispatcher();

	type Step = "arch" | "check" | "fix-verify" | "fix-quarantine" | "done";
	let step: Step = "arch";
	let copied = false;

	const HELPER_CMD = "curl -fsSL https://appleblox.com/helper | bash";

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") closeModal();
	}

	function closeModal() {
		dispatch("close");
		setTimeout(() => { step = "arch"; copied = false; }, 300);
	}

	function downloadVersion(url: string) {
		window.location.href = url;
		step = "check";
	}

	function goBack() {
		if (step === "check") step = "arch";
		else if (step === "fix-verify" || step === "fix-quarantine") step = "check";
		else if (step === "done") step = "check";
	}

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(HELPER_CMD);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		} catch {}
	}

	$: if (show && typeof document !== "undefined") {
		document.body.style.overflow = "hidden";
	} else if (typeof document !== "undefined") {
		document.body.style.overflow = "";
	}

	let isAS = false;
	onMount(() => {
		if (/Mac/.test(navigator.userAgent)) {
			isAS = isAppleSilicon();
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center" transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div class="absolute inset-0 bg-black/70 backdrop-blur-sm" on:click={closeModal}></div>

		<div class="modal-content relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl" transition:fly={{ y: 20, duration: 200 }}>
			<button class="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors" on:click={closeModal}>
				<X size={18} />
			</button>

			{#if step === "arch"}
				<div class="mb-6">
					<h3 class="text-xl font-semibold text-white mb-2">Download AppleBlox {version}</h3>
					<p class="text-neutral-400 text-sm">Choose the version that matches your Mac's processor:</p>
				</div>

				<div class="space-y-4">
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
								<p class="text-neutral-400 text-xs">For M1/M2/M3/M4 Macs (2020 or newer)</p>
							</div>
						</div>
						<ArrowRight size={16} class="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
					</button>

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

			{:else if step === "check"}
				<div class="mb-6">
					<h3 class="text-xl font-semibold text-white mb-2">Install & Open</h3>
					<p class="text-neutral-400 text-sm">Open the downloaded <code class="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">.pkg</code> file and follow the installer. Once installed, try opening AppleBlox.</p>
				</div>

				<div class="mb-5 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
					<div class="flex items-start gap-3">
						<AlertTriangle size={20} class="text-amber-400 mt-0.5 shrink-0" />
						<div>
							<p class="text-sm text-neutral-300">Since AppleBlox isn't notarized by Apple, macOS may show a security warning when you first open it. This is normal.</p>
						</div>
					</div>
				</div>

				<p class="text-neutral-400 text-sm mb-4">Did you get an error when opening AppleBlox?</p>

				<div class="space-y-3">
					<button
						class="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-left group"
						on:click={() => { step = "fix-verify"; }}
					>
						<div class="flex items-center">
							<div class="rounded-full bg-amber-500/10 p-2 mr-3">
								<AlertTriangle size={18} class="text-amber-400" />
							</div>
							<div>
								<h4 class="font-medium text-white text-sm">"macOS cannot verify the developer"</h4>
							</div>
						</div>
						<ArrowRight size={16} class="text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
					</button>

					<button
						class="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-left group"
						on:click={() => { step = "fix-quarantine"; }}
					>
						<div class="flex items-center">
							<div class="rounded-full bg-red-500/10 p-2 mr-3">
								<AlertTriangle size={18} class="text-red-400" />
							</div>
							<div>
								<h4 class="font-medium text-white text-sm">"AppleBlox is damaged" or won't open at all</h4>
							</div>
						</div>
						<ArrowRight size={16} class="text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
					</button>

					<button
						class="w-full flex items-center justify-between p-3 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors text-left group"
						on:click={() => { step = "done"; }}
					>
						<div class="flex items-center">
							<div class="rounded-full bg-green-500/10 p-2 mr-3">
								<CheckCircle size={18} class="text-green-400" />
							</div>
							<div>
								<h4 class="font-medium text-white text-sm">It opened fine!</h4>
							</div>
						</div>
						<ArrowRight size={16} class="text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
					</button>
				</div>

				<button class="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors" on:click={goBack}>
					<ArrowLeft size={14} />
					Back to download
				</button>

			{:else if step === "fix-verify"}
				<div class="mb-5">
					<h3 class="text-xl font-semibold text-white mb-2">"Cannot verify the developer"</h3>
					<p class="text-neutral-400 text-sm">This happens because we haven't paid Apple's $99/year notarization fee. Here's how to allow it:</p>
				</div>

				<ol class="space-y-3 mb-5">
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">1</span>
						<p class="text-sm text-neutral-300">Open <strong class="text-white">System Settings</strong> (click the Apple menu at the top left)</p>
					</li>
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">2</span>
						<p class="text-sm text-neutral-300">Go to <strong class="text-white">Privacy & Security</strong></p>
					</li>
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">3</span>
						<p class="text-sm text-neutral-300">Scroll to the <strong class="text-white">Security</strong> section — you'll see a message about AppleBlox being blocked</p>
					</li>
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">4</span>
						<p class="text-sm text-neutral-300">Click <strong class="text-white">Open Anyway</strong>, then confirm</p>
					</li>
				</ol>

				<div class="p-3 rounded-lg border border-neutral-800 bg-neutral-800/30 mb-4">
					<p class="text-xs text-neutral-500"><strong class="text-neutral-400">Note:</strong> The "Open Anyway" button only appears for about an hour after the blocked launch attempt. If you don't see it, try opening AppleBlox again first.</p>
				</div>

				<div class="flex items-center gap-2">
					<button class="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors" on:click={goBack}>
						<ArrowLeft size={14} />
						Back
					</button>
					<button
						class="ml-auto flex items-center gap-2 bg-primary hover:bg-primary/80 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
						on:click={() => { step = "done"; }}
					>
						Done
						<CheckCircle size={16} />
					</button>
				</div>

			{:else if step === "fix-quarantine"}
				<div class="mb-5">
					<h3 class="text-xl font-semibold text-white mb-2">"App is damaged" or won't open</h3>
					<p class="text-neutral-400 text-sm">This is caused by macOS Gatekeeper quarantining the app. You can fix it with a single Terminal command:</p>
				</div>

				<ol class="space-y-3 mb-5">
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">1</span>
						<p class="text-sm text-neutral-300">Press <kbd class="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-neutral-200 font-mono">&#8984; Space</kbd> to open Spotlight, type <strong class="text-white">Terminal</strong>, and press Enter</p>
					</li>
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">2</span>
						<div class="flex-1 min-w-0">
							<p class="text-sm text-neutral-300 mb-2">Copy and paste this command:</p>
							<div class="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
								<code class="flex-1 px-3 py-2.5 text-xs text-green-400 font-mono overflow-x-auto whitespace-nowrap">{HELPER_CMD}</code>
								<button
									class="shrink-0 px-3 py-2.5 border-l border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
									on:click={copyCommand}
									title="Copy command"
								>
									{#if copied}
										<Check size={14} class="text-green-400" />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
						</div>
					</li>
					<li class="flex gap-3">
						<span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">3</span>
						<p class="text-sm text-neutral-300">Press <kbd class="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-neutral-200 font-mono">Enter</kbd> — AppleBlox will launch automatically after the fix</p>
					</li>
				</ol>

				<div class="p-3 rounded-lg border border-neutral-800 bg-neutral-800/30 mb-4">
					<p class="text-xs text-neutral-500"><strong class="text-neutral-400">Alternatively:</strong> Right-click on AppleBlox in your Applications folder and select "Open" from the context menu.</p>
				</div>

				<div class="flex items-center gap-2">
					<button class="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors" on:click={goBack}>
						<ArrowLeft size={14} />
						Back
					</button>
					<button
						class="ml-auto flex items-center gap-2 bg-primary hover:bg-primary/80 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
						on:click={() => { step = "done"; }}
					>
						Done
						<CheckCircle size={16} />
					</button>
				</div>

			{:else if step === "done"}
				<div class="text-center py-4">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
						<CheckCircle size={32} class="text-green-400" />
					</div>
					<h3 class="text-xl font-semibold text-white mb-2">You're all set!</h3>
					<p class="text-neutral-400 text-sm mb-6">AppleBlox is ready to use. Check out the documentation if you need help getting started.</p>

					<div class="flex flex-col gap-3">
						<a
							href="https://docs.appleblox.com"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg border border-neutral-700/50 transition-colors"
						>
							Open Documentation
							<ArrowRight size={16} />
						</a>
						<button
							class="w-full flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-300 text-sm py-2 transition-colors"
							on:click={closeModal}
						>
							Close
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
