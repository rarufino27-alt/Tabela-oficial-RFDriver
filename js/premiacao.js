let DB = JSON.parse(localStorage.getItem("premiacao")) || {
  motoristas: [
    { nome: "João", registros: [] },
    { nome: "Carlos", registros: [] },
    { nome: "Pedro", registros: [] }
  ]
};

function salvarDB() {
  localStorage.setItem("premiacao", JSON.stringify(DB));
}

function carregarMotoristas() {
  const select = document.getElementById("motorista");
  select.innerHTML = "";

  DB.motoristas.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerText = m.nome;
    select.appendChild(opt);
  });
}

function salvar() {
  const i = document.getElementById("motorista").value;
  const data = document.getElementById("data").value;
  const viagens = parseInt(document.getElementById("viagens").value);

  if (!data || !viagens) return alert("Preencha tudo");

  DB.motoristas[i].registros.push({ data, viagens });

  salvarDB();
  atualizar();
}

function getSemana(dataStr) {
  const d = new Date(dataStr);
  const inicio = new Date(d);
  inicio.setDate(d.getDate() - d.getDay() + 1);

  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);

  return { inicio, fim };
}

function calcularSemanaAtual(motorista) {
  const hoje = new Date();
  const semana = getSemana(hoje);

  return motorista.registros
    .filter(r => {
      const d = new Date(r.data);
      return d >= semana.inicio && d <= semana.fim;
    })
    .reduce((t, r) => t + r.viagens, 0);
}

function calcularMesAtual(motorista) {
  const hoje = new Date();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();

  return motorista.registros
    .filter(r => {
      const d = new Date(r.data);
      return d.getMonth() === mes && d.getFullYear() === ano;
    })
    .reduce((t, r) => t + r.viagens, 0);
}

function atualizar() {
  const rankingSemana = DB.motoristas.map(m => ({
    nome: m.nome,
    total: calcularSemanaAtual(m)
  })).sort((a, b) => b.total - a.total);

  const rankingMes = DB.motoristas.map(m => ({
    nome: m.nome,
    total: calcularMesAtual(m)
  })).sort((a, b) => b.total - a.total);

  render("ranking-semana", rankingSemana);
  render("ranking-mes", rankingMes);
}

function render(id, lista) {
  const el = document.getElementById(id);
  el.innerHTML = "";

  lista.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "motorista";

    if (i === 0) div.classList.add("top1");
    if (i === 1) div.classList.add("top2");
    if (i === 2) div.classList.add("top3");

    div.innerHTML = `
      <span>${i + 1}º - ${m.nome}</span>
      <strong>${m.total} viagens</strong>
    `;

    div.onclick = () => verDetalhe(m.nome);

    el.appendChild(div);
  });
}

function verDetalhe(nome) {
  const motorista = DB.motoristas.find(m => m.nome === nome);

  let html = `<h3>${nome}</h3>`;

  motorista.registros.forEach(r => {
    html += `<p>${r.data} → ${r.viagens} viagens</p>`;
  });

  document.getElementById("detalhe").innerHTML = html;
}

carregarMotoristas();
atualizar();