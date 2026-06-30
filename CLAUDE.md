# Content Creator Dashboard — CLAUDE.md

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS v4 + CSS variables (`@theme inline` em `globals.css`) |
| UI primitivos | Radix UI + lucide-react instalados manualmente |
| Utilitários | clsx + tailwind-merge via `lib/utils.ts` → `cn()` |
| Fontes | Geist Sans / Geist Mono via `next/font/google` |

> **shadcn/ui não foi inicializado** — `npx shadcn init` falhou por restrição de rede do ambiente.
> Os primitivos Radix UI estão disponíveis e podem ser usados diretamente quando necessário.

---

## Estrutura de pastas

```
app/
  layout.tsx            — layout raiz: <Sidebar> + <main>
  page.tsx              — Overview (página inicial)
  globals.css           — design tokens via CSS variables
  hook-vault/page.tsx   — Hook Vault: hooks salvos, transcritos e templatizados
  analytics/page.tsx    — Analytics IG: views, saves, follows, DMs, heaters
  concorrentes/page.tsx — Top reels dos criadores seguidos, raspado toda semana
  agendador/page.tsx    — Agendamento multi-plataforma + legenda auto-gerada
  calendario/page.tsx   — Grade mensal com painel lateral de roteiro
  em-alta/page.tsx      — Notícias de IA de 12 fontes, classificadas por tag

components/
  sidebar.tsx                         — Sidebar sticky com @seucreator + nav
  hook-vault/
    hook-vault-client.tsx             — Feed filtrávelcom busca, filtros e sort
    type-badge.tsx                    — Badge colorido por tipo de hook
    use-hook-modal.tsx                — Modal "Usar este" com textarea de rascunho
  analytics/
    analytics-client.tsx              — Cards + heaters + tabela de todos os reels
    sparkline.tsx                     — Sparkline SVG puro (sem deps) com tooltip
  concorrentes/
    concorrentes-client.tsx           — Tabela expansível com hook/texto/transcrição
  agendador/
    agendador-client.tsx              — Formulário de agendamento + fila com filtros
    platform-chip.tsx                 — Chip colorido por plataforma (reutilizado no calendário)
  calendario/
    calendario-client.tsx             — Grade mensal navegável + barra de resumo
    side-panel.tsx                    — Painel lateral deslizante (roteiro + legenda)
  em-alta/
    em-alta-client.tsx                — Feed com tags, digest matinal e fontes

lib/
  utils.ts              — cn() helper
  data/
    hooks.ts            — 15 hooks mockados (Hook Vault)
    analytics.ts        — 90 dias de séries temporais + 10 reels mockados
    concorrentes.ts     — 35 reels de 7 criadores + metadados do scrape job
    agendador.ts        — Plataformas, MCP metadata, fila mockada, generateCaption()
    calendario.ts       — 15 posts de julho 2026 com roteiro completo por extenso
    em-alta.ts          — 20 itens de 12 fontes + digestJob + TAG_STYLE
```

---

## Design tokens (`globals.css`)

O tema é **100% dark**. Accent color: **terracota `#c96a3a`**.
Todos os valores ficam em CSS variables em `:root`; nenhum `dark:` class é usado.

| Variável | Valor | Uso |
|----------|-------|-----|
| `--background` | `#0d0d0d` | Fundo da página |
| `--card` | `#161614` | Cards, tabelas, painéis |
| `--muted` | `#1e1e1b` | Inputs, áreas de código, fundos secundários |
| `--sidebar-bg` | `#111110` | Sidebar |
| `--primary` | `#c96a3a` | Accent terracota (botões, bordas ativas, badges) |
| `--border` | `#2a2a27` | Bordas de cards e divisores |
| `--muted-foreground` | `#8a8a82` | Textos secundários, labels, metadados |
| `--sidebar-border` | `#222220` | Borda da sidebar |

---

## Convenções

### Cores
- Usar `style={{ color: "var(--primary)" }}` em vez de classes Tailwind para cores de tema.
  Evita conflito com purge e garante dark mode consistente sem `dark:`.
- Transparências via concatenação de hex: `"var(--primary)" + "22"` → `#c96a3a22`.

### Dados
- Todos os dados vivem em `lib/data/<pagina>.ts` — nunca hardcode na camada de UI.
- Cada arquivo exporta os dados, os tipos, e helpers de formatação (`fmt()`, `fmtDate()`, etc.).
- Para ligar fontes reais: substituir o array mockado por uma chamada de API em `lib/api/<pagina>.ts`
  e manter a mesma interface de tipos — a UI não muda.

