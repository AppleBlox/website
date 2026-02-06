<script lang="ts">
	import { onMount } from "svelte";
	import { Github, Download, Globe, Wrench, Joystick, DownloadCloud, Star, MessageCircle, BookOpen } from "lucide-svelte";
	import ImageCarousel from "./ImageCarousel.svelte";
	import DownloadModal from "./components/DownloadModal.svelte";
	import { isActualMobileDevice } from "./lib/deviceDetection";

	import Image1 from "./assets/carousel/src1.webp";
	import Image2 from "./assets/carousel/src2.webp";
	import Image3 from "./assets/carousel/src3.webp";
	import Image4 from "./assets/carousel/src4.webp";
	import Image5 from "./assets/carousel/src5.webp";

	// Types
	type Release = {
		version: string;
		arm64: string;
		x64: string;
	};

	type Feature = {
		icon: any;
		title: string;
		description: string;
	};

	// State
	let version: string | null = null;
	let releases: Release[] = [];
	let downloadCount = 0;
	let starCount = 0;
	let showDownloadModal = false;
	let isMobile = false;

	// Constants
	const downloadLink = "https://github.com/AppleBlox/appleblox/releases/latest";
	const carouselImages = [Image1, Image2, Image3, Image4, Image5];

	const features: Feature[] = [
		{
			icon: Globe,
			title: "Account Features",
			description: "Choose which regions to play in to get a more reliable connection and access your recent games directly in the app.",
		},
		{
			icon: Wrench,
			title: "Integrations",
			description: "Be notified of your game server region, share your activity on Discord, track which games you have been playing and rejoin your last played game server.",
		},
		{
			icon: Joystick,
			title: "Customization",
			description: "Customize your experience using community-created Roblox mods and app themes. Fast Flags are also supported.",
		},
	];

	// Lifecycle
	onMount(() => {
		fetchGitHubStats();
		document.addEventListener("click", handleClickOutside);

        isActualMobileDevice.subscribe(value => {
            isMobile = value;
        });

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	// Computed values
	$: downloadButtonText = isMobile
		? "Desktop Only"
		: `Download ${version ? `v${version}` : "latest version"}`;

	// Event Handlers
	function openDownloadModal() {
		if (!isMobile) {
			showDownloadModal = true;
		}
	}

	function closeDownloadModal() {
		showDownloadModal = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (showDownloadModal && !target.closest(".modal-content") && !target.closest(".download-btn")) {
			showDownloadModal = false;
		}
	}

	// API Functions
	async function fetchAllReleases(): Promise<any[]> {
		const allReleases: any[] = [];
		let url: string | null = "https://api.github.com/repos/AppleBlox/appleblox/releases?per_page=100";

		while (url) {
			const res = await fetch(url);
			const data = await res.json();
			allReleases.push(...data);

			// Parse Link header for next page
			const link = res.headers.get("Link");
			const next = link?.match(/<([^>]+)>;\s*rel="next"/);
			url = next ? next[1] : null;
		}

		return allReleases;
	}

	async function fetchGitHubStats() {
		try {
			const [repoData, releasesData] = await Promise.all([
				fetch("https://api.github.com/repos/AppleBlox/appleblox").then((res) => res.json()),
				fetchAllReleases(),
			]);

			starCount = repoData.stargazers_count;
			version = releasesData[0]?.tag_name || null;

			releases = releasesData.map((release: any) => ({
				version: release.tag_name,
				arm64: release.assets.find((asset: any) => asset.name.includes("arm64"))?.browser_download_url || downloadLink,
				x64: release.assets.find((asset: any) => asset.name.includes("x64"))?.browser_download_url || downloadLink,
			}));

			downloadCount = releasesData.reduce((acc: number, release: any) => {
				return acc + release.assets.reduce((count: number, asset: any) => count + asset.download_count, 0);
			}, 0);
		} catch (err) {
			console.error("Failed to fetch GitHub data:", err);
		}
	}

</script>

<main class="min-h-[100dvh] w-full flex items-center justify-center bg-dark overflow-x-hidden">
	<div class="container mx-auto px-6 py-8 relative z-10">
		<!-- Hero Section -->
		<section class="hero-section mb-12">
			<div class="flex flex-col md:flex-row items-center justify-between md:gap-12">
				<div class="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
					<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"><span class="text-primary">AppleBlox</span></h1>
					<p class="text-base sm:text-lg md:text-xl mb-6 text-neutral-300 max-w-xl leading-relaxed mx-auto md:mx-0">
						Experience Roblox like never before on your Mac. AppleBlox is a lightweight, secure, and blazing-fast Roblox launcher designed specifically for MacOS.
					</p>
					<div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
						<button
							on:click={openDownloadModal}
							class="download-btn w-full sm:w-auto flex items-center justify-center {isMobile
                                ? 'bg-neutral-700 opacity-75 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark'} text-white font-semibold py-3 px-6 rounded-lg transition-all"
                            disabled={isMobile}
						>
							<Download class="mr-2" size={20} />
							<span class="whitespace-nowrap">{downloadButtonText}</span>
						</button>
						<a
							href="https://github.com/AppleBlox/appleblox"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full sm:w-auto flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg border border-neutral-700/50 transition-colors"
						>
							<Github class="mr-2" size={20} />
							GitHub
						</a>
						<a
							href="https://docs.appleblox.com"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full sm:w-auto flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg border border-neutral-700/50 transition-colors"
						>
							<BookOpen class="mr-2" size={20} />
							Docs
						</a>
					</div>
					<div class="flex flex-wrap justify-center md:justify-start gap-5 mt-6 text-neutral-400 text-sm">
						<div class="flex items-center space-x-2">
							<DownloadCloud size={16} />
							<span>{downloadCount.toLocaleString()} Downloads</span>
						</div>
						<div class="flex items-center space-x-2">
							<Star size={16} />
							<span>{starCount.toLocaleString()} Stars</span>
						</div>
						<div class="flex items-center space-x-2">
							<MessageCircle size={16} />
							<a href="/discord.html" class="hover:text-white transition-colors">Join community</a>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 flex justify-center md:justify-end">
					<div class="w-full max-w-xl h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden rounded-lg shadow-lg">
						<ImageCarousel images={carouselImages} />
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="features-section mb-14">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each features as feature}
					<div class="feature-card rounded-lg bg-gradient-to-b from-neutral-800/40 to-neutral-900/40 border border-neutral-800/50 overflow-hidden hover:border-neutral-700/70 hover:-translate-y-0.5 transition-all duration-200">
						<div class="p-6">
							<div class="flex items-center mb-4">
								<div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-3">
									<svelte:component this={feature.icon} size={20} class="text-primary" />
								</div>
								<h3 class="text-xl font-semibold text-white">{feature.title}</h3>
							</div>
							<p class="text-neutral-300 leading-relaxed">{feature.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>

<!-- Download Modal -->
{#if releases.length > 0}
	<DownloadModal
		show={showDownloadModal}
		arm64Url={releases[0]?.arm64 || downloadLink}
		x64Url={releases[0]?.x64 || downloadLink}
		version={version || 'latest'}
		on:close={closeDownloadModal}
	/>
{/if}

<style>
	.bg-dark {
		background: linear-gradient(to bottom, #0a0a0a, #000000);
		position: relative;
	}

	.bg-dark::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100%;
		background: radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.08) 0%, transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	:root {
		--color-primary: #f43f5e;
		--color-primary-dark: #e11d48;
	}

	.text-primary {
		color: var(--color-primary);
	}

	.bg-primary {
		background-color: var(--color-primary);
	}

	.hover\:bg-primary-dark:hover {
		background-color: var(--color-primary-dark);
	}

	/* Global styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		background-color: #000000;
		color: #ffffff;
		overflow-x: hidden;
		min-height: 100dvh;
	}

	:global(html) {
		min-height: 100dvh;
		overflow-x: hidden;
	}

	@media (max-height: 800px) {
		.container {
			padding-top: 1rem;
			padding-bottom: 1rem;
		}
	}
</style>
