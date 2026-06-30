# Content Creator Dashboard — CLAUDE.md

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 + CSS variables (sem Tailwind v3 `extend`) |
| UI primitivos | Radix UI + lucide-react (shadcn não foi usado — init falhou por rede) |
| Utilitários | clsx + tailwind-merge via `lib/utils.ts` |

## Estrutura de pastas

```
app/
  layout.tsx          — layout raiz: sidebar + main
  page.tsx            — Overview (página inicial)
  globals.css         — design tokens via CSS variables
  hook-vault/         — Hook Vault (hooks salvos, transcritos e templatizados)
  analytics/          — Analytics IG (views, saves, follows, heaters)
  concorrentes/       — Reels dos criadores seguidos, atualizado semanalmente
  agendador/          — Agendamento multi-plataforma + legenda auto-gerada
  calendario/         — Calendário preenchido por /script com hooks e ângulos
  em-alta/            — Notícias de IA de 12 fontes, marcadas por potencial de hook
components/
  sidebar.tsx         — Sidebar com perfil @seucreator + navegação
lib/
  utils.ts            — cn() helper (clsx + twMerge)
```

## Design tokens (globals.css)

O tema é 100% dark. Accent color: **terracota (#c96a3a)**.  
Todos os valores ficam em CSS variables em `:root`; nenhum `dark:` class é necessário.

| Variável | Uso |
|----------|-----|
| `--background` | Fundo da página (`#0d0d0d`) |
| `--card` | Cards e tabelas (`#161614`) |
| `--sidebar-bg` | Sidebar (`#111110`) |
| `--primary` | Accent terracota (`#c96a3a`) |
| `--border` | Bordas (`#2a2a27`) |
| `--muted-foreground` | Textos secundários (`#8a8a82`) |

## Convenções

- **Dados**: todos mockados inline em cada `page.tsx`. Quando ligar fontes reais, extrair para `lib/data/` ou `lib/api/`.
- **Componentes**: usar `style={{ ... }}` com CSS variables para cores — evita conflito com Tailwind purge e mantém dark mode consistente sem classe `dark:`.
- **Ícones**: lucide-react com `size={15}` e `strokeWidth={1.8}` por padrão.
- **Rotas**: cada página vive em `app/<slug>/page.tsx` (App Router convencional).

## Decisões tomadas

1. **shadcn/ui não inicializado** — o `npx shadcn init` falhou por restrição de rede do ambiente. Os primitivos Radix UI estão instalados manualmente e podem ser usados diretamente.
2. **CSS variables em vez de Tailwind config** — Tailwind v4 usa `@theme inline` em vez de `tailwind.config.js`; tokens declarados em `globals.css`.
3. **Sidebar sticky** — `position: sticky; top: 0; height: 100vh` para manter visível ao scroll.
4. **Fontes**: Geist Sans / Geist Mono via `next/font/google`.