### Componentes
- Páginas interativas são Client Components (`"use client"`) em `components/<slug>/<slug>-client.tsx`.
- O `app/<slug>/page.tsx` é um Server Component fino que apenas importa o client e exporta `metadata`.
- Ícones: lucide-react com `size={15}` e `strokeWidth={1.8}` por padrão.

### Jobs agendados (mockados)
- O **scrape de concorrentes** roda todo domingo às 06:00 (`concorrentes.ts → scrapeJob`).
- O **digest de Em Alta** roda todo dia às 07:00 (`em-alta.ts → digestJob`).
- Quando implementar de verdade, documentar o job em `lib/jobs.ts` com: schedule (cron),
  função disparada, dependências externas e tratamento de erro.

---

## Integrações e pontos de extensão

### MCP de publicação (Agendador)
Cada plataforma tem um MCP server mapeado em `lib/data/agendador.ts → platforms[]`:

| Plataforma | MCP Server | Método |
|------------|-----------|--------|
| Instagram | `instagram-graph-mcp` | `media.reels.publish` |
| TikTok | `tiktok-content-mcp` | `video.upload_and_post` |
| YouTube Shorts | `youtube-data-mcp` | `videos.insert (shorts)` |
| LinkedIn | `linkedin-share-mcp` | `ugcPosts.create` |

Para publicação real: instalar o MCP server correspondente, configurar o token nas env vars,
e substituir o `status: "agendado"` mockado pela chamada real ao método acima.

### Fontes de Em Alta
12 fontes definidas em `lib/data/em-alta.ts → sources[]`. Para fetch real:
criar `lib/jobs/fetch-trends.ts` que itera `sources`, chama cada RSS/API,
e persiste em banco (ou arquivo JSON em `lib/cache/trends.json`).

### Hook Vault ↔ Agendador ↔ Calendário
- **Hook Vault → Agendador**: botão "Usar este" no vault deve popular o campo `hook`
  do agendador. Hoje abre um modal local; integrar passando o hook via URL param
  (`/agendador?hook=<id>`) ou Context global.
- **Agendador → Calendário**: posts agendados em `agendador.ts → queue` e posts em
  `calendario.ts → posts` são arrays separados hoje. Unificar em `lib/data/posts.ts`
  como fonte única de verdade quando ligar backend.

---

## Decisões tomadas

1. **shadcn/ui não inicializado** — `npx shadcn init` falhou por restrição de rede.
   Radix UI instalado manualmente; componentes primitivos disponíveis se necessário.

2. **CSS variables em vez de `tailwind.config.js`** — Tailwind v4 usa `@theme inline`;
   todos os tokens em `globals.css`. Não criar `tailwind.config.js`.

3. **Sidebar sticky** — `position: sticky; top: 0; height: 100vh` via classe Tailwind
   `h-screen sticky top-0` na `<aside>` do `components/sidebar.tsx`.

4. **Sparkline em SVG puro** — sem Recharts ou Chart.js para evitar bundle pesado.
   O componente `components/analytics/sparkline.tsx` renderiza path + área + tooltip
   interativo sem nenhuma dependência além do React.

5. **Heater = 2× mediana de views dos últimos 30 dias** — calculado em runtime em
   `lib/data/analytics.ts`. Alterar o multiplicador lá (`* 2`) para ajustar o threshold.

6. **Classificação de Em Alta** — tag (`potencial de hook` / `explicar` / `pular`) é
   atribuída manualmente nos dados mockados com `tagReason` explicando o critério.
   Para automação real: chamar um modelo (ex: Claude via API) com o título + resumo
   e pedir classificação estruturada em JSON.

7. **Painel lateral do Calendário** — slide-in via `translateX` CSS (sem biblioteca de
   drawer). Fecha com `Escape`, clique no backdrop ou botão `×`. Scroll independente
   do conteúdo principal.

8. **Re-classificação manual no Em Alta** — o usuário pode mudar a tag de qualquer item
   clicando nos botões de ícone. Estado local por item (`useState` no `FeedItem`).
   Para persistir: salvar em `localStorage` ou endpoint `PATCH /api/trends/:id/tag`.

9. **`generateCaption()` determinístico** — função pura em `lib/data/agendador.ts` que
   combina hook + ângulo + CTA com emoji por ângulo. Para IA real: substituir por
   chamada `anthropic.messages.create()` com prompt estruturado.

10. **Dados de concorrentes separados do agendador** — `lib/data/concorrentes.ts` e
    `lib/data/agendador.ts` são independentes hoje. O botão "Salvar no Hook Vault"
    na página de Concorrentes usa estado local; integrar com o array de `hooks.ts`
    quando houver backend.
