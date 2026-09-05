# 3S Química — Style Reference
> tinta editorial sobre papel técnico — serifada leve e placa naval profunda dão a
> um distribuidor de commodity química a cadência de um relatório, não de um anúncio.

**Tema:** claro, com placas escuras

A 3S Química trabalha num registro editorial sóbrio: papel branco, grafite quente
para o texto e uma placa naval profunda que substitui o near-black das referências
de origem. A linguagem vem da tipografia impressa — uma serifada de display em peso
300 carrega os títulos enquanto uma grotesca variável cuida de tudo que é
operacional, produzindo a cadência de um caderno técnico em vez de um painel SaaS.
Controles em pílula e cartões de raio pequeno mantêm a interface rápida e tátil. A
cor é racionada por função, não por gosto: azul identifica ação, amarelo pontua
seção sobre a placa, vermelho pertence exclusivamente à sinalização de risco
químico e verde exclusivamente ao WhatsApp. O hexágono do logo reaparece como
marcador de item e ícone de cartão, costurando marca e interface sem ilustração
decorativa.

## Colors

| Nome | Valor | Papel |
|------|-------|-------|
| Grafite | `#1A1D22` | Texto principal, títulos, rótulo de campo — 16,9:1 sobre papel |
| Papel | `#FFFFFF` | Canvas da página, superfície de cartão, fundo de seção padrão |
| Cinza médio | `#5A6270` | Texto secundário, apoio de seção, trilha de navegação — 6,15:1 |
| Cinza linha | `#DDE2E8` | Hairline de cartão, divisória de tabela, borda de campo |
| Cinza fundo | `#F5F7FA` | Fundo alternado de seção, para separar bandas sem mudar de tema |
| Azul 3S | `#1268E0` | Primária da marca: link, botão de ação, ícone hexagonal — 5,14:1 |
| Azul escuro | `#0D4FA3` | Hover de ação, texto sobre azul claro — 7,88:1 |
| Azul claro | `#EAF2FE` | Bloco de destaque, fundo de badge |
| Placa | `#071A2F` | Superfície escura profunda: hero, rodapé, painel de resultado |
| Placa 2 | `#0E2743` | Cartão apoiado sobre a placa — a vitrine |
| Placa linha | `#1B3A5C` | Hairline sobre a placa |
| Placa texto | `#DEE7F1` | Corpo sobre a placa — 14,0:1 |
| Placa apoio | `#93A9C4` | Apoio sobre a placa — 7,27:1, passa AAA |
| Amarelo 3S | `#F2C80F` | Acento de seção e foco. Convertido do CMYK do logo. **Só sobre a placa** (10,9:1); sobre papel dá 1,61:1 e é proibido |
| Vermelho segurança | `#D0021B` | **Exclusivo** de sinalização de risco químico — moldura GHS, alerta de manuseio. Nunca decorativo |
| Verde WhatsApp | `#3DDC7F` | **Exclusivo** de CTA de WhatsApp — 9,45:1 com grafite. Nunca "sucesso" genérico |

## Typography

### Fraunces — Display e títulos, peso 300, de 20px para cima
- **Auto-hospedada:** variável 300–600, subsets latin e latin-ext em woff2
- **Substituta:** Cormorant Garamond Light, ou Playfair Display 400
- **Peso:** 300 apenas. Peso maior transforma o caderno técnico em fachada de banco
- **Line height:** 1.08
- **Letter spacing:** 0.01em
- **Papel:** títulos, volumes de embalagem e o número da calculadora. O dado numérico
  em serifada é o que dá gravidade editorial a uma tabela de commodity

### Archivo — Interface e corpo
- **Auto-hospedada:** variável 100–900, subsets latin e latin-ext em woff2
- **Substituta:** Inter, ou a pilha de sistema
- **Pesos:** 400 corpo, 500 link de menu, 700 rótulo de campo e badge
- **Line height:** 1.5 no corpo
- **Letter spacing:** −0.005em no corpo. Tracking **negativo**, não positivo: a
  Archivo já tem espacejamento óptico próprio e abrir o tracking a desmancha
- **Papel:** navegação, corpo, botões, rótulos, células de tabela, legendas

### Montserrat — Lockup da marca
- **Auto-hospedada:** subsets latin e latin-ext
- **Peso:** 800, exclusivo do nome "3S Química" ao lado do símbolo hexagonal
- Não usar em mais nenhum lugar. É assinatura, não fonte de texto

### Type Scale

