const DataManager = {

  rotas: [],

  arquivos: [

    "./data/Padaria-de-Gilberto-Cruzeiro.json",
    "./data/aguia-american-dub-br-101.json",
    "./data/bairro-baixo.json",
    "./data/calhetas.json",
    "./data/centro-do-cabo.json",
    "./data/cohab.json",
    "./data/condominio-porto-do-cabo.json",
    "./data/dharma-ville.json",
    "./data/engenhos.json",
    "./data/enseadas.json",
    "./data/gaibu.json",
    "./data/interurbanas.json",
    "./data/itapuama.json",
    "./data/lote-garapu2-lote-dona-amara.json",
    "./data/setor-4.json",
    "./data/shopping-costinha.json",
    "./data/xareu.json"

  ],

  async carregar(){

    try{

      const respostas = await Promise.all(

        this.arquivos.map(a =>
          fetch(a + "?v=" + Date.now())
          .then(r => {

            if(!r.ok){
              throw new Error("Falha ao carregar " + a)
            }

            return r.json()

          })
        )

      )

      this.rotas = respostas.flat()

      this.criarIndice()

      console.log("Rotas carregadas:", this.rotas.length)

    }catch(e){

      console.error("Erro ao carregar rotas:", e)

    }

  },

  indice:{},

  criarIndice(){

    this.indice = {}

    this.rotas.forEach(r=>{

      if(!this.indice[r.origem]){
        this.indice[r.origem] = {}
      }

      this.indice[r.origem][r.destino] = Number(r.valor)

      if(!this.indice[r.destino]){
        this.indice[r.destino] = {}
      }

      this.indice[r.destino][r.origem] = Number(r.valor)

    })

  },

  listarOrigens(){

    return Object.keys(this.indice).sort()

  },

  listarDestinos(origem){

    if(!this.indice[origem]) return []

    return Object.keys(this.indice[origem]).sort()

  },

  buscarValor(origem,destino){

    if(this.indice[origem] && this.indice[origem][destino]){
      return this.indice[origem][destino]
    }

    return null

  }

}
