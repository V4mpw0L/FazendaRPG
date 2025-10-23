/**
 * Event Configuration
 * Configure quais eventos devem estar ativos no jogo
 *
 * Para ATIVAR um evento: mude para true
 * Para DESATIVAR um evento: mude para false
 *
 * @version 1.0.0
 */

const eventConfig = {
  /**
   * Evento de Halloween
   * 🎃 Abóboras aparecem na tela e dão energia + ouro ao clicar
   */
  halloween: {
    enabled: true,  // ← MUDE AQUI: true = ATIVO | false = DESATIVO
    autoStart: true, // Inicia automaticamente ao carregar o jogo
  },

  /**
   * Evento de Natal (futuro)
   * 🎄 Presentes e decorações natalinas
   */
  christmas: {
    enabled: false,
    autoStart: false,
  },

  /**
   * Evento de Páscoa (futuro)
   * 🐰 Ovos escondidos pela fazenda
   */
  easter: {
    enabled: false,
    autoStart: false,
  },

  /**
   * Evento de Ano Novo (futuro)
   * 🎆 Fogos de artifício e bônus
   */
  newYear: {
    enabled: false,
    autoStart: false,
  },
};

export default eventConfig;
