#!/usr/bin/env node

/**
 * FazendaRPG - Version Update Script
 * Automatically updates version across all project files
 *
 * Usage:
 *   node update-version.js 0.0.12
 *   node update-version.js --patch (increments patch: 0.0.11 -> 0.0.12)
 *   node update-version.js --minor (increments minor: 0.0.11 -> 0.1.0)
 *   node update-version.js --major (increments major: 0.0.11 -> 1.0.0)
 *
 * @version 0.0.12
 */

const fs = require("fs");
const path = require("path");

// ANSI colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

// Files to update with their specific patterns
const FILES_TO_UPDATE = [
  // Core files
  {
    path: "version.js",
    patterns: [
      {
        regex: /VERSION = "[\d.]+"/g,
        replace: 'VERSION = "VERSION_PLACEHOLDER"',
      },
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
      { regex: /major: \d+/g, replace: "major: MAJOR_PLACEHOLDER" },
      { regex: /minor: \d+/g, replace: "minor: MINOR_PLACEHOLDER" },
      { regex: /patch: \d+/g, replace: "patch: PATCH_PLACEHOLDER" },
    ],
  },
  {
    path: "sw.js",
    patterns: [
      {
        regex: /Service Worker v[\d.]+/g,
        replace: "Service Worker vVERSION_PLACEHOLDER",
      },
      {
        regex: /const VERSION = "[\d.]+"/g,
        replace: 'const VERSION = "VERSION_PLACEHOLDER"',
      },
      {
        regex: /fazendarpg-v[\d.]+/g,
        replace: "fazendarpg-vVERSION_PLACEHOLDER",
      },
    ],
  },
  {
    path: "manifest.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "js/app.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "index.html",
    patterns: [{ regex: /v\d+\.\d+\.\d+/g, replace: "vVERSION_PLACEHOLDER" }],
  },

  // Data files
  {
    path: "data/crops.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/items.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/npcs.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/quests.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/skills.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/translations/en-US.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "data/translations/pt-BR.json",
    patterns: [
      {
        regex: /"version": "[\d.]+"/g,
        replace: '"version": "VERSION_PLACEHOLDER"',
      },
    ],
  },

  // System files
  {
    path: "js/core/GameEngine.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
      {
        regex: /FazendaRPG v\d+\.\d+\.\d+/g,
        replace: "FazendaRPG vVERSION_PLACEHOLDER",
      },
      {
        regex: /version: "\d+\.\d+\.\d+"/g,
        replace: 'version: "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "js/core/Player.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/core/SaveManager.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
      {
        regex: /currentVersion = "[\d.]+"/g,
        replace: 'currentVersion = "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "js/systems/FarmSystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/InventorySystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/SkillSystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/QuestSystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/NotificationManager.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/city/BankSystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/city/TavernSystem.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // UI files
  {
    path: "js/ui/TopBar.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/SideMenu.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/ScreenManager.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/InventoryUI.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/MarketUI.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/NPCSUI.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/CityUI.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/ui/AvatarSelector.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // Animation files
  {
    path: "js/animations/PlantAnimation.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/animations/HarvestAnimation.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/animations/FertilizerAnimation.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/animations/WeedRemovalAnimation.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // Utils files
  {
    path: "js/utils/notifications.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/utils/i18n.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/utils/iconRenderer.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/utils/helpers.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // Wiki files
  {
    path: "js/wiki/WikiManager.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/wiki/WikiData.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
      {
        regex: /version: "\d+\.\d+\.\d+"/g,
        replace: 'version: "VERSION_PLACEHOLDER"',
      },
    ],
  },
  {
    path: "js/wiki/WikiContentGenerator.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/wiki/WikiPagesRenderer.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // Modal files
  {
    path: "js/ui/modals/Modal.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // Event System files
  {
    path: "js/systems/events/EventManager.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/events/HalloweenEvent.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/events/eventConfig.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
  {
    path: "js/systems/events/eventConfig.example.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // News System files
  {
    path: "js/ui/news/NewsModal.js",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },

  // CSS files
  {
    path: "style/main.css",
    patterns: [
      {
        regex: /FazendaRPG v[\d.]+/g,
        replace: "FazendaRPG vVERSION_PLACEHOLDER",
      },
    ],
  },
  {
    path: "style/wiki.css",
    patterns: [
      { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
    ],
  },
];

/**
 * Read current version from version.js
 */
function getCurrentVersion() {
  try {
    const versionPath = path.join(__dirname, "version.js");
    const content = fs.readFileSync(versionPath, "utf8");
    const match = content.match(/VERSION = "([\d.]+)"/);
    if (match) {
      return match[1];
    }
  } catch (error) {
    console.error(
      `${colors.red}❌ Error reading current version:${colors.reset}`,
      error.message,
    );
  }
  return "0.0.11"; // fallback
}

/**
 * Parse version string to parts
 */
function parseVersion(versionString) {
  const parts = versionString.split(".").map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

/**
 * Increment version based on type
 */
function incrementVersion(currentVersion, type) {
  const parts = parseVersion(currentVersion);

  switch (type) {
    case "major":
      parts.major++;
      parts.minor = 0;
      parts.patch = 0;
      break;
    case "minor":
      parts.minor++;
      parts.patch = 0;
      break;
    case "patch":
      parts.patch++;
      break;
    default:
      throw new Error(`Invalid increment type: ${type}`);
  }

  return `${parts.major}.${parts.minor}.${parts.patch}`;
}

/**
 * Update file with new version
 */
function updateFile(filePath, newVersion, versionParts) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(
      `${colors.yellow}⚠️  Skipping (not found):${colors.reset} ${filePath}`,
    );
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, "utf8");
    let modified = false;

    const fileConfig = FILES_TO_UPDATE.find((f) => f.path === filePath);
    if (!fileConfig) return false;

    fileConfig.patterns.forEach((pattern) => {
      let replacement = pattern.replace
        .replace("VERSION_PLACEHOLDER", newVersion)
        .replace("MAJOR_PLACEHOLDER", versionParts.major)
        .replace("MINOR_PLACEHOLDER", versionParts.minor)
        .replace("PATCH_PLACEHOLDER", versionParts.patch);

      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`${colors.green}✅ Updated:${colors.reset} ${filePath}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  No changes:${colors.reset} ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(
      `${colors.red}❌ Error updating ${filePath}:${colors.reset}`,
      error.message,
    );
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log(
    `${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.cyan}  🌾 FazendaRPG Version Update Tool${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`,
  );

  const args = process.argv.slice(2);
  const currentVersion = getCurrentVersion();
  let newVersion;

  console.log(
    `${colors.blue}📌 Current version:${colors.reset} ${colors.bright}${currentVersion}${colors.reset}\n`,
  );

  // Determine new version
  if (args.length === 0) {
    console.error(`${colors.red}❌ Error: No version specified${colors.reset}`);
    console.log(`\n${colors.yellow}Usage:${colors.reset}`);
    console.log(`  node update-version.js 0.0.12`);
    console.log(`  node update-version.js --patch`);
    console.log(`  node update-version.js --minor`);
    console.log(`  node update-version.js --major\n`);
    process.exit(1);
  }

  const arg = args[0];

  if (arg === "--patch" || arg === "-p") {
    newVersion = incrementVersion(currentVersion, "patch");
    console.log(
      `${colors.blue}🔼 Incrementing patch version...${colors.reset}`,
    );
  } else if (arg === "--minor" || arg === "-m") {
    newVersion = incrementVersion(currentVersion, "minor");
    console.log(
      `${colors.blue}🔼 Incrementing minor version...${colors.reset}`,
    );
  } else if (arg === "--major" || arg === "-M") {
    newVersion = incrementVersion(currentVersion, "major");
    console.log(
      `${colors.blue}🔼 Incrementing major version...${colors.reset}`,
    );
  } else if (/^\d+\.\d+\.\d+$/.test(arg)) {
    newVersion = arg;
    console.log(`${colors.blue}📝 Setting version manually...${colors.reset}`);
  } else {
    console.error(
      `${colors.red}❌ Error: Invalid version format: ${arg}${colors.reset}`,
    );
    console.log(
      `${colors.yellow}Expected format: X.Y.Z (e.g., 0.0.12)${colors.reset}\n`,
    );
    process.exit(1);
  }

  console.log(
    `${colors.green}✨ New version:${colors.reset} ${colors.bright}${newVersion}${colors.reset}\n`,
  );

  // Confirm update
  if (currentVersion === newVersion) {
    console.log(
      `${colors.yellow}⚠️  Warning: New version is the same as current version${colors.reset}\n`,
    );
  }

  const versionParts = parseVersion(newVersion);

  console.log(`${colors.blue}📝 Updating files...${colors.reset}\n`);

  // Update all files
  let updatedCount = 0;
  let skippedCount = 0;

  FILES_TO_UPDATE.forEach((file) => {
    const result = updateFile(file.path, newVersion, versionParts);
    if (result) {
      updatedCount++;
    } else {
      skippedCount++;
    }
  });

  // Summary
  console.log(
    `\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.green}✅ Version update complete!${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`,
  );
  console.log(`${colors.bright}Old version:${colors.reset} ${currentVersion}`);
  console.log(`${colors.bright}New version:${colors.reset} ${newVersion}`);
  console.log(`${colors.bright}Files updated:${colors.reset} ${updatedCount}`);
  console.log(
    `${colors.bright}Files skipped:${colors.reset} ${skippedCount}\n`,
  );

  // Next steps
  console.log(`${colors.yellow}📋 Next steps:${colors.reset}`);
  console.log(`  1. Review changes: git diff`);
  console.log(`  2. Test the application`);
  console.log(
    `  3. Commit changes: git commit -am "chore: bump version to ${newVersion}"`,
  );
  console.log(`  4. Clear browser cache and reload\n`);

  console.log(
    `${colors.green}🌾 FazendaRPG is now at version ${newVersion}!${colors.reset}\n`,
  );
}

// Run the script
main();
