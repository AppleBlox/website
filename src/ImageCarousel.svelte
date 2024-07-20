<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let images: string[] = [];
  let currentIndex: number = 0;
  let carouselElement: HTMLElement;
  let interval: ReturnType<typeof setInterval>;

  const offset = tweened<number>(0, {
    duration: 1000,
    easing: cubicOut
  });

  $: offset.set(-currentIndex * 100);

  function updateSlide(newIndex: number): void {
    currentIndex = (newIndex + images.length) % images.length;
    offset.set(-currentIndex * 100);
    resetInterval();
  }

  function nextSlide(): void {
    updateSlide(currentIndex + 1);
  }

  function prevSlide(): void {
    updateSlide(currentIndex - 1);
  }

  function resetInterval(): void {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000); // Change image every 5 seconds
  }

  onMount((): () => void => {
    interval = setInterval(nextSlide, 5000); // Change image every 5 seconds
    return (): void => clearInterval(interval);
  });

  afterUpdate((): void => {
    if (carouselElement) {
      carouselElement.style.transform = `translateX(${$offset}%)`;
    }
  });
</script>

<div class="carousel-container">
  <div class="gradient-overlay left"></div>
  <div class="gradient-overlay right"></div>
  <div bind:this={carouselElement} class="carousel">
    {#each images as image, i}
      <div class="slide" class:active={i === currentIndex}>
        <img src={image} alt={`AppleBlox Preview ${i + 1}`} />
      </div>
    {/each}
  </div>
  <button class="nav-button prev" on:click={prevSlide}>
    <ChevronLeft size={24} />
  </button>
  <button class="nav-button next" on:click={nextSlide}>
    <ChevronRight size={24} />
  </button>
</div>

<style>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .carousel {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-out;
  }

  .slide {
    flex: 0 0 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transition: opacity 0.5s ease-out;
  }

  .slide.active {
    opacity: 1;
  }

  .slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    z-index: 3;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }
</style>
