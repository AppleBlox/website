<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { elasticOut } from 'svelte/easing';
  import gsap from 'gsap';

  export let images: string[] = [];
  let currentIndex: number = 0;
  let carouselElement: HTMLElement;
  let interval: ReturnType<typeof setInterval>;
  let dotsContainer: HTMLElement;

  const offset = tweened<number>(0, {
    duration: 200,
    easing: elasticOut
  });

  $: offset.set(-currentIndex * 100);

  function updateSlide(newIndex: number): void {
    currentIndex = (newIndex + images.length) % images.length;
    offset.set(-currentIndex * 100);
    resetInterval();
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer?.children;
    if (dots) {
      gsap.to(dots, {
        scale: 0.8,
        opacity: 0.5,
        duration: 0.3
      });
      gsap.to(dots[currentIndex], {
        scale: 1,
        opacity: 1,
        duration: 0.3
      });
    }
  }

  function nextSlide(): void {
    updateSlide(currentIndex + 1);
  }

  function prevSlide(): void {
    updateSlide(currentIndex - 1);
  }

  function resetInterval(): void {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  onMount((): () => void => {
    interval = setInterval(nextSlide, 5000);
    updateDots();
    
    // Animate navigation buttons on hover
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        gsap.to(e.currentTarget, {
          scale: 1.1,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          duration: 0.3
        });
      });
      button.addEventListener('mouseleave', (e) => {
        gsap.to(e.currentTarget, {
          scale: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          duration: 0.3
        });
      });
    });

    return (): void => clearInterval(interval);
  });

  afterUpdate((): void => {
    if (carouselElement) {
      carouselElement.style.transform = `translateX(${$offset}%)`;
    }
  });
</script>

<div class="carousel-container">
  <div bind:this={carouselElement} class="carousel">
    {#each images as image, i}
      <div class="slide" class:active={i === currentIndex}>
        <img src={image} alt={`AppleBlox Preview ${i + 1}`} />
      </div>
    {/each}
  </div>
  <div bind:this={dotsContainer} class="dots-container">
    {#each images as _, i}
      <button
        class="dot"
        class:active={i === currentIndex}
        on:click={() => updateSlide(i)}
      />
    {/each}
  </div>
</div>

<style>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
  }

  .carousel {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide {
    flex: 0 0 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transition: opacity 0.5s ease-out;
    padding: 1rem;
  }

  .slide.active {
    opacity: 1;
  }

  .slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: none;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    backdrop-filter: blur(4px);
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }

  .dots-container {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 3;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dot.active {
    width: 24px;
    background: rgba(255, 255, 255, 0.9);
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 25%;
    z-index: 2;
    pointer-events: none;
  }
</style>