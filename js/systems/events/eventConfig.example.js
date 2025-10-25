/**
 * Event Configuration - EXEMPLOS
 * Este arquivo mostra diferentes formas de configurar eventos
 *
 * NÃO EDITE ESTE ARQUIVO!
 * Edite o arquivo: eventConfig.js
 *
 * @version 0.0.19
 */

// ============================================
// EXEMPLO 1: HALLOWEEN ATIVO (PADRÃO ATUAL)
// ============================================
/*
const eventConfig = {
  halloween: {
    enabled: true,   // ✅ Evento disponível
    autoStart: true, // ✅ Inicia automaticamente
  },
  christmas: {
    enabled: false,
    autoStart: false,
  },
  easter: {
    enabled: false,
    autoStart: false,
  },
  newYear: {
    enabled: false,
    autoStart: false,
  },
};
*/

// ============================================
// EXEMPLO 2: TODOS OS EVENTOS DESATIVADOS
// ============================================
/*
const eventConfig = {
  halloween: {
    enabled: false,  // ❌ Desativado
    autoStart: false,
  },
  christmas: {
    enabled: false,
    autoStart: false,
  },
  easter: {
    enabled: false,
    autoStart: false,
  },
  newYear: {
    enabled: false,
    autoStart: false,
  },
};
*/

// ============================================
// EXEMPLO 3: HALLOWEEN DISPONÍVEL MAS NÃO AUTOMÁTICO
// (Precisa usar comando: FazendaRPG.debug.startHalloween())
// ============================================
/*
const eventConfig = {
  halloween: {
    enabled: true,   // ✅ Disponível
    autoStart: false, // ⚠️ Mas precisa comando manual
  },
  christmas: {
    enabled: false,
    autoStart: false,
  },
  easter: {
    enabled: false,
    autoStart: false,
  },
  newYear: {
    enabled: false,
    autoStart: false,
  },
};
*/

// ============================================
// EXEMPLO 4: MÚLTIPLOS EVENTOS ATIVOS (FUTURO)
// ============================================
/*
const eventConfig = {
  halloween: {
    enabled: true,   // 🎃 Halloween ativo
    autoStart: true,
  },
  christmas: {
    enabled: true,   // 🎄 Natal ativo
    autoStart: true,
  },
  easter: {
    enabled: true,   // 🐰 Páscoa ativo
    autoStart: true,
  },
  newYear: {
    enabled: false,  // 🎆 Ano novo desativado
    autoStart: false,
  },
};
*/

// ============================================
// EXEMPLO 5: ATIVAÇÃO POR MÊS (FUTURO)
// Quando implementarmos datas automáticas
// ============================================
/*
const eventConfig = {
  halloween: {
    enabled: true,
    autoStart: true,
    startDate: "2024-10-01",  // 1º de outubro
    endDate: "2024-11-01",    // 1º de novembro
  },
  christmas: {
    enabled: true,
    autoStart: true,
    startDate: "2024-12-01",  // 1º de dezembro
    endDate: "2025-01-01",    // 1º de janeiro
  },
  easter: {
    enabled: true,
    autoStart: true,
    startDate: "2024-03-15",  // 15 de março
    endDate: "2024-04-15",    // 15 de abril
  },
  newYear: {
    enabled: true,
    autoStart: true,
    startDate: "2024-12-31",  // 31 de dezembro
    endDate: "2025-01-07",    // 7 de janeiro
  },
};
*/

// ============================================
// COMO USAR
// ============================================
/*

1. NÃO edite este arquivo (.example.js)
2. Edite o arquivo: eventConfig.js
3. Copie um dos exemplos acima para lá
4. Ajuste conforme necessário
5. Salve e faça commit
6. Push para GitHub
7. Todos os jogadores terão a nova configuração!

COMANDOS:
git add js/systems/events/eventConfig.js
git commit -m "🎃 Atualizar configuração de eventos"
git push

*/

export default {};
