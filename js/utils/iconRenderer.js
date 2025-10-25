/**
 * FazendaRPG - Icon Renderer Utility
 * Handles rendering of both emoji and PNG icons
 * @version 0.0.20
 */

/**
 * Render an icon (emoji or PNG image)
 * @param {string} icon - Icon string (emoji or path to PNG)
 * @param {Object} options - Rendering options
 * @returns {string} HTML string with rendered icon
 */
export function renderIcon(icon, options = {}) {
  const { size = "1em", className = "", alt = "Icon", style = "" } = options;

  // Check if it's a PNG path
  if (icon && (icon.endsWith(".png") || icon.includes("assets/"))) {
    return `<img src="${icon}" alt="${alt}" class="item-icon ${className}" style="width: ${size}; height: ${size}; ${style}" />`;
  }

  // Otherwise it's an emoji
  return `<span class="item-icon-emoji ${className}" style="font-size: ${size}; ${style}">${icon || "📦"}</span>`;
}

/**
 * Render an item icon
 * @param {Object} item - Item object with icon property
 * @param {Object} options - Rendering options
 * @returns {string} HTML string with rendered icon
 */
export function renderItemIcon(item, options = {}) {
  const alt = item.namePtBR || item.name || "Item";
  return renderIcon(item.icon, { ...options, alt });
}

/**
 * Check if icon is an image path
 * @param {string} icon - Icon string
 * @returns {boolean} True if it's an image path
 */
export function isImageIcon(icon) {
  return icon && (icon.endsWith(".png") || icon.includes("assets/"));
}

export default {
  renderIcon,
  renderItemIcon,
  isImageIcon,
};