| Papel | Tamanho | Token |
|------|------|-------|
| legenda, nota | 12px | `--t-xs` |
| apoio, tabela, menu | 14px | `--t-sm` |
| corpo | 16px | `--t-base` |
| corpo grande, apoio de seção | 18px | `--t-md` |
| título de cartão | 20 → 24px | `--t-lg` |
| subtítulo | 24 → 32px | `--t-xl` |
| título de seção | 30 → 44px | `--t-2xl` |
| display do hero | 36 → 60px | `--t-3xl` |

Os quatro níveis do topo crescem por `clamp()`, sem media query. Foi a correção
mais necessária das referências de origem: display fixo em 72–88px quebra em
tela de celular, que é onde o síndico e o comprador de facilities abrem o site.

## Spacing & Layout

**Unidade base:** 4px

**Densidade:** confortável entre seções, densa dentro do componente

- **Largura máxima da página:** 1180px
- **Medida de leitura:** 62ch
- **Respiro de seção:** `clamp(3.5rem, 2rem + 7vw, 6.5rem)`
- **Padding de cartão:** 24px
- **Escala:** `--e-1` 4px a `--e-11` 96px

### Border Radius

- **botões, badge, flutuante:** 9999px
- **cartões, painéis:** 10px
- **campos, elementos internos:** 6px

## Components

### Botão primário
**Papel:** ação de maior ênfase

Pílula de 9999px, fundo Azul 3S, texto branco, peso 500, tracking −0.011em,
altura mínima 48px para alvo de toque. Hover vai para Azul escuro. Sobre a placa
inverte: fundo branco, texto na cor da placa.

### Botão WhatsApp
**Papel:** conversão principal do site inteiro

Pílula verde `#3DDC7F` com texto grafite — 9,45:1. É o único uso legítimo de verde
no sistema. O link é montado por `data-zap="origem"`, e cada origem gera uma
mensagem pré-preenchida diferente: é assim que se sabe de qual seção veio o
contato sem ferramenta paga.

### Botão contorno claro
**Papel:** ação secundária sobre a placa

Fundo transparente, borda de 1px branca, mesma pílula e mesmo padding do primário.

### Link de menu
**Papel:** navegação de topo

Archivo 14px peso 500 em grafite, sem fundo. Sublinhado amarelo de 2px que cresce
do centro no hover. O estado ativo é dirigido por `aria-current="page"` — peso 700,
cor Azul 3S e sublinhado inteiro — nunca por fundo invertido: a navbar é branca, e
amarelo sobre branco seria ilegível como texto, mas funciona como régua.

### Cartão
**Papel:** unidade de conteúdo repetida

Superfície branca, hairline `#DDE2E8`, raio 10px, padding 24px. **Sem sombra e sem
salto no hover.** Sobre a placa troca para superfície `#0E2743` com hairline
`#1B3A5C`. Pode abrir com um hexágono de 44px em Azul 3S.

### Rótulo de seção
**Papel:** etiqueta acima do título

Archivo 14px peso 700, caixa alta, tracking 0.08em, precedido de uma régua curta.
Cinza médio sobre papel; **amarelo da marca sobre a placa**.

### Badge
**Papel:** estado ou categoria inline

Pílula, 12px peso 700, caixa alta, tracking 0.05em, fundo Azul claro e texto Azul
escuro — 6,99:1.

### Pictograma GHS
**Papel:** sinalização de risco químico

Losango de moldura vermelha `#D0021B` sobre branco, 84px, com legenda em caixa
alta abaixo. É o único componente que pode usar vermelho. Não estilizar: o
pictograma é norma, não elemento gráfico.

### Painel de resultado da calculadora
**Papel:** saída da calculadora de abastecimento

Placa `#071A2F` com raio 10px. O número entra em Fraunces 300, grande, com
`tabular-nums`. Entrada em papel branco à esquerda, saída em placa à direita: a
mudança de superfície é o que separa pergunta de resposta.

### Campo de formulário
**Papel:** entrada de orçamento e de cobertura

Rótulo em Archivo 14px peso 700 grafite, campo com borda `#DDE2E8` e raio 6px,
dica em cinza médio abaixo. Mensagem de erro nomeia o que corrigir, não pede
desculpa.

### Tabela
**Papel:** ficha de embalagem, condição de entrega

Largura total, `border-collapse`, 14px, largura mínima de 30rem com rolagem
horizontal no próprio envoltório. Divisória por hairline, sem zebra e sem
contêiner de cartão.

### Faixa de provas do hero
**Papel:** três a quatro fatos abaixo do hero

Grade automática separada da headline por hairline branco a 18% de opacidade.
Rótulo em peso 700, fato em corpo. O número não é ampliado — o dado é parte da
frase, não manchete.

### WhatsApp flutuante
**Papel:** conversão persistente

