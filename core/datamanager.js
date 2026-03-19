const DataManager = {

  rotas: [],

  arquivos: [

    "./data/Padaria-de-Gilberto-Cruzeiro.json",
    "./data/aguia-american-club-br-101.json",
    "./data/bairro-baixo.json",
    "./data/bairro-alto.json",
    "./data/calhetas.json",
    "./data/centro-do-cabo.json",
    "./data/cohab.json",
    "./data/condominio-porto-do-cabo.json",
    "./data/dharma-ville.json",
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

      let dados = respostas.flat()

      // 🔥 VALIDAÇÃO + LIMPEZA
      dados = this.validarESanitizar(dados)

      this.rotas = dados

      this.criarIndice()

      console.log("✅ Rotas carregadas:", this.rotas.length)

    }catch(e){

      console.error("❌ Erro ao carregar rotas:", e)

    }

  },

  // 🔥 VALIDADOR PROFISSIONAL
  validarESanitizar(lista){

    const erros = []
    const avisos = []
    const vistos = new Set()
    const resultado = []

    lista.forEach((item, index)=>{

      // 1. Estrutura obrigatória
      if(
        !item ||
        typeof item.origem !== "string" ||
        typeof item.destino !== "string" ||
        item.valor === undefined ||
        typeof item.regiao !== "string"
      ){
        erros.push(`Item inválido no índice ${index}`)
        return
      }

      // 2. Sanitização
      const origem = item.origem.trim()
      const destino = item.destino.trim()
      const valor = Number(item.valor)

      // 3. Valor inválido
      if(isNaN(valor)){
        erros.push(`Valor inválido em ${origem} -> ${destino}`)
        return
      }

      // 4. Chave única (evita duplicado)
      const chave = origem.toLowerCase() + "|" + destino.toLowerCase()

      if(vistos.has(chave)){
        avisos.push(`Duplicado ignorado: ${origem} -> ${destino}`)
        return
      }

      vistos.add(chave)

      // 5. Auto relação (origem = destino)
      if(origem.toLowerCase() === destino.toLowerCase()){
        avisos.push(`Origem igual destino: ${origem}`)
      }

      // 6. Valores suspeitos
      if(valor <= 0){
        avisos.push(`Valor suspeito (<=0): ${origem} -> ${destino}`)
      }

      resultado.push({
        origem,
        destino,
        valor,
        regiao: item.regiao.trim()
      })

    })

    // 🔥 LOG FINAL
    if(erros.length){
      console.error("❌ ERROS GRAVES NO JSON:")
      erros.forEach(e => console.error(e))
    }

    if(avisos.length){
      console.warn("⚠️ AVISOS NO JSON:")
      avisos.forEach(a => console.warn(a))
    }

    console.log(`📊 Validação concluída: ${resultado.length} válidos / ${lista.length} total`)

    return resultado

  },

  indice:{},

  criarIndice(){

    this.indice = {}

    this.rotas.forEach(r=>{

      if(!this.indice[r.origem]){
        this.indice[r.origem] = {}
      }

      this.indice[r.origem][r.destino] = r.valor

      // 🔥 garante ida e volta
      if(!this.indice[r.destino]){
        this.indice[r.destino] = {}
      }

      this.indice[r.destino][r.origem] = r.valor

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
