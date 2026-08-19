# Estefani Sá — Landing Page

Landing page de captação de leads (recuperação de crédito para empresas de formatura), pronta para deploy na Vercel.

## Antes de publicar — pendências

1. **WhatsApp**: em `assets/js/main.js`, substitua `WHATSAPP_NUMBER` pelo número oficial (formato `55DDDNUMERO`, só dígitos). Está marcado com `TODO`.
2. **Recebimento dos leads**: os formulários enviam para `POST /api/lead` (função serverless em `api/lead.js`). Hoje ela apenas registra o lead nos logs da Vercel. Para receber por e-mail/CRM, integre um provedor (ex.: Resend, SendGrid) no bloco `TODO` do arquivo — ou conecte um banco (ex.: Supabase) se preferir.
3. Revise os textos de metadados em `index.html` (`<title>`, `og:image` com domínio final) após definir a URL de produção.

## Estrutura

```
index.html            página única, todas as 5 seções da copy
assets/css/styles.css estilos, tokens de cor/tipografia, animações
assets/js/main.js     menu, scroll reveal, máscara de telefone, envio dos forms
assets/fonts/         Playfair Display + Inter (variáveis, self-hosted, subset PT-BR)
assets/img/           logo oficial (versões clara/escura) e favicons
api/lead.js           função serverless (Vercel) que recebe os 2 formulários
vercel.json           build/output fixados + cache de assets + headers de segurança
```

> **Não existe `package.json` neste projeto — e isso é proposital.** O site é HTML/CSS/JS puro,
> sem etapa de build. Com um `package.json` presente e sem script `build`, a Vercel entende o
> projeto como Node, procura um diretório de saída que não existe e publica um deploy vazio —
> resultando em **404: NOT_FOUND** na raiz. Não adicione um `package.json` aqui.

## Deploy na Vercel

**Opção A — Dashboard (upload)**
1. Descompacte o ZIP. Você terá uma pasta contendo `index.html`, `assets/`, `api/` e `vercel.json`.
2. Acesse vercel.com → *Add New* → *Project* → *Deploy* (upload).
3. **Importante:** arraste a pasta que contém o `index.html` diretamente — não arraste uma pasta
   "pai" que contenha essa pasta dentro. O `index.html` precisa ficar na **raiz** do deploy.
   Se ele acabar em `alguma-pasta/index.html`, a raiz do site fica vazia e a Vercel devolve 404.
4. Framework Preset: *Other*. Build Command, Output Directory e Install Command ficam em branco
   (o `vercel.json` já fixa isso).
5. Deploy.

**Opção B — CLI (mais confiável)**
```bash
npm i -g vercel
cd <pasta-do-projeto>   # a pasta onde está o index.html
vercel        # deploy de preview
vercel --prod # publica em produção
```

### Se aparecer 404: NOT_FOUND
Quase sempre é uma destas duas causas:
1. O `index.html` não está na raiz do deploy (pasta aninhada) — veja o passo 3 acima.
2. Em *Project Settings → General*, o campo **Root Directory** está apontando para uma subpasta.
   Deixe-o vazio.

## Rodar localmente

```bash
npx serve .
```

## Design

- Paleta extraída da logo oficial (dourado/bronze) sobre fundo preto profundo, com seções claras alternadas para dar ritmo e leitura confortável.
- Tipografia: Playfair Display (serifada, títulos) + Inter (sans, corpo/UI), ambas auto-hospedadas — sem chamadas externas.
- Ilustração da balança em SVG original, alinhada à identidade visual (coroa do monograma), com leve animação de balanço.
- Animações de entrada por rolagem (fade/stagger), header que se torna sólido ao rolar, timeline da metodologia com linha "desenhada" ao entrar na tela.
- Dois formulários idênticos (dobra 1 e dobra 5, fundo branco), com validação, máscara de WhatsApp, honeypot anti-spam e estado de sucesso.
