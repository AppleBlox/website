<script lang="ts">
	import { onMount } from "svelte";
	import { Github, Download, Zap, Wrench, Joystick, ChevronDown, DownloadCloud, Star, MessageCircle, XCircle } from "lucide-svelte";
	import ImageCarousel from "./ImageCarousel.svelte";
	import gsap from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";

	gsap.registerPlugin(ScrollTrigger);

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

	// Imports
	import Image1 from "./assets/carousel/src1.png";
	import Image2 from "./assets/carousel/src2.png";
	import Image3 from "./assets/carousel/src3.png";
	import Image4 from "./assets/carousel/src4.png";
	import Image5 from "./assets/carousel/src5.png";

	// State
	let version: string | null = null;
	let isDropdownOpen = false;
	let isMobile = false;
	let releases: Release[] = [];
	let downloadCount = 0;
	let starCount = 0;

	// Constants
	const MOBILE_BREAKPOINT = 768;
	const downloadLink = "https://github.com/AppleBlox/appleblox/releases/latest";
	const carouselImages = [Image1, Image2, Image3, Image4, Image5];

	const features: Feature[] = [
		{
			icon: Zap,
			title: "Light & Fast",
			description: "Built with NeutralinoJS, using only ~50mb RAM. Customize performance with FFlags presets or create your own profiles.",
		},
		{
			icon: Wrench,
			title: "Smart Integration",
			description: "See your game server region, share your activity on Discord, and run multiple game instances simultaneously.",
		},
		{
			icon: Joystick,
			title: "Customization",
			description: "Personalize your experience with custom UI mods, game-specific FastFlags, and community-created content.",
		},
	];

	// Lifecycle
	onMount(() => {
		checkMobile();
		fetchGitHubStats();
		initializeAnimations();
		initializeEventListeners();

		return () => removeEventListeners();
	});

	function getDownloadButtonText() {
		if (isMobile) {
			return "Desktop Only";
		}
		return `Download ${version ? `v${version}` : "latest version"}`;
	}

	// Event Listeners
	function initializeEventListeners() {
		window.addEventListener("resize", checkMobile);
		document.addEventListener("click", handleClickOutside);
	}

	function removeEventListeners() {
		window.removeEventListener("resize", checkMobile);
		document.removeEventListener("click", handleClickOutside);
	}

	// Animation Functions
	function initializeAnimations() {
		const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

		timeline
			.from(".hero-content", {
				y: 30,
				opacity: 0,
				duration: 0.8,
			})
			.from(
				".hero-image",
				{
					x: 30,
					opacity: 0,
					duration: 0.8,
				},
				"-=0.6"
			)
			.from(
				".stat-item",
				{
					opacity: 0,
					y: 20,
					duration: 0.5,
					stagger: 0.1,
				},
				"-=0.4"
			)
			.fromTo(
				".feature-card",
				{ opacity: 0, y: 100 },
				{ opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
				"-=0.6"
			);

		// Add scroll trigger animations for feature cards
		gsap.utils.toArray(".feature-card").forEach((card: any) => {
			ScrollTrigger.create({
				trigger: card,
				start: "top bottom-=100",
				toggleClass: "active",
				once: true
			});
		});
	}

	// Utility Functions
	function checkMobile() {
		isMobile = window.innerWidth < MOBILE_BREAKPOINT;
		if (isMobile) {
			closeDropdown();
		}
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		isDropdownOpen = !isDropdownOpen;
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isDropdownOpen && !target.closest(".dropdown") && !target.closest(".download-btn")) {
			closeDropdown();
		}
	}

	function handleDownloadClick(url: string) {
		if (!isMobile) {
			window.location.href = url;
			closeDropdown();
		}
	}

	// API Functions
	async function fetchGitHubStats() {
		try {
			const [repoData, releasesData] = await Promise.all([
				fetch("https://api.github.com/repos/AppleBlox/appleblox").then((res) => res.json()),
				fetch("https://api.github.com/repos/AppleBlox/appleblox/releases").then((res) => res.json()),
			]);

			starCount = repoData.stargazers_count;
			version = releasesData[0].tag_name;

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

<main class="min-h-screen w-full flex items-center justify-center bg-dark">
	<div class="container mx-auto px-4 py-8 md:py-12 relative z-10">
		<div class="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-24">
			<div class="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 hero-content">
				<h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-primary">AppleBlox</h1>
				<p class="text-lg sm:text-xl mb-8 text-neutral-300 max-w-xl mx-auto md:mx-0">
					Experience Roblox like never before on your Mac. AppleBlox is a lightweight, secure, and blazing-fast Roblox launcher designed specifically for MacOS.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
					<div class="relative w-full sm:w-auto">
						<button
							on:click={isMobile ? null : toggleDropdown}
							class="download-btn w-full sm:w-auto inline-flex items-center justify-center {isMobile ? 'bg-neutral-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
						>
							{#if isMobile}
								<XCircle class="mr-2" size={20} />
							{:else}
								<Download class="mr-2" size={20} />
							{/if}
							<span class="whitespace-nowrap">{getDownloadButtonText()}</span>
							{#if !isMobile}
								<ChevronDown class="ml-2" size={20} />
							{/if}
						</button>
						{#if isDropdownOpen && releases.length > 0 && !isMobile}
							<div class="dropdown absolute left-0 mt-1 w-full sm:w-48 bg-neutral-800/95 backdrop-blur-md border border-neutral-700 rounded-lg">
								<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
									<a
										on:click={() => handleDownloadClick(releases[0].arm64)}
										class="block px-4 py-2 text-sm text-white hover:bg-neutral-700 cursor-pointer transition-colors"
										role="menuitem">Download ARM64</a
									>
									<a
										on:click={() => handleDownloadClick(releases[0].x64)}
										class="block px-4 py-2 text-sm text-white hover:bg-neutral-700 cursor-pointer transition-colors"
										role="menuitem">Download x64</a
									>
								</div>
							</div>
						{/if}
					</div>
					<a
						href="https://github.com/AppleBlox/appleblox"
						target="_blank"
						rel="noopener noreferrer"
						class="w-full sm:w-auto inline-flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5 border border-neutral-700"
					>
						<Github class="mr-2" size={20} />
						View on GitHub
					</a>
				</div>
				<div class="flex flex-wrap justify-center md:justify-start gap-4 mt-8 text-neutral-500 stats-section">
					<div class="stat-item flex items-center space-x-2 hover:text-neutral-300 transition-colors">
						<DownloadCloud size={20} />
						<span>{downloadCount} Downloads</span>
					</div>
					<div class="stat-item flex items-center space-x-2 hover:text-neutral-300 transition-colors">
						<Star size={20} />
						<span>{starCount} Stars</span>
					</div>
					<div class="stat-item flex items-center space-x-2 hover:text-neutral-300 transition-colors">
						<MessageCircle size={20} />
						<a href="/discord.html" class="hover:text-white">Join community</a>
					</div>
				</div>
			</div>
			<div class="w-full md:w-1/2 flex justify-center md:justify-end hero-image mt-8 md:mt-0">
				<div class="w-full max-w-2xl h-[300px] sm:h-[400px] overflow-hidden rounded-lg">
					<ImageCarousel images={carouselImages} />
				</div>
			</div>
		</div>

		<div class="mt-12 md:mt-16 features-section px-4 md:px-0">
			<h2 class="text-3xl md:text-4xl font-bold mb-8 md:mb-16 text-primary text-center">Key Features</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
				{#each features as feature}
					<div class="feature-card bg-neutral-800/20 rounded-lg border border-neutral-800/50 p-6 md:p-8 transition-all duration-300 hover:bg-neutral-800/30">
						<div class="feature-content">
							<div class="feature-icon-container bg-neutral-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 md:mb-6">
								<svelte:component this={feature.icon} size={24} class="text-primary" />
							</div>
							<h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">{feature.title}</h3>
							<p class="text-sm md:text-base text-neutral-400 leading-relaxed">{feature.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	.bg-dark {
		background: linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%);
		position: relative;
		min-height: 100vh;
	}

	.bg-dark::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 50% 0%, rgb(244, 63, 94, 0.15) 0%, transparent 70%);
		pointer-events: none;
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

	.feature-card {
		opacity: 0;
		position: relative;
		transform: translateY(30px);
		backdrop-filter: blur(12px);
		transition: all 0.3s ease;
	}

	.feature-card.active {
		opacity: 1;
		transform: translateY(0);
	}

	.dropdown {
		z-index: 9999;
		pointer-events: auto;
		top: calc(100% + 0.5rem);
	}

	.cursor-not-allowed {
		opacity: 0.75;
		pointer-events: none;
	}

	/* Global styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: "Inter", sans-serif;
		background-color: #0f0f0f;
		overflow-x: hidden;
	}

	/* Custom scrollbar */
	:global(body::-webkit-scrollbar) {
		width: 8px;
	}

	:global(body::-webkit-scrollbar-track) {
		background: #0f0f0f;
	}

	:global(body::-webkit-scrollbar-thumb) {
		background: #333;
		border-radius: 6px;
	}

	:global(body::-webkit-scrollbar-thumb:hover) {
		background: #444;
	}

	/* Touch device optimizations */
	@media (hover: none) {
		.feature-card:hover {
			transform: none;
		}
		
		a:hover, button:hover {
			transform: none !important;
		}
	}

	/* Responsive adjustments for smaller screens */
	@media (max-width: 640px) {
		.dropdown {
			left: 50%;
			transform: translateX(-50%);
			width: 90%;
			max-width: 300px;
		}

		.feature-card {
			transform: none;
		}

		.hero-image {
			margin-top: 2rem;
		}
	}

	/* Mobile button state */
	.bg-neutral-600.cursor-not-allowed:hover {
		transform: none !important;
		background-color: rgb(82, 82, 91) !important;
	}

	/* Ensure dropdown doesn't overflow on mobile */
	@media (max-width: 768px) {
		.container {
			overflow-x: hidden;
		}
		
		.dropdown {
			max-height: 80vh;
			overflow-y: auto;
		}
	}
</style>