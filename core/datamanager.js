const DataManager = {

  rotas: [],

  arquivos: [

    "./dados/cohab.json",
    "./dados/gaibu.json",
    "./dados/engenhos.json",
    "./dados/itapuama.json",
    "./dados/calhetas.json",
    "./dados/centro-do-cabo.json",
    "./dados/bairro-baixo.json",
    "./dados/xareu.json",
    "./dados/interurbanas.json",
    "./dados/setor-4.json"

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