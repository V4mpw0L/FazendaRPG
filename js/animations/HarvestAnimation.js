/**
 * FazendaRPG - Harvest Animation
 * 3D rake animation system for harvesting crops
 * @version 0.0.9
 */

export default class HarvestAnimation {
  constructor() {
    this.activeAnimations = new Set();
  }

  /**
   * Create and animate rake harvesting on a plot
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

    // Create rake and particles
    const rakeGroup = this.createRake(svg, centerX, centerY);
    const particles = this.createHarvestParticles(svg, centerX, centerY);

    // Create animation context
    const animationContext = {
      svg,
      rakeGroup,
      particles,
      centerX,
      centerY,
      animationFrameId: null,
      isComplete: false,
    };

    // Add to active animations
    this.activeAnimations.add(animationContext);

    // Animate rake and particles
    this.animateHarvest(animationContext);
  }

  /**
   * Create SVG container
   * @returns {SVGElement} SVG container
   */
  createSVGContainer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "harvest-animation");
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
   * Create rake SVG element
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @returns {SVGElement} Rake group element
   */
  createRake(svg, centerX, centerY) {
    const rakeGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    rakeGroup.setAttribute("opacity", "0");

    // Rake handle (wooden stick)
    const handle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    handle.setAttribute("x", centerX - 3);
    handle.setAttribute("y", centerY - 60);
    handle.setAttribute("width", "6");
    handle.setAttribute("height", "50");
    handle.setAttribute("fill", "#8B4513");
    handle.setAttribute("rx", "3");

    // Rake head (horizontal bar)
    const head = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    head.setAttribute("x", centerX - 30);
    head.setAttribute("y", centerY - 15);
    head.setAttribute("width", "60");
    head.setAttribute("height", "5");
    head.setAttribute("fill", "#654321");
    head.setAttribute("rx", "2");

    // Rake teeth (prongs)
    const teethCount = 7;
    const teethSpacing = 60 / (teethCount - 1);

    for (let i = 0; i < teethCount; i++) {
      const tooth = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      const x = centerX - 30 + i * teethSpacing - 1;
      tooth.setAttribute("x", x);
      tooth.setAttribute("y", centerY - 10);
      tooth.setAttribute("width", "2");
      tooth.setAttribute("height", "12");
      tooth.setAttribute("fill", "#654321");
      tooth.setAttribute("rx", "1");
      rakeGroup.appendChild(tooth);
    }

    rakeGroup.appendChild(handle);
    rakeGroup.appendChild(head);
    svg.appendChild(rakeGroup);

    return rakeGroup;
  }

  /**
   * Create harvest particles (crop pieces, leaves, dust)
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @returns {Array} Array of particle objects
   */
  createHarvestParticles(svg, centerX, centerY) {
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(svg, centerX, centerY, i);
      particles.push(particle);
    }

    return particles;
  }

  /**
   * Create a single particle
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} index - Particle index
   * @returns {Object} Particle data
   */
  createParticle(svg, centerX, centerY, index) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 40;
    const speed = 0.5 + Math.random() * 1;

    // Random particle type (leaf, dust, crop piece)
    const type = Math.random();
    let color, size;

    if (type < 0.3) {
      // Green leaves
      color = `rgb(${50 + Math.random() * 50}, ${120 + Math.random() * 80}, ${30 + Math.random() * 40})`;
      size = 4 + Math.random() * 3;
    } else if (type < 0.6) {
      // Brown dust/dirt
      color = `rgb(${100 + Math.random() * 50}, ${70 + Math.random() * 30}, ${40 + Math.random() * 20})`;
      size = 2 + Math.random() * 2;
    } else {
      // Yellow/golden crop pieces
      color = `rgb(${200 + Math.random() * 55}, ${180 + Math.random() * 50}, ${50 + Math.random() * 50})`;
      size = 3 + Math.random() * 4;
    }

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", size);
    circle.setAttribute("fill", color);
    circle.setAttribute("opacity", "0");

    svg.appendChild(circle);

    return {
      element: circle,
      startX: centerX,
      startY: centerY,
      angle,
      distance: distance * speed,
      size,
      speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
    };
  }

  /**
   * Animate rake and harvest particles
   * @param {Object} animationContext - Animation context object
   */
  animateHarvest(animationContext) {
    const startTime = Date.now();
    const duration = 1200;

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

      // Rake animation - sweeping motion
      this.animateRake(
        animationContext.rakeGroup,
        progress,
        animationContext.centerX,
        animationContext.centerY,
      );

      // Particle animation - scatter when rake passes
      this.animateParticles(
        animationContext.particles,
        progress,
        animationContext.centerX,
        animationContext.centerY,
      );

      animationContext.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Animate rake sweeping motion
   * @param {SVGElement} rakeGroup - Rake group element
   * @param {number} progress - Animation progress (0-1)
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   */
  animateRake(rakeGroup, progress, centerX, centerY) {
    let opacity, translateX, translateY, rotation;

    if (progress < 0.15) {
      // Fade in and position above
      opacity = progress / 0.15;
      translateX = -40;
      translateY = -30;
      rotation = -45;
    } else if (progress < 0.6) {
      // Sweep across the plot
      const sweepProgress = (progress - 0.15) / 0.45;
      const easedSweep = this.easeInOutQuad(sweepProgress);

      opacity = 1;
      translateX = -40 + easedSweep * 80; // Sweep from left to right
      translateY = -30 + easedSweep * 20; // Slight downward motion
      rotation = -45 + easedSweep * 90; // Rotate as it sweeps
    } else if (progress < 0.8) {
      // Hold at end position
      opacity = 1;
      translateX = 40;
      translateY = -10;
      rotation = 45;
    } else {
      // Fade out
      const fadeProgress = (progress - 0.8) / 0.2;
      opacity = 1 - fadeProgress;
      translateX = 40;
      translateY = -10;
      rotation = 45;
    }

    rakeGroup.setAttribute("opacity", opacity);
    rakeGroup.setAttribute(
      "transform",
      `translate(${translateX}, ${translateY}) rotate(${rotation} ${centerX} ${centerY})`,
    );
  }

  /**
   * Animate harvest particles scattering
   * @param {Array} particles - Array of particles
   * @param {number} progress - Animation progress (0-1)
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   */
  animateParticles(particles, progress, centerX, centerY) {
    particles.forEach((particle, index) => {
      // Particles start appearing when rake is in the middle
      const particleStart = 0.25 + index * 0.01;
      const particleProgress = Math.max(0, (progress - particleStart) / 0.6);

      if (particleProgress <= 0) {
        particle.element.setAttribute("opacity", "0");
        return;
      }

      // Easing for natural scatter
      const eased = this.easeOutQuad(Math.min(particleProgress, 1));

      // Calculate position with scatter effect
      const x =
        particle.startX + Math.cos(particle.angle) * particle.distance * eased;
      const y =
        particle.startY +
        Math.sin(particle.angle) * particle.distance * eased * 0.5 +
        eased * 20;

      // Opacity - fade in then fade out
      let opacity = 1;
      if (particleProgress < 0.1) {
        opacity = particleProgress / 0.1;
      } else if (particleProgress > 0.8) {
        opacity = 1 - (particleProgress - 0.8) / 0.2;
      }

      // Apply transformations
      particle.element.setAttribute("cx", x);
      particle.element.setAttribute("cy", y);
      particle.element.setAttribute("opacity", opacity * 0.8);

      // Rotation effect
      const rotation = particle.rotation + particle.rotationSpeed * eased;
      particle.element.setAttribute(
        "transform",
        `rotate(${rotation} ${x} ${y})`,
      );
    });
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
