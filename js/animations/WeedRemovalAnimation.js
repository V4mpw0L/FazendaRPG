/**
 * FazendaRPG - Weed Removal Animation
 * 3D rake animation system for removing weeds from plots
 * @version 0.0.9
 */

export default class WeedRemovalAnimation {
  constructor() {
    this.activeAnimations = new Set();
  }

  /**
   * Create and animate weed removal on a plot
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

    // Create rake
    const rake = this.createRake(svg, centerX, centerY);

    // Create weed particles
    const weeds = this.createWeeds(svg, centerX, centerY);

    // Create animation context
    const animationContext = {
      svg,
      rake,
      weeds,
      centerX,
      centerY,
      animationFrameId: null,
      isComplete: false,
    };

    // Add to active animations
    this.activeAnimations.add(animationContext);

    // Animate weed removal
    this.animateRemoval(animationContext);
  }

  /**
   * Create SVG container
   * @returns {SVGElement} SVG container
   */
  createSVGContainer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "weed-removal-animation");
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
   * Create rake tool
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @returns {Object} Rake elements
   */
  createRake(svg, centerX, centerY) {
    const rakeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    rakeGroup.setAttribute("opacity", "0");

    // Rake handle
    const handle = document.createElementNS("http://www.w3.org/2000/svg", "line");
    handle.setAttribute("x1", centerX);
    handle.setAttribute("y1", centerY - 100);
    handle.setAttribute("x2", centerX);
    handle.setAttribute("y2", centerY - 30);
    handle.setAttribute("stroke", "#8B4513");
    handle.setAttribute("stroke-width", "4");
    handle.setAttribute("stroke-linecap", "round");
    handle.setAttribute("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");

    // Rake head (horizontal bar)
    const head = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    head.setAttribute("x", centerX - 25);
    head.setAttribute("y", centerY - 32);
    head.setAttribute("width", "50");
    head.setAttribute("height", "4");
    head.setAttribute("fill", "#654321");
    head.setAttribute("rx", "2");
    head.setAttribute("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");

    // Rake teeth
    const teeth = [];
    for (let i = 0; i < 7; i++) {
      const tooth = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const x = centerX - 21 + i * 7;
      tooth.setAttribute("x1", x);
      tooth.setAttribute("y1", centerY - 28);
      tooth.setAttribute("x2", x);
      tooth.setAttribute("y2", centerY - 18);
      tooth.setAttribute("stroke", "#654321");
      tooth.setAttribute("stroke-width", "2");
      tooth.setAttribute("stroke-linecap", "round");
      teeth.push(tooth);
      rakeGroup.appendChild(tooth);
    }

    rakeGroup.appendChild(handle);
    rakeGroup.appendChild(head);
    svg.appendChild(rakeGroup);

    return {
      group: rakeGroup,
      handle,
      head,
      teeth,
    };
  }

  /**
   * Create weed particles
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @returns {Array} Array of weed objects
   */
  createWeeds(svg, centerX, centerY) {
    const weeds = [];
    const weedCount = 20;

    for (let i = 0; i < weedCount; i++) {
      const weed = this.createWeed(svg, centerX, centerY, i);
      weeds.push(weed);
    }

    return weeds;
  }

  /**
   * Create a single weed particle
   * @param {SVGElement} svg - SVG container
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} index - Weed index
   * @returns {Object} Weed data
   */
  createWeed(svg, centerX, centerY, index) {
    // Random position within plot area
    const startX = centerX + (Math.random() - 0.5) * 40;
    const startY = centerY + (Math.random() - 0.5) * 20;

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    const depth = Math.random();

    // Weed colors (green, dark green variety)
    const type = Math.random();
    let color, size;

    if (type < 0.5) {
      // Bright green weeds
      color = `rgb(${50 + Math.random() * 80}, ${150 + Math.random() * 60}, ${40 + Math.random() * 50})`;
      size = 3 + Math.random() * 4;
    } else {
      // Dark green weeds
      color = `rgb(${34 + Math.random() * 50}, ${100 + Math.random() * 50}, ${34 + Math.random() * 40})`;
      size = 2 + Math.random() * 3;
    }

    // Create weed group for 3D effect
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Weed shape (small leaf-like shape)
    const weedShape = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Create a simple leaf path
    const leafPath = `M 0,0 Q ${size},-${size * 1.5} 0,-${size * 2.5} Q -${size},-${size * 1.5} 0,0`;

    weedShape.setAttribute("d", leafPath);
    weedShape.setAttribute("fill", color);
    weedShape.setAttribute("opacity", "0");
    weedShape.setAttribute("filter", "drop-shadow(1px 1px 1px rgba(0,0,0,0.2))");
    weedShape.setAttribute("transform", `translate(${startX}, ${startY})`);

    g.appendChild(weedShape);
    svg.appendChild(g);

    return {
      element: weedShape,
      group: g,
      startX,
      startY,
      angle,
      distance: distance * (0.5 + depth * 0.5),
      size,
      depth,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
      delay: index * 30,
      spinSpeed: (Math.random() - 0.5) * 360,
    };
  }

  /**
   * Animate weed removal process
   * @param {Object} animationContext - Animation context object
   */
  animateRemoval(animationContext) {
    const startTime = Date.now();
    const duration = 1400;

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

      // Rake animation - swipe across
      this.animateRake(
        animationContext.rake,
        progress,
        animationContext.centerX,
        animationContext.centerY
      );

      // Weeds animation - scatter and fade
      this.animateWeeds(
        animationContext.weeds,
        progress,
        animationContext.centerX,
        animationContext.centerY,
        elapsed
      );

      animationContext.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Animate rake swiping motion
   * @param {Object} rake - Rake elements
   * @param {number} progress - Animation progress (0-1)
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   */
  animateRake(rake, progress, centerX, centerY) {
    // Rake enters from left, swipes right, exits
    let rakeProgress = progress * 1.2; // Slightly faster than overall
    rakeProgress = Math.min(rakeProgress, 1);

    // Phase 1: Enter (0-0.2)
    // Phase 2: Swipe (0.2-0.7)
    // Phase 3: Exit (0.7-1.0)

    let opacity = 1;
    let offsetX = 0;
    let rotation = 0;

    if (rakeProgress < 0.15) {
      // Enter phase - fade in and move in
      const enterProgress = rakeProgress / 0.15;
      opacity = enterProgress;
      offsetX = -60 + enterProgress * 60;
      rotation = -15 + enterProgress * 15;
    } else if (rakeProgress < 0.7) {
      // Swipe phase - move across
      const swipeProgress = (rakeProgress - 0.15) / 0.55;
      const eased = this.easeInOutQuad(swipeProgress);
      offsetX = eased * 80;
      rotation = Math.sin(swipeProgress * Math.PI) * 5;
    } else {
      // Exit phase - move out and fade
      const exitProgress = (rakeProgress - 0.7) / 0.3;
      opacity = 1 - exitProgress;
      offsetX = 80 + exitProgress * 40;
      rotation = exitProgress * 15;
    }

    // Apply transformations
    rake.group.setAttribute("opacity", opacity);
    rake.group.setAttribute(
      "transform",
      `translate(${offsetX}, 0) rotate(${rotation} ${centerX} ${centerY - 50})`
    );
  }

  /**
   * Animate weeds being scattered
   * @param {Array} weeds - Array of weeds
   * @param {number} progress - Animation progress (0-1)
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} elapsed - Elapsed time
   */
  animateWeeds(weeds, progress, centerX, centerY, elapsed) {
    weeds.forEach((weed) => {
      // Weeds start scattering when rake reaches them (around 0.3-0.6)
      const weedStart = 0.25 + (weed.delay / 1400) * 0.3;
      const weedProgress = Math.max(0, (progress - weedStart) / 0.5);

      if (weedProgress <= 0) {
        // Before rake reaches - weeds are visible but still
        if (progress > 0.1) {
          weed.element.setAttribute("opacity", "0.8");
        } else {
          weed.element.setAttribute("opacity", "0");
        }
        return;
      }

      // Easing for natural scatter
      const eased = this.easeOutQuad(Math.min(weedProgress, 1));

      // Calculate scattered position
      const spreadX = Math.cos(weed.angle) * weed.distance * eased;
      const spreadY = Math.sin(weed.angle) * weed.distance * eased - (eased * eased * 20);
      const x = weed.startX + spreadX;
      const y = weed.startY + spreadY;

      // Opacity - fade out as they scatter
      let opacity = 0.8;
      if (weedProgress > 0.6) {
        opacity = 0.8 * (1 - (weedProgress - 0.6) / 0.4);
      }

      // Rotation for tumbling effect
      const rotation = weed.rotation + weed.rotationSpeed * eased;
      const spin = weed.spinSpeed * weedProgress * 3;

      // Scale - weeds shrink as they fly away (perspective)
      const scale = 1 - weedProgress * 0.5;

      // Apply transformations
      weed.element.setAttribute(
        "transform",
        `translate(${x}, ${y}) rotate(${rotation + spin}) scale(${scale})`
      );
      weed.element.setAttribute("opacity", opacity * (0.7 + weed.depth * 0.3));
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
