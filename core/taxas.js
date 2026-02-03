/* =========================================================
   RF DRIVER — TABELA CENTRAL DE TAXAS
   Fonte única de regras de preço
   ========================================================= */

const Taxas = {

  /* ================= TIPO DE VIAGEM ================= */
  tipoViagem: {
    ida: 0,                 // sem acréscimo
    bateVolta: 1,         // +100% do valor base
    idaVolta: 1,            // +100% do valor base
    idaVoltaEspera: 1.2     // 2x + 10%
  },

/* ================= TAXA NOTURNA ================= */

noturno: {
  limite: 29,
  valorFixo: 5,
  percentual: 0.35
},

  /* ================= TAXAS FIXAS ================= */

  // Desvio simples (valor fixo)
  desvioRotaSimples: 5,

  // Volta da praia
  voltaPraia: 10,

  // Taxa de feira
  feira: 5,

  // Transporte de animal (fixo por porte)
  animal: {
    pequeno: 5,
    medio: 7,
    grande: 10,
    longa: 20
  },

/* ================= VEÍCULO 6 LUGARES ================= */

veiculo6Lugares: {
  percentual: 0.5
},

  /* ================= ESPERA ================= */
  espera: {
    blocoMinutos: 5,
    valorPorBloco: 3
  }

};
