/**
 * FazendaRPG - Plant Animation
 * 3D seed planting animation system for planting crops
 * @version 0.0.16
 */

export default class PlantAnimation {
  constructor() {
    this.activeAnimations = new Set();
  }

  /**
   * Create and animate seed planting on a plot
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

    // Create seeds
    const seeds = this.createSeeds(svg, centerX, centerY);

    // Create animation context
    const animationContext = {
      svg,
      seeds,
      centerX,
      centerY,
      animationFrameId: null,
      isComplete: false,
    };

    // Add to active animations
    this.activeAnimations.add(animationContext);

    // Animate seeds
    this.animatePlanting(animationContext);
  }

  /**
   * Create SVG container
   * @returns {SVGElement} SVG container
   */
  createSVGContainer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "plant-animation");
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
   * Create seed particles
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @returns {Array} Array of seed objects
   */
  createSeeds(svg, centerX, centerY) {
    const seeds = [];
    const seedCount = 15;

    for (let i = 0; i < seedCount; i++) {
      const seed = this.createSeed(svg, centerX, centerY, i);
      seeds.push(seed);
    }

    return seeds;
  }

  /**
   * Create a single seed particle
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} index - Seed index
   * @returns {Object} Seed data
   */
  createSeed(svg, centerX, centerY, index) {
    // Random spread pattern
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 25;
    const depth = Math.random();

    // Seed colors (yellow, green, brown variety like harvest)
    const type = Math.random();
    let color, size;

    if (type < 0.35) {
      // Yellow/golden seeds
      color = `rgb(${200 + Math.random() * 55}, ${180 + Math.random() * 50}, ${50 + Math.random() * 50})`;
      size = 3 + Math.random() * 3;
    } else if (type < 0.7) {
      // Green seeds
      color = `rgb(${50 + Math.random() * 50}, ${120 + Math.random() * 80}, ${30 + Math.random() * 40})`;
      size = 3 + Math.random() * 3;
    } else {
      // Brown seeds
      color = `rgb(${139 + Math.random() * 40}, ${90 + Math.random() * 30}, ${43 + Math.random() * 20})`;
      size = 2 + Math.random() * 3;
    }

    // Create seed group for 3D effect
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Seed shape (ellipse for seed)
    const seedShape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse",
    );
    seedShape.setAttribute("cx", centerX);
    seedShape.setAttribute("cy", centerY - 80);
    seedShape.setAttribute("rx", size * (0.6 + depth * 0.4));
    seedShape.setAttribute("ry", size * (0.8 + depth * 0.4));
    seedShape.setAttribute("fill", color);
    seedShape.setAttribute("opacity", "0");

    g.appendChild(seedShape);
    svg.appendChild(g);

    return {
      element: seedShape,
      group: g,
      startX: centerX,
      startY: centerY - 80,
      angle,
      distance: distance * (0.5 + depth),
      endY: centerY + 5 + Math.random() * 10,
      size,
      depth,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 480,
      delay: index * 40,
    };
  }

  /**
   * Animate planting process
   * @param {Object} animationContext - Animation context object
   */
  animatePlanting(animationContext) {
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      // Check if animation was cancelled
      if (animationContext.isComplete) {
        return;
      }

      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        this.cleanup(animationContext);
        return;
      }

      // Seeds animation - fall and scatter
      this.animateSeeds(
        animationContext.seeds,
        progress,
        animationContext.centerX,
        animationContext.centerY,
        elapsed,
      );

      animationContext.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Animate seeds falling and scattering
   * @param {Array} seeds - Array of seeds
   * @param {number} progress - Animation progress (0-1)
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} elapsed - Elapsed time
   */
  animateSeeds(seeds, progress, centerX, centerY, elapsed) {
    seeds.forEach((seed) => {
      // Seeds start falling immediately with stagger
      const seedStart = seed.delay / 1000;
      const seedProgress = Math.max(0, (progress - seedStart) / 0.65);

      if (seedProgress <= 0) {
        seed.element.setAttribute("opacity", "0");
        return;
      }

      // Easing for natural fall
      const eased = this.easeInQuad(Math.min(seedProgress, 1));

      // Calculate position with scatter
      const spreadX =
        Math.cos(seed.angle) * seed.distance * Math.min(seedProgress * 2, 1);
      const x = seed.startX + spreadX;

      // Y position with gravity
      const fallDistance = seed.endY - seed.startY;
      const y = seed.startY + fallDistance * eased;

      // Opacity - fade in quickly, stay visible, fade out at end
      let opacity = 1;
      if (seedProgress < 0.1) {
        opacity = seedProgress / 0.1;
      } else if (seedProgress > 0.85) {
        opacity = 1 - (seedProgress - 0.85) / 0.15;
      }

      // Rotation for 3D effect
      const rotation = seed.rotation + seed.rotationSpeed * eased;

      // Scale - seeds get slightly smaller as they fall (perspective)
      const scale = 1 - seedProgress * 0.3;

      // Apply transformations
      seed.element.setAttribute("cx", x);
      seed.element.setAttribute("cy", y);
      seed.element.setAttribute("opacity", opacity * (0.8 + seed.depth * 0.2));
      seed.element.setAttribute("rx", seed.size * scale);
      seed.element.setAttribute("ry", seed.size * 1.5 * scale);

      // 3D rotation
      seed.group.setAttribute("transform", `rotate(${rotation} ${x} ${y})`);

      // Add a subtle bounce when seeds hit the ground
      if (seedProgress > 0.9 && seedProgress < 1) {
        const bouncePhase = (seedProgress - 0.9) / 0.1;
        const bounceHeight = Math.sin(bouncePhase * Math.PI) * 3;
        seed.element.setAttribute("cy", y - bounceHeight);
      }
    });
  }

  /**
   * Ease in quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value
   */
  easeInQuad(t) {
    return t * t;
  }

  /**
   * Ease in out quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value
   */
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Ease out quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value
   */
  easeOutQuad(t) {
    return t * (2 - t);
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
