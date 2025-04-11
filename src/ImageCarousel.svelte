<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { elasticOut } from 'svelte/easing';
  import gsap from 'gsap';

  export let images: string[] = [];
  let currentIndex: number = 0;
  let interval: ReturnType<typeof setInterval>;
  let carouselElement: HTMLElement;
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
        <img src={image} alt={`AppleBlox Preview ${i + 1}`} loading="lazy" />
      </div>
    {/each}
  </div>
  
  <button class="nav-button prev" on:click={prevSlide} aria-label="Previous slide">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </button>
  
  <button class="nav-button next" on:click={nextSlide} aria-label="Next slide">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
  
  <div bind:this={dotsContainer} class="dots-container">
    {#each images as _, i}
      <button
        class="dot"
        class:active={i === currentIndex}
        on:click={() => updateSlide(i)}
        aria-label={`Go to slide ${i + 1}`}
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
    border-radius: 8px;
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
    padding: 0.5rem;
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
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
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
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 5px;
    z-index: 10;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }

  .dot.active {
    width: 20px;
    background: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 640px) {
    .nav-button {
      width: 32px;
      height: 32px;
    }

    .dots-container {
      bottom: 8px;
    }

    .dot {
      width: 6px;
      height: 6px;
    }
    
    .dot.active {
      width: 16px;
    }
  }
</style>