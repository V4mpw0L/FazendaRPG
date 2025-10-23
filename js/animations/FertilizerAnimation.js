/**
 * FazendaRPG - Fertilizer Animation
 * 3D particle animation system for fertilizer application
 * @version 0.0.13
 */

export default class FertilizerAnimation {
  constructor() {
    this.activeAnimations = new Set();
  }

  /**
   * Create and animate fertilizer particles on a plot
   * @param {HTMLElement} plotElement - The plot element to animate
   */
  animate(plotElement) {
    if (!plotElement) return;

    // Get plot position
    const rect = plotElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create SVG container
    const svg = this.createSVGContainer();
    document.body.appendChild(svg);

    // Create particles
    const particleCount = 25;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(
        svg,
        centerX,
        centerY,
        i,
        particleCount,
      );
      particles.push(particle);
    }

    // Create animation context
    const animationContext = {
      svg,
      particles,
      animationFrameId: null,
      isComplete: false,
    };

    // Add to active animations
    this.activeAnimations.add(animationContext);

    // Animate particles
    this.animateParticles(animationContext);
  }

  /**
   * Create SVG container
   * @returns {SVGElement} SVG container
   */
  createSVGContainer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "fertilizer-animation");
    svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `;
    return svg;
  }

  /**
   * Create a particle with 3D effect
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} index - Particle index
   * @param {number} total - Total particles
   * @returns {Object} Particle data
   */
  createParticle(svg, centerX, centerY, index, total) {
    // Random angle for circular distribution
    const angle = (index / total) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 50 + Math.random() * 30;

    // 3D effect - some particles go "forward" (larger), some "backward" (smaller)
    const depth = Math.random();
    const scale = 0.5 + depth * 1.5;

    // Starting position (above and behind in 3D space)
    const startX = centerX + Math.cos(angle) * 20 * (1 - depth);
    const startY = centerY - 80 - depth * 40;

    // Ending position (spread out on the ground)
    const endX = centerX + Math.cos(angle) * distance * scale;
    const endY = centerY + 20 + Math.random() * 15;

    // Particle size based on depth
    const size = (3 + Math.random() * 4) * scale;

    // Create particle group for 3D rotation
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Create particle circle (fertilizer pellet)
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", startX);
    circle.setAttribute("cy", startY);
    circle.setAttribute("r", size);

    // Brown color with slight variation
    const brownShade = 40 + Math.random() * 30;
    circle.setAttribute(
      "fill",
      `rgb(${brownShade + 40}, ${brownShade + 20}, ${brownShade})`,
    );
    circle.setAttribute("opacity", "0");

    // Add glow effect for depth
    const filterId = `glow-${index}-${Date.now()}`;
    const defs =
      svg.querySelector("defs") ||
      svg.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "defs"),
      );

    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter",
    );
    filter.setAttribute("id", filterId);

    const blur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur",
    );
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", depth * 2);

    filter.appendChild(blur);
    defs.appendChild(filter);

    if (depth > 0.6) {
      circle.setAttribute("filter", `url(#${filterId})`);
    }

    g.appendChild(circle);
    svg.appendChild(g);

    return {
      element: circle,
      group: g,
      startX,
      startY,
      endX,
      endY,
      size,
      depth,
      angle,
      progress: 0,
      duration: 800 + Math.random() * 400,
      delay: index * 15,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
    };
  }

  /**
   * Animate all particles
   * @param {Object} animationContext - Animation context object
   */
  animateParticles(animationContext) {
    const startTime = Date.now();

    const animate = () => {
      // Check if animation was cancelled
      if (animationContext.isComplete) {
        return;
      }

      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      let allComplete = true;

      animationContext.particles.forEach((particle) => {
        const particleElapsed = elapsed - particle.delay;

        if (particleElapsed < 0) {
          allComplete = false;
          return;
        }

        if (particleElapsed >= particle.duration) {
          // Particle animation complete
          particle.element.setAttribute("opacity", "0");
          return;
        }

        allComplete = false;

        // Calculate progress with easing
        let progress = particleElapsed / particle.duration;

        // Ease out cubic for natural fall
        const eased = 1 - Math.pow(1 - progress, 3);

        // Fade in quickly, fade out at the end
        let opacity = 1;
        if (progress < 0.1) {
          opacity = progress / 0.1;
        } else if (progress > 0.8) {
          opacity = 1 - (progress - 0.8) / 0.2;
        }

        // Calculate position with arc (parabolic trajectory)
        const x = particle.startX + (particle.endX - particle.startX) * eased;

        // Y with gravity simulation (faster fall)
        const gravity = Math.pow(eased, 1.5);
        const y = particle.startY + (particle.endY - particle.startY) * gravity;

        // 3D rotation effect
        const rotation = particle.rotation + particle.rotationSpeed * eased;

        // Scale effect - particles get slightly larger as they get closer
        const scale = 0.8 + particle.depth * 0.4 * eased;

        // Apply transformations
        particle.element.setAttribute("cx", x);
        particle.element.setAttribute("cy", y);
        particle.element.setAttribute("opacity", opacity * 0.9);
        particle.element.setAttribute("r", particle.size * scale);

        // 3D perspective transform
        particle.group.setAttribute(
          "transform",
          `rotate(${rotation} ${x} ${y})`,
        );
      });

      if (!allComplete) {
        animationContext.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete - cleanup
        this.cleanup(animationContext);
      }
    };

    animate();
  }

  /**
   * Clean up animation
   * @param {Object} animationContext - Animation context to remove
   */
  cleanup(animationContext) {
    // Mark as complete
    animationContext.isComplete = true;

    // Cancel animation frame
    if (animationContext.animationFrameId) {
      cancelAnimationFrame(animationContext.animationFrameId);
      animationContext.animationFrameId = null;
    }

    // Remove from active animations
    this.activeAnimations.delete(animationContext);

    // Remove SVG from DOM
    setTimeout(() => {
      if (animationContext.svg && animationContext.svg.parentNode) {
        animationContext.svg.parentNode.removeChild(animationContext.svg);
      }
    }, 100);
  }

  /**
   * Cancel all ongoing animations
   */
  cancelAll() {
    this.activeAnimations.forEach((animationContext) => {
      this.cleanup(animationContext);
    });
    this.activeAnimations.clear();
  }
}
