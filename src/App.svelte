<script lang="ts">
	import { onMount } from "svelte";
	import { Github, Download, Zap, Wrench, Joystick, ChevronDown, DownloadCloud, Star } from "lucide-svelte";
	import ImageCarousel from "./ImageCarousel.svelte";

	import Image1 from "./assets/carousel/src1.png";
	import Image2 from "./assets/carousel/src2.png";
	import Image3 from "./assets/carousel/src3.png";
	import Image4 from "./assets/carousel/src4.png";
	import Image5 from "./assets/carousel/src5.png";

	let version: string = "latest version";
	let downloadLink = "https://github.com/OrigamingWasTaken/appleblox/releases/latest";
	let isDropdownOpen = false;
	let isMobile = false;
	let releases: { version: string; arm64: string; x64: string }[] = [];
	let downloadCount: number = 0;
	let starCount: number = 0;

	// Define an array of image URLs for the carousel
	const carouselImages = [Image1, Image2, Image3, Image4, Image5];

	onMount(() => {
		animateBackground();
		checkMobile();
		fetchGitHubStats();
		window.addEventListener("resize", checkMobile);
		document.addEventListener("click", handleClickOutside);

		return () => {
			window.removeEventListener("resize", checkMobile);
			document.removeEventListener("click", handleClickOutside);
		};
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768; // Adjust this breakpoint as needed
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		if (!isMobile) {
			isDropdownOpen = !isDropdownOpen;
		}
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		// @ts-expect-error
		if (isDropdownOpen && !event.target.closest(".dropdown") && !event.target.closest(".download-btn")) {
			closeDropdown();
		}
	}

	function handleDownloadClick(url: string) {
		window.location.href = url;
		closeDropdown();
	}

	function fetchGitHubStats() {
		fetch("https://api.github.com/repos/OrigamingWasTaken/appleblox")
			.then((res) => res.json())
			.then((data) => {
				starCount = data.stargazers_count;
			})
			.catch((err) => {
				console.error("Failed to fetch repository data:", err);
			});

		fetch("https://api.github.com/repos/OrigamingWasTaken/appleblox/releases")
			.then((res) => res.json())
			.then((res) => {
				version = res[0].tag_name;
				releases = res.map((release: any) => ({
					version: release.tag_name,
					arm64: release.assets.find((asset: any) => asset.name.includes("arm64"))?.browser_download_url || downloadLink,
					x64: release.assets.find((asset: any) => asset.name.includes("x64"))?.browser_download_url || downloadLink,
				}));

				// Sum up the download counts from all releases
				downloadCount = res.reduce((acc: number, release: any) => {
					return acc + release.assets.reduce((count: number, asset: any) => count + asset.download_count, 0);
				}, 0);
			})
			.catch((err) => {
				console.error("Failed to fetch releases:", err);
			});
	}

	let features = [
		{
			icon: Zap,
			title: "Fast & lightweight",
			description:
				"Being built NeutralinoJS and rapidity in mind, AppleBlox takes at most 50mb of ram. You can also use different presets or import your own FastFlags to optimize and tweak your game.",
		},
		{
			icon: Wrench,
			title: "Integrations",
			description: "Set your Discord RPC to your current playing game, let games control your Window, AppleBlox let's you do more than what is possible with stock Roblox.",
		},
		{
			icon: Joystick,
			title: "Mods",
			description: "Add mods to your game to customize your textures, UI, and more... (Coming Soon)",
		},
	];

	function animateBackground() {
		const bg = document.querySelector(".animated-bg") as HTMLElement;
		let x = 0;
		let y = 0;

		setInterval(() => {
			x = (x + 1) % 100;
			y = (y + 1) % 100;
			if (bg) bg.style.backgroundPosition = `${x}% ${y}%`;
		}, 50);
	}
</script>

<main class="min-h-screen w-full flex items-center justify-center animated-bg">
	<div class="container mx-auto px-4 py-12 relative z-10">
		<div class="flex flex-col md:flex-row items-center justify-between">
			<div class="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
				<h1 class="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg animate-pulse">AppleBlox</h1>
				<p class="text-xl mb-8 text-rose-100 max-w-xl">
					Experience Roblox like never before on your Mac. AppleBlox is a lightweight, secure, and blazing-fast Roblox launcher designed specifically for MacOS.
				</p>
				<div class="space-x-4 relative">
					<button
						on:click={toggleDropdown}
						class="download-btn inline-flex items-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isMobile}
					>
						<Download class="mr-2" size={20} />
						Download v{version}
						<ChevronDown class="ml-2" size={20} />
					</button>
					{#if isDropdownOpen && releases.length > 0}
						<div class="dropdown absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-rose-700 ring-1 ring-black ring-opacity-5 animate-unroll" style="z-index: 9999;">
							<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
								<a on:click={() => handleDownloadClick(releases[0].arm64)} class="block px-4 py-2 text-sm text-white hover:bg-rose-600 cursor-pointer" role="menuitem">Download ARM64</a
								>
								<a on:click={() => handleDownloadClick(releases[0].x64)} class="block px-4 py-2 text-sm text-white hover:bg-rose-600 cursor-pointer" role="menuitem">Download x64</a>
							</div>
						</div>
					{/if}
					<a
						href="https://github.com/OrigamingWasTaken/appleblox"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
					>
						<Github class="mr-2" size={20} />
						View on GitHub
					</a>
				</div>
				<div class="flex mt-4 space-x-4 text-white">
					<div class="flex items-center space-x-2">
						<DownloadCloud size={20} />
						<span>{downloadCount} Downloads</span>
					</div>
					<div class="flex items-center space-x-2">
						<Star size={20} />
						<span>{starCount} Stars</span>
					</div>
				</div>
			</div>
			<div class="md:w-1/2 flex justify-center md:justify-end">
        <div class="w-full max-w-2xl h-[400px] overflow-hidden rounded-lg">
          <ImageCarousel images={carouselImages} />
        </div>
      </div>
		</div>

		<div class="mt-16">
			<h2 class="text-3xl font-bold mb-8 text-white text-center">Key Features</h2>
			<div class="grid md:grid-cols-3 gap-8">
				{#each features as feature}
					<div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:rotate-1">
						<svelte:component this={feature.icon} size={40} class="text-white mb-4 mx-auto" />
						<h3 class="text-xl font-semibold mb-2 text-rose-200">{feature.title}</h3>
						<p class="text-rose-100">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	.animated-bg {
		background: linear-gradient(45deg, #e11d48, #ff5353, #ef4444, #f87171);
		background-size: 400% 400%;
		animation: gradientBG 15s ease infinite;
	}

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.dropdown {
		z-index: 9999;
		opacity: 0;
		transform: scaleY(0);
		transform-origin: top;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	.dropdown.open {
		opacity: 1;
		transform: scaleY(1);
	}

	.animate-unroll {
		animation: unroll 0.3s ease forwards;
	}

	@keyframes unroll {
		from {
			opacity: 0;
			transform: scaleY(0);
		}
		to {
			opacity: 1;
			transform: scaleY(1);
		}
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: "Inter", sans-serif;
	}
</style>
