const DataManager = {
  rotas: [],

  arquivos: [
  "./data/condominio-porto-do-cabo.json",
  "./data/cohab.json",
  "./data/centro-do-cabo.json",
  "./data/shopping-costa-dourada.json",
  "./data/engenho-novo-ate-a-setre.json",
  "./data/engenho-novo-ate-status-posto.json",
  "./data/engenho-novo-recanto-do-paraiso.json",
  "./data/loteamento-dharma-ville.json",
  "./data/aguia-american-club-br-101.json",
  "./data/bairro-sao-francisco-Baixo.json"
],

  async carregar() {
    try {
      const respostas = await Promise.all(
        this.arquivos.map(a =>
          fetch(a).then(r => {
            if (!r.ok) throw new Error("Falha ao carregar " + a);
            return r.json();
          })
        )
      );

      this.rotas = respostas.flat();
      console.log("✅ Rotas carregadas:", this.rotas.length);
    } catch (e) {
      console.error("❌ Erro ao carregar rotas", e);
      throw e;
    }
  },

  listarOrigens() {
    const origens = [...new Set(this.rotas.map(r => r.origem))];
    return origens.sort();
  },

  listarDestinos(origem) {
    return this.rotas
      .filter(r => r.origem === origem)
      .map(r => r.destino);
  },

  buscarValor(origem, destino) {
    let rota = this.rotas.find(
      r => r.origem === origem && r.destino === destino
    );

    // rota invertida (ida/volta)
    if (!rota) {
      rota = this.rotas.find(
        r => r.origem === destino && r.destino === origem
      );
    }

    return rota ? rota.valor : null;
  }
};



