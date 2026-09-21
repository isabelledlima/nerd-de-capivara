const form = document.getElementById("form-chat");
const input = document.getElementById("input-pergunta");
const mensagensEl = document.getElementById("mensagens");

function adicionarMensagem(texto, autor) {
  const div = document.createElement("div");
  div.className = `msg ${autor}`;
  div.textContent = texto;
  mensagensEl.appendChild(div);
  mensagensEl.scrollTop = mensagensEl.scrollHeight;
  return div;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pergunta = input.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, "usuario");
  input.value = "";
  const carregando = adicionarMensagem("Pensando...", "bot");

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta }),
    });

    const dados = await resp.json();
    carregando.textContent = dados.resposta || dados.erro || "Erro desconhecido.";
  } catch (err) {
    carregando.textContent = "Não consegui falar com o servidor. Tente de novo.";
  }
});