Pílula verde fixa no canto inferior direito, altura mínima 52px. O rodapé reserva
respiro extra embaixo para que ela não cubra o link da política de privacidade.

## Do's and Don'ts

### Do
- Use Fraunces peso 300 em todo título e todo número de destaque — nunca título em Archivo
- Reserve o vermelho para sinalização GHS e o verde para WhatsApp; são cores de função, não da paleta
- Ponha o amarelo da marca só sobre a placa naval — 10,9:1 lá, 1,61:1 sobre papel
- Separe superfícies por hairline e por degrau de fundo, nunca por sombra
- Deixe o dado numérico dentro da frase; manchete numérica é linguagem de varejo
- Use `tabular-nums` em qualquer dígito que se alinhe em coluna
- Mantenha `js/config.js` como ponto único de verdade de telefone, embalagem e cobertura
- Escreva declarando capacidade: volume, faixa de pH, prazo, regime de vasilhame

### Don't
- Não introduza uma segunda cor quente — o cobre das referências de origem briga com o amarelo do logo
- Não use Fraunces abaixo de 20px, nem em peso acima de 300
- Não aplique tracking positivo na Archivo; ela já tem espacejamento óptico
- Não use sombra, elevação nem salto de hover em cartão
- Não pinte alerta de risco com a cor de marca, nem sucesso com o verde do WhatsApp
- Não prometa benefício na headline ("nunca mais fique sem"); commodity se vende por lastro
- Não publique foto placeholder: num fornecedor químico o placeholder custa mais credibilidade do que qualquer escolha tipográfica
- Não afirme concentração, registro ou tempo de mercado sem documento que sustente

## Elevation

O sistema não usa sombra. Todos os tokens de sombra estão em `none`, mantidos
apenas para não quebrar referência antiga. A separação espacial vem de hairline de
1px, de degrau de superfície — papel sobre cinza fundo, cartão claro sobre placa —
e de respiro vertical. Profundidade é implicada por contêiner, não por desfoque.

## Surfaces

- **Papel** (`#FFFFFF`) — canvas da página e fundo de seção padrão
- **Cinza fundo** (`#F5F7FA`) — banda alternada, para segmentar sem mudar de tema
- **Azul claro** (`#EAF2FE`) — bloco de destaque e fundo de badge
- **Placa** (`#071A2F`) — superfície invertida: hero, seção de operação, rodapé
- **Placa 2** (`#0E2743`) — cartão apoiado sobre a placa

## Imagery

A fotografia é documental, não publicitária: a operação real fotografada como é —
bombonas na doca, o utilitário carregado, o galpão, o vasilhame de 50L voltando na
troca. Luz natural, sem sobreposição, sem tratamento de catálogo. Num fornecedor
de commodity a foto é evidência de capacidade, e é isso que o comprador de
facilities está procurando. O hexágono do logo é o único motivo gráfico, usado
como ícone de cartão e marcador de lista em traço de 1,5px. Sem sistema de
ilustração, sem ícone colorido, sem gráfico decorativo. Pictograma GHS é norma
técnica e fica fora deste critério estético.

## Layout

Container centrado de 1180px, medida de leitura de 62ch. O hero é uma banda de
placa naval com headline serifada, apoio, faixa horizontal de imagem e as ações em
pílula, fechando com uma grade de provas separada por hairline. As seções seguintes
alternam papel branco, cinza fundo e placa, sem mudar a largura do container — o
ritmo vem do degrau de superfície e do respiro de `clamp(3.5rem, 2rem + 7vw,
6.5rem)`, não de mudança de grade. A navegação é uma barra branca fixa com
`backdrop-filter`, logo à esquerda e pílula de orçamento à direita. O rodapé é
placa naval, em grade de links com a razão social e o CNPJ na linha legal.

## Similar Brands

Comparação honesta, com o que de fato se aproxima e o que não:

- **Stripe** — a única aproximação sólida: hierarquia por escala tipográfica e
  hairline em vez de sombra, e cor racionada por função. Divergimos no gradiente,
  que aqui é proibido.
- **Notion** — compartilha o near-black quente no lugar do preto puro e a serifada
  leve reservada a momentos editoriais.
- **Mercury** — mesma disciplina de superfície escura única com um acento quente,
  e controles em pílula que somem no layout.

As referências de origem citavam ainda Linear, Vercel e Arc. Não sustentam a
comparação e foram descartadas: Linear é azul-arroxeado escuro com Inter e sem
serifada; Arc é notoriamente colorido e cheio de gradiente, o oposto do que o
sistema prega. Comparação errada em documento de marca vira briefing errado no
fornecedor seguinte.
