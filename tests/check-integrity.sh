#!/bin/bash
# FazendaRPG - Project Integrity Checker
# Verifies that all required files exist and are properly structured
#
# 📍 Location: tests/check-integrity.sh
# 🚀 Usage: Run from project root directory
#
#   cd /path/to/FazendaRPG
#   ./tests/check-integrity.sh
#
# or
#
#   cd /path/to/FazendaRPG
#   bash tests/check-integrity.sh
#

echo "🌾 FazendaRPG v0.0.5 - Integrity Check"
echo "======================================"
echo ""

# Check if running from project root
if [ ! -f "index.html" ] || [ ! -f "manifest.json" ]; then
    echo "❌ ERROR: This script must be run from the project root directory!"
    echo ""
    echo "Usage:"
    echo "  cd /path/to/FazendaRPG"
    echo "  ./tests/check-integrity.sh"
    echo ""
    exit 1
fi

echo "✅ Running from correct directory"
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 - MISSING!"
        ((ERRORS++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ - MISSING!"
        ((ERRORS++))
    fi
}

# Function to warn about optional file
warn_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${YELLOW}⚠${NC} $1 - Optional, missing"
        ((WARNINGS++))
    fi
}

echo "📁 Checking Core Files..."
check_file "index.html"
check_file "manifest.json"
check_file "sw.js"
check_file "README.md"
echo ""

echo "📁 Checking Directories..."
check_dir "assets"
check_dir "data"
check_dir "data/translations"
check_dir "js"
check_dir "js/core"
check_dir "js/systems"
check_dir "js/ui"
check_dir "js/utils"
check_dir "style"
echo ""

echo "🎨 Checking Styles..."
check_file "style/main.css"
check_file "style/topbar.css"
check_file "style/skills.css"
check_file "style/themes.css"
check_file "style/mobile.css"
echo ""

echo "📦 Checking Data Files..."
check_file "data/skills.json"
check_file "data/items.json"
check_file "data/crops.json"
check_file "data/quests.json"
check_file "data/npcs.json"
check_file "data/translations/pt-BR.json"
check_file "data/translations/en-US.json"
echo ""

echo "🧩 Checking Core JavaScript..."
check_file "js/app.js"
check_file "js/core/GameEngine.js"
check_file "js/core/Player.js"
check_file "js/core/SaveManager.js"
echo ""

echo "⚙️ Checking Systems..."
check_file "js/systems/SkillSystem.js"
check_file "js/systems/FarmSystem.js"
check_file "js/systems/InventorySystem.js"
check_file "js/systems/QuestSystem.js"
echo ""

echo "🎮 Checking UI Components..."
check_file "js/ui/TopBar.js"
check_file "js/ui/SideMenu.js"
check_file "js/ui/ScreenManager.js"
echo ""

echo "🔧 Checking Utilities..."
check_file "js/utils/i18n.js"
check_file "js/utils/notifications.js"
check_file "js/utils/helpers.js"
echo ""

echo "🖼️ Checking PWA Icons..."
warn_file "assets/icon-72.png"
warn_file "assets/icon-96.png"
warn_file "assets/icon-128.png"
warn_file "assets/icon-144.png"
warn_file "assets/icon-152.png"
warn_file "assets/icon-192.png"
warn_file "assets/icon-384.png"
warn_file "assets/icon-512.png"
echo ""

# Check JSON syntax
echo "🔍 Checking JSON Syntax..."
for json_file in data/*.json data/translations/*.json; do
    if [ -f "$json_file" ]; then
        if python3 -m json.tool "$json_file" > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} $json_file - Valid JSON"
        else
            echo -e "${RED}✗${NC} $json_file - INVALID JSON!"
            ((ERRORS++))
        fi
    fi
done
echo ""

# Summary
echo "======================================"
echo "📊 Summary:"
echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All required files present!${NC}"
else
    echo -e "${RED}❌ $ERRORS critical errors found!${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warnings (optional files missing)${NC}"
fi

echo ""
echo "Project Status: "
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ READY TO RUN!${NC}"
    echo ""
    echo "🚀 To start the game, run a local server:"
    echo "   python3 -m http.server 8000"
    echo "   or"
    echo "   npx http-server -p 8000"
    echo ""
    echo "Then open: http://localhost:8000"
    echo ""
    echo "📚 Documentation:"
    echo "   Quick Start:     QUICK_START_ENERGIA.md"
    echo "   Navigation:      NAVEGACAO.md"
    echo "   Full Docs:       docs/INDEX.md"
else
    echo -e "${RED}❌ NOT READY - Fix errors above${NC}"
fi

echo ""
echo "📁 Location: tests/check-integrity.sh"
echo "📝 Last updated: v0.0.5 (Janeiro 2024)"

exit $ERRORS
