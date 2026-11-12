
async function carregarEstatisticas() {
  try {
    const resposta = await fetch("/api/estatisticas");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os dados.");
    }

    const dados = await resposta.json();

    document.getElementById("total").textContent = dados.total;
    document.getElementById("media").textContent =
      `${Number(dados.media).toFixed(1)}/10`;
    document.getElementById("alto").textContent = dados.alto;

    document.getElementById("valor-baixo").textContent = dados.baixo;
    document.getElementById("valor-medio").textContent = dados.medio;
    document.getElementById("valor-alto").textContent = dados.alto;

    // Calcula a largura das barras em porcentagem
    const total = dados.total || 1;

    document.getElementById("barra-baixa").style.width =
      `${(dados.baixo / total) * 100}%`;

    document.getElementById("barra-media").style.width =
      `${(dados.medio / total) * 100}%`;

    document.getElementById("barra-alta").style.width =
      `${(dados.alto / total) * 100}%`;

  } catch (erro) {
    document.getElementById("erro-dashboard").textContent =
      erro.message;
  }
}

carregarEstatisticas();
