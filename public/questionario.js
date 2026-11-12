
const formulario = document.getElementById("form-questionario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async function(event) {
  event.preventDefault();

  const dados = new FormData(formulario);

  // Organiza as respostas em um objeto
  const respostas = {
    q1: dados.get("q1"),
    q2: dados.get("q2"),
    q3: dados.get("q3"),
    q4: dados.get("q4"),
    q5: dados.get("q5")
  };

  const botao = formulario.querySelector(
    'button[type="submit"]'
  );

  botao.disabled = true;
  resultado.textContent = "Salvando respostas...";

  try {
    // Envia os dados para o servidor
    const resposta = await fetch("/api/respostas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(respostas)
    });

    const dadosServidor = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dadosServidor.erro || "Erro ao salvar respostas."
      );
    }

    let mensagem = "";

    if (dadosServidor.pontuacao >= 8) {
      mensagem = "Excelente! Você possui ótimos hábitos sustentáveis!";
    } else if (dadosServidor.pontuacao >= 5) {
      mensagem = "Muito bem! Você está no caminho certo!";
    } else {
      mensagem = "Você pode melhorar seus hábitos sustentáveis!";
    }

    resultado.textContent =
      `Respostas salvas com sucesso! ` +
      `Sua pontuação foi ${dadosServidor.pontuacao}/10. ` +
      mensagem;

    // Limpa o formulário após salvar
    formulario.reset();

  } catch (erro) {
    resultado.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});
