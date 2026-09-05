# 3S Química — Sistema de Design

Fusão das duas referências fornecidas: **Getburnt** (editorial monocromático,
papel claro) e **Slash** (cofre meia-noite, acento cobre).

## A regra de fusão

As duas bases são ~80% o mesmo sistema — pílulas, hairlines, zero sombra,
serifada display + grotesca operacional, container ~1200px. Divergem só na
exposição: papel branco versus preto meia-noite.

> **Base clara, placas escuras.** O canvas é papel (Getburnt). Blocos
> técnicos, ficha de produto e prova de dados vão em placa escura (Slash) —
> o efeito "vitrine de museu" que o próprio Getburnt prescreve. Cobre é o
> único acento cromático, e só em eyebrow/label.

## Correções aplicadas às bases

| Origem | Problema | Correção |
|---|---|---|
| Getburnt | `--leading-caption: 21` sem unidade = 21× o font-size | razões unitless corretas (1.5, 1.2, 1.05…) |
| Getburnt | `border-radius: 1440px` (resíduo de export Figma) | `9999px` |
| Getburnt | tracking `+0.03em` uniforme na grotesca | Inter tem espacejamento óptico próprio: tracking **negativo**, conforme Slash |
| Getburnt | "sem cor" vs. badge "green-tinted" e botão "purple-ish" | contradição removida — cobre é o único acento |
| Getburnt | produto "Ozai" citado num doc da "Getburnt" | descartado |
| Ambos | sem estados de hover/focus/disabled | definidos |
| Ambos | sem escala responsiva (72–88px trava em mobile) | `clamp()` em todo o topo da escala |
| Ambos | sem breakpoints | 1024 / 768 / 520 |

## Tokens

**Papel** — `--paper #ffffff` · `--ink #1a1a17` · `--ash #5f5f5d`
**Placa** — `--obsidian #08080a` · `--carbon #121317` · `--graphite #1c1d22`
· `--slate #2e3038` · `--fog #9194a1` · `--bone #e2e3e9`
**Acento** — `--copper #cc9166` (eyebrow e label; nunca em botão, nunca em corpo)

**Tipografia** — Fraunces 300 para display ≥28px (substituto de Nyght Serif /
Ivy Presto, ambas comerciais). Inter 300–600 para todo o resto.
Nunca serifada abaixo de 28px. Nunca grotesca em headline.

**Forma** — pílula `9999px` em botões/inputs/tags · cartões `8px` · zero sombra,
separação por hairline e por degrau de superfície.

**Ritmo** — base 8px. Gap entre seções `clamp(72px, 10vw, 120px)`.
Denso dentro do componente, generoso entre seções.

## Contraste verificado

`--ash #5f5f5d` sobre papel ≈ **6,4:1** — passa AA, reprova AAA.
`--fog #9194a1` sobre `--obsidian` ≈ **7,4:1** — passa AA e AAA.
Valores aproximados do meu cálculo; confirme num verificador antes de usar
como argumento de conformidade.
