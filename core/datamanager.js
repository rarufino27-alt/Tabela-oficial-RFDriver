const DataManager = {
  rotas: [],

  arquivos: [
  "./data/Condomínio-Porto-do-Cabo.json",
  "./data/Cohab.json",
  "./data/Centro-do-Cabo.json",
  "./data/Shopping-Costa-Dourada.json",
  "./data/Engenho-Novo-Até-a-SETRE.json",
  "./data/Engenho-Novo-Até-Status-Posto.json",
  "./data/Engenho-Novo-Recanto-do-Paraíso.json",
  "./data/Loteamento-DHARMA-VILLE.json",
  "./data/Águia-American-Club-Br-101.json",
  "./data/Bairro-São-Francisco-Baixo.json"
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


