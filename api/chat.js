// api/chat.js
// Função serverless da Vercel. Recebe a pergunta do usuário, monta um prompt
// com a base de fontes sobre capivaras e chama a API gratuita da Groq.
//
// A chave da API NUNCA fica no front-end: ela vive só aqui, como variável
// de ambiente (GROQ_API_KEY), configurada no painel da Vercel.

const fontes = require("../data/fontes.json");

function montarContexto() {
  return fontes
    .map((f) => `- [${f.tema}] ${f.conteudo} (Fonte: ${f.fonte})`)
    .join("\n");
}

const SYSTEM_PROMPT = `Você é um chatbot especialista em capivaras.
Responda SOMENTE com base nas informações da lista de fontes abaixo.
Se a pergunta não puder ser respondida com essas informações, diga
claramente que não tem essa informação na sua base, sem inventar dados.
Responda em português, de forma simpática e objetiva. Quando fizer sentido,
cite de qual fonte (URL) veio a informação.

FONTES:
${montarContexto()}`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Use o método POST." });
    return;
  }

  const { pergunta } = req.body || {};

  if (!pergunta || typeof pergunta !== "string") {
    res.status(400).json({ erro: "Envie um campo 'pergunta' em texto." });
    return;
  }

  try {
    const resposta = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: pergunta },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Erro da Groq:", detalhe);
      // DEBUG TEMPORÁRIO: mostra o motivo real na tela.
      // Depois que resolver, volte para: res.status(502).json({ erro: "Erro ao consultar a IA." });
      res.status(502).json({ erro: "Erro ao consultar a IA.", detalhe });
      return;
    }

    const dados = await resposta.json();
    const texto =
      dados?.choices?.[0]?.message?.content?.trim() ||
      "Não consegui gerar uma resposta agora.";

    res.status(200).json({ resposta: texto });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
