# 🐹 Capivara Bot

Chatbot especialista em capivaras. Responde só com base nas fontes em
`data/fontes.json` — nada de invenção da IA.

## Estrutura

```
capivara-chatbot/
├── api/
│   └── chat.js          → function serverless (chama a IA)
├── data/
│   └── fontes.json       → BASE DE CONHECIMENTO (edite aqui!)
├── public/
│   ├── index.html         → tela do chat
│   ├── style.css          → visual (é aqui que você mexe no design)
│   └── script.js          → lógica do front-end
├── package.json
└── .env.example
```

## Como editar as fontes

Abra `data/fontes.json` e edite/adicione objetos no formato:

```json
{
  "id": 21,
  "tema": "Nome curto do assunto",
  "conteudo": "O texto que a IA pode usar para responder.",
  "fonte": "https://link-da-fonte-original.com"
}
```

Não precisa reescrever nada além disso — o `api/chat.js` lê o arquivo
inteiro automaticamente a cada pergunta.

## Como rodar/hospedar de graça na Vercel

1. **Crie a conta na Groq** (gratuita): https://console.groq.com → gere uma
   API key.
2. **Suba este projeto para um repositório no GitHub.**
3. Na Vercel (https://vercel.com), clique em "New Project" e importe o
   repositório.
4. Antes do deploy, vá em **Settings → Environment Variables** e adicione:
   - `GROQ_API_KEY` = a chave que você gerou na Groq
5. Clique em Deploy. Pronto — você recebe uma URL pública (ex:
   `capivara-bot.vercel.app`).

## Trocar de modelo de IA

Se quiser usar outro modelo gratuito da Groq (ou trocar para o Gemini),
edite a linha `model:` dentro de `api/chat.js`.

## Testando localmente (opcional)

```bash
npm install -g vercel
vercel dev
```

Isso sobe o projeto localmente simulando o ambiente da Vercel, incluindo
a função `/api/chat`.
