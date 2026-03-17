const DataManager = {

  rotas: [],

  arquivos: [

    "./dados/rotas/cohab.json",
    "./dados/rotas/gaibu.json",
    "./dados/rotas/engenhos.json",
    "./dados/rotas/itapuama.json",
    "./dados/rotas/calhetas.json",
    "./dados/rotas/centro-do-cabo.json",
    "./dados/rotas/bairro-baixo.json",
    "./dados/rotas/xareu.json",
    "./dados/rotas/interurbanas.json",
    "./dados/rotas/setor-4.json"

  ],

  async carregar(){

    try{

      const respostas = await Promise.all(

        this.arquivos.map(a =>
          fetch(a + "?v=" + Date.now())
          .then(r => r.json())
        )

      )

      this.rotas = respostas.flat()

      this.criarIndice()

      console.log("Rotas carregadas:", this.rotas.length)

    }catch(e){

      console.error("Erro ao carregar rotas:",e)

    }

  },

  indice:{},

  criarIndice(){

    this.indice = {}

    this.rotas.forEach(r=>{

      if(!this.indice[r.origem]){
        this.indice[r.origem]={}
      }

      this.indice[r.origem][r.destino]=Number(r.valor)

      if(!this.indice[r.destino]){
        this.indice[r.destino]={}
      }

      this.indice[r.destino][r.origem]=Number(r.valor)

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