/**
 * FazendaRPG - Energia System Test Suite
 * Test script to validate energy system functionality
 *
 * Usage: Copy and paste this entire file into browser console
 * Or run: copy(energiaSystemTest.runAll())
 */

window.energiaSystemTest = {

  /**
   * Test 1: Initial Energy Values
   */
  testInitialValues() {
    console.log('\n🧪 TEST 1: Initial Energy Values');
    console.log('================================');

    const player = window.game.player.data;
    const expected = 100 + (player.level - 1) * 5 +
      Object.values(player.skills).reduce((sum, skill) =>
        sum + (skill.level - 1) * 5, 0);

    console.log(`Current Energy: ${player.energy}/${player.maxEnergy}`);
    console.log(`Expected Max Energy: ${expected}`);
    console.log(`Player Level: ${player.level}`);
    console.log(`Skills:`, Object.entries(player.skills).map(([name, skill]) =>
      `${name}: ${skill.level}`).join(', '));

    const passed = player.maxEnergy === expected;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Initial Values', passed, actual: player.maxEnergy, expected };
  },

  /**
   * Test 2: Level Up Increases Max Energy
   */
  testLevelUp() {
    console.log('\n🧪 TEST 2: Level Up Increases Max Energy');
    console.log('========================================');

    const player = window.game.player.data;
    const beforeLevel = player.level;
    const beforeEnergy = player.energy;
    const beforeMaxEnergy = player.maxEnergy;

    console.log(`Before - Level: ${beforeLevel}, Energy: ${beforeEnergy}/${beforeMaxEnergy}`);

    // Add enough XP to level up
    const xpNeeded = window.game.player.calculateXPForLevel(beforeLevel + 1) - player.xp + 10;
    window.game.player.addXP(xpNeeded);

    const afterLevel = player.level;
    const afterEnergy = player.energy;
    const afterMaxEnergy = player.maxEnergy;

    console.log(`After - Level: ${afterLevel}, Energy: ${afterEnergy}/${afterMaxEnergy}`);
    console.log(`Max Energy Increase: +${afterMaxEnergy - beforeMaxEnergy}`);

    const leveledUp = afterLevel > beforeLevel;
    const energyIncreased = afterMaxEnergy === beforeMaxEnergy + 5;
    const energyRestored = afterEnergy === afterMaxEnergy;

    console.log(`Level Up: ${leveledUp ? '✅' : '❌'}`);
    console.log(`Max Energy +5: ${energyIncreased ? '✅' : '❌'}`);
    console.log(`Energy Restored: ${energyRestored ? '✅' : '❌'}`);

    const passed = leveledUp && energyIncreased && energyRestored;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Level Up', passed, leveledUp, energyIncreased, energyRestored };
  },

  /**
   * Test 3: Skill Level Up Increases Max Energy
   */
  testSkillLevelUp() {
    console.log('\n🧪 TEST 3: Skill Level Up Increases Max Energy');
    console.log('==============================================');

    const player = window.game.player.data;
    const skill = 'farming';
    const beforeSkillLevel = player.skills[skill].level;
    const beforeEnergy = player.energy;
    const beforeMaxEnergy = player.maxEnergy;

    console.log(`Before - ${skill}: ${beforeSkillLevel}, Energy: ${beforeEnergy}/${beforeMaxEnergy}`);

    // Add enough skill XP to level up
    const xpNeeded = window.game.player.calculateXPForLevel(beforeSkillLevel + 1) - player.skills[skill].xp + 10;
    window.game.player.addSkillXP(skill, xpNeeded);

    const afterSkillLevel = player.skills[skill].level;
    const afterEnergy = player.energy;
    const afterMaxEnergy = player.maxEnergy;

    console.log(`After - ${skill}: ${afterSkillLevel}, Energy: ${afterEnergy}/${afterMaxEnergy}`);
    console.log(`Max Energy Increase: +${afterMaxEnergy - beforeMaxEnergy}`);

    const skillLeveledUp = afterSkillLevel > beforeSkillLevel;
    const energyIncreased = afterMaxEnergy === beforeMaxEnergy + 5;
    const energyRestored = afterEnergy === afterMaxEnergy;

    console.log(`Skill Level Up: ${skillLeveledUp ? '✅' : '❌'}`);
    console.log(`Max Energy +5: ${energyIncreased ? '✅' : '❌'}`);
    console.log(`Energy Restored: ${energyRestored ? '✅' : '❌'}`);

    const passed = skillLeveledUp && energyIncreased && energyRestored;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Skill Level Up', passed, skillLeveledUp, energyIncreased, energyRestored };
  },

  /**
   * Test 4: Calculate Max Energy Formula
   */
  testCalculateFormula() {
    console.log('\n🧪 TEST 4: Calculate Max Energy Formula');
    console.log('=======================================');

    const testCases = [
      { level: 1, skills: {}, expected: 100 },
      { level: 5, skills: {}, expected: 120 },
      { level: 10, skills: {}, expected: 145 },
      { level: 1, skills: { farming: 5 }, expected: 120 },
      { level: 5, skills: { farming: 5, mining: 3 }, expected: 150 },
      { level: 20, skills: { farming: 10, mining: 10, fishing: 10 }, expected: 362 },
    ];

    let allPassed = true;

    testCases.forEach((testCase, index) => {
      const skills = {};
      const defaultSkills = ['farming', 'mining', 'fishing', 'cooking', 'woodcutting', 'crafting', 'smithing', 'foraging'];

      defaultSkills.forEach(skill => {
        skills[skill] = { level: testCase.skills[skill] || 1, xp: 0 };
      });

      const calculated = window.game.player.calculateMaxEnergy(testCase.level, skills);
      const passed = calculated === testCase.expected;

      console.log(`Test ${index + 1}: Level ${testCase.level}, Skills ${JSON.stringify(testCase.skills)}`);
      console.log(`  Expected: ${testCase.expected}, Got: ${calculated} ${passed ? '✅' : '❌'}`);

      if (!passed) allPassed = false;
    });

    console.log(allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

    return { test: 'Calculate Formula', passed: allPassed };
  },

  /**
   * Test 5: Save/Load Persistence
   */
  testSaveLoadPersistence() {
    console.log('\n🧪 TEST 5: Save/Load Persistence');
    console.log('================================');

    const player = window.game.player.data;
    const beforeMaxEnergy = player.maxEnergy;
    const beforeEnergy = player.energy;
    const beforeLevel = player.level;

    console.log(`Before Save - Level: ${beforeLevel}, Energy: ${beforeEnergy}/${beforeMaxEnergy}`);

    // Save game
    window.game.saveGame();
    console.log('Game saved ✅');

    // Simulate load by reloading player data
    const saveData = window.game.saveManager.load();
    window.game.player.load(saveData.player);

    const afterMaxEnergy = player.maxEnergy;
    const afterEnergy = player.energy;
    const afterLevel = player.level;

    console.log(`After Load - Level: ${afterLevel}, Energy: ${afterEnergy}/${afterMaxEnergy}`);

    const maxEnergyPersisted = beforeMaxEnergy === afterMaxEnergy;
    const energyPersisted = beforeEnergy === afterEnergy;
    const levelPersisted = beforeLevel === afterLevel;

    console.log(`Max Energy Persisted: ${maxEnergyPersisted ? '✅' : '❌'}`);
    console.log(`Energy Persisted: ${energyPersisted ? '✅' : '❌'}`);
    console.log(`Level Persisted: ${levelPersisted ? '✅' : '❌'}`);

    const passed = maxEnergyPersisted && energyPersisted && levelPersisted;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Save/Load Persistence', passed, maxEnergyPersisted, energyPersisted, levelPersisted };
  },

  /**
   * Test 6: Migration of Old Saves
   */
  testOldSaveMigration() {
    console.log('\n🧪 TEST 6: Old Save Migration');
    console.log('=============================');

    // Create mock old save data (without proper maxEnergy)
    const mockOldSave = {
      level: 10,
      energy: 50,
      maxEnergy: 100, // Old value, should be recalculated
      skills: {
        farming: { level: 5, xp: 0 },
        mining: { level: 3, xp: 0 },
        fishing: { level: 1, xp: 0 },
        cooking: { level: 1, xp: 0 },
        woodcutting: { level: 1, xp: 0 },
        crafting: { level: 1, xp: 0 },
        smithing: { level: 1, xp: 0 },
        foraging: { level: 1, xp: 0 },
      }
    };

    console.log('Mock Old Save:', mockOldSave);

    // Calculate expected maxEnergy
    const expectedMaxEnergy = 100 + (10 - 1) * 5 + (5 - 1) * 5 + (3 - 1) * 5; // = 100 + 45 + 20 + 10 = 175

    // Simulate load with merge
    const merged = window.game.player.mergeWithDefaults(mockOldSave);

    console.log(`Old Max Energy: ${mockOldSave.maxEnergy}`);
    console.log(`Expected Max Energy: ${expectedMaxEnergy}`);
    console.log(`Migrated Max Energy: ${merged.maxEnergy}`);
    console.log(`Energy Preserved: ${merged.energy} (was ${mockOldSave.energy})`);

    const correctMaxEnergy = merged.maxEnergy === expectedMaxEnergy;
    const energyPreserved = merged.energy === mockOldSave.energy;

    console.log(`Max Energy Recalculated: ${correctMaxEnergy ? '✅' : '❌'}`);
    console.log(`Energy Preserved: ${energyPreserved ? '✅' : '❌'}`);

    const passed = correctMaxEnergy && energyPreserved;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Old Save Migration', passed, correctMaxEnergy, energyPreserved, expected: expectedMaxEnergy, actual: merged.maxEnergy };
  },

  /**
   * Test 7: Energy Doesn't Exceed Max
   */
  testEnergyClamp() {
    console.log('\n🧪 TEST 7: Energy Clamp (Cannot Exceed Max)');
    console.log('===========================================');

    const player = window.game.player.data;
    const maxEnergy = player.maxEnergy;

    // Try to add energy beyond max
    player.energy = maxEnergy - 10;
    console.log(`Set energy to: ${player.energy}/${maxEnergy}`);

    window.game.player.addEnergy(50);

    console.log(`After adding 50: ${player.energy}/${maxEnergy}`);

    const clamped = player.energy === maxEnergy;
    console.log(`Energy Clamped to Max: ${clamped ? '✅' : '❌'}`);

    const passed = clamped;
    console.log(passed ? '✅ PASSED' : '❌ FAILED');

    return { test: 'Energy Clamp', passed, clamped };
  },

  /**
   * Display Current Stats
   */
  displayStats() {
    console.log('\n📊 CURRENT PLAYER STATS');
    console.log('=======================');

    const player = window.game.player.data;

    console.table({
      'Player Level': player.level,
      'Player XP': player.xp,
      'Energy': `${player.energy}/${player.maxEnergy}`,
      'Gold': player.gold
    });

    console.log('\n🎯 Skills:');
    console.table(
      Object.entries(player.skills).reduce((acc, [name, skill]) => {
        acc[name] = { Level: skill.level, XP: skill.xp };
        return acc;
      }, {})
    );

    const expectedMaxEnergy = window.game.player.calculateMaxEnergy(player.level, player.skills);
    console.log(`\n⚡ Expected Max Energy: ${expectedMaxEnergy}`);
    console.log(`⚡ Actual Max Energy: ${player.maxEnergy}`);
    console.log(expectedMaxEnergy === player.maxEnergy ? '✅ MATCH' : '❌ MISMATCH');
  },

  /**
   * Run All Tests
   */
  runAll() {
    console.clear();
    console.log('🧪 FAZENDARRPG - ENERGIA SYSTEM TEST SUITE');
    console.log('==========================================\n');

    const results = [];

    try {
      this.displayStats();
      results.push(this.testInitialValues());
      results.push(this.testCalculateFormula());
      results.push(this.testLevelUp());
      results.push(this.testSkillLevelUp());
      results.push(this.testSaveLoadPersistence());
      results.push(this.testOldSaveMigration());
      results.push(this.testEnergyClamp());

      console.log('\n' + '='.repeat(50));
      console.log('📊 TEST SUMMARY');
      console.log('='.repeat(50));

      const passed = results.filter(r => r.passed).length;
      const total = results.length;

      results.forEach(result => {
        console.log(`${result.passed ? '✅' : '❌'} ${result.test}`);
      });

      console.log('\n' + '='.repeat(50));
      console.log(`TOTAL: ${passed}/${total} tests passed`);
      console.log(passed === total ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED');
      console.log('='.repeat(50));

      this.displayStats();

      return { passed, total, results };

    } catch (error) {
      console.error('❌ TEST SUITE FAILED:', error);
      return { error: error.message };
    }
  },

  /**
   * Quick Test - Just check if energy system is working
   */
  quickTest() {
    console.log('⚡ Quick Energy System Test\n');

    const player = window.game.player.data;
    const expected = window.game.player.calculateMaxEnergy(player.level, player.skills);

    console.log(`Current: ${player.energy}/${player.maxEnergy}`);
    console.log(`Expected: ${expected}`);
    console.log(player.maxEnergy === expected ? '✅ OK' : '❌ ERROR');

    return player.maxEnergy === expected;
  }
};

// Auto-display instructions
console.log(`
%c🧪 ENERGIA SYSTEM TEST SUITE LOADED!

%cAvailable commands:
  energiaSystemTest.runAll()         - Run all tests
  energiaSystemTest.quickTest()      - Quick validation
  energiaSystemTest.displayStats()   - Show current stats
  energiaSystemTest.testLevelUp()    - Test level up
  energiaSystemTest.testSkillLevelUp() - Test skill level up

%cExample:
  energiaSystemTest.runAll()
`,
'color: #4CAF50; font-size: 16px; font-weight: bold;',
'color: #2196F3; font-size: 12px;',
'color: #FF9800; font-size: 12px;'
);
