# Site da 3S Química

Site institucional e comercial da 3S Química (Nova Jocal Comércio de Produtos
de Limpeza LTDA), distribuidora de hipoclorito de sódio no Rio de Janeiro.

HTML, CSS e JavaScript puros. Sem build, sem CMS, sem dependência externa.
Para editar, basta abrir o arquivo em um editor de texto e salvar.

---

## ⚠️ Antes de publicar

O WhatsApp comercial já está configurado: **(21) 98449-2698**.
Faltam dois itens em **`js/config.js`**:

| O que | Onde no arquivo | Observação |
|---|---|---|
| E-mail comercial | `email:` | Está como `comercial@3squimica.com.br`. Confirme se esse endereço existe |
| Endereço público | `endereco:` | Opcional. Ver abaixo |

### Sobre o endereço

O campo está com **apenas cidade e estado**, de propósito. O site declara
"Rio de Janeiro — RJ", que é verdadeiro e não diverge do endereço do
rótulo. **Dá para publicar assim.**

Quando o endereço for definido — sede operacional ou endereço fiscal do
rótulo, decida com o contador — preencha `logradouro`, `bairro` e `cep`.
O rodapé passa a mostrar o endereço completo e clicável, abrindo a rota no
Google Maps, sem precisar mexer em mais nada.

Só não publique com endereço inventado: o campo alimenta o Schema.org, que
o Google indexa como endereço da empresa, e corrigir depois leva semanas de
reindexação.

Se um dia o número mudar, troque só a linha `whatsapp:` — ela alimenta as
seis páginas, o botão flutuante e o Schema.org de uma vez. Se você apagar o
número, o site volta a exibir uma tarja de aviso no topo.

---

## Estrutura dos arquivos

```
index.html                  Home (hero, calculadora, embalagens, cobertura,
                            confiabilidade, CTA final)
produtos.html               Ficha de cada embalagem + bloco de segurança
cobertura.html              Área de entrega, prazos, frete e pedido mínimo
empresa.html                Quem somos, em quatro parágrafos
orcamento.html              Formulário de proposta (6 campos)
politica-privacidade.html   Política de privacidade (LGPD)

css/style.css               Folha única, em camadas:
                            tokens → fontes → base → layout → componentes
                            → seções → movimento → pontos de quebra

js/config.js                ⭐ ÚNICO arquivo que você precisa editar
js/main.js                  Menu, WhatsApp, rodapé, cookies, analytics
js/calculadora.js           Calculadora de consumo (nº de embalagens)
js/cobertura.js             Verificador de bairro e lista de localidades
js/orcamento.js             Validação e envio do formulário

assets/logo-azul.svg        Logo azul, para fundo claro
assets/logo-branco.svg      Logo branco, para fundo azul
assets/logo-mono.svg        Logo monocromático (herda a cor do texto)
assets/ghs05.svg            Pictograma de corrosão
assets/ghs09.svg            Pictograma de perigo ao meio ambiente
assets/fonts/               Archivo e Montserrat, auto-hospedadas

robots.txt / sitemap.xml    SEO
```

---

## Como editar as coisas do dia a dia

Tudo abaixo se faz em **`js/config.js`**. Troque só o texto entre aspas ou os
números. Não apague vírgulas, chaves `{ }` nem colchetes `[ ]`.

### Trocar o número de WhatsApp

```js
whatsapp: '5521984492698',
```

Formato: 55 (Brasil) + DDD + número, só dígitos, sem espaço, parêntese ou
traço. Muda em todas as páginas de uma vez, inclusive no botão flutuante
e no Schema.org.

### Preço

O site **não exibe preço em nenhum lugar**, por decisão comercial. Valor é
passado por WhatsApp, conforme o volume. Não há campo de preço no config.

### Mudar o texto de uma embalagem

No bloco `produtos:`:

```js
{
  id: '50l',
  volume: 50,                    // usado no cálculo, não aparece na tela
  nome: 'Bombona 50L',
  aplicacao: 'Abastecimento mensal de operação contínua.',
  publico: 'Empresas de limpeza, condomínios grandes, conservação',
  embalagem: 'Venda em regime de troca — a bombona vazia é devolvida...',
  trocaVasilhame: true,          // true mostra o aviso de vasilhame
}
```

### Adicionar ou remover um bairro

No bloco `cobertura:`, copie uma linha inteira e troque o nome:

```js
{ nome: 'Tijuca',    tipo: 'bairro',    prazo: 'até 48h' },
{ nome: 'Icaraí',    tipo: 'bairro',    prazo: 'até 72h' },   // ← nova
```

- `tipo` aceita `'bairro'` ou `'município'` (muda em qual tabela aparece).
- `prazo` é texto livre: aparece exatamente como você escrever.

Para remover, apague a linha inteira, com a vírgula do final.

O verificador ignora acento e maiúscula: quem digitar "sao goncalo" acha
"São Gonçalo".

### Mudar o endereço

```js
endereco: {
  logradouro: 'Rua Exemplo, 100 — Galpão 2',
  bairro: 'Bonsucesso',
  cidade: 'Rio de Janeiro',
  uf: 'RJ',
  cep: '21040-000',
},
```

O endereço aparece no rodapé das seis páginas, **clicável**: abre a rota
no Google Maps em nova aba. O link é montado sozinho a partir dos campos
acima — você não precisa colar URL de mapa em lugar nenhum.

Se `logradouro` estiver vazio, o endereço continua visível mas deixa de
ser clicável. É proposital: mandar o comprador para uma rota que termina
no meio da cidade é pior do que não oferecer rota.

### Mudar pedido mínimo, frete ou horário

```js
entrega: {
  pedidoMinimo: 'A partir de 1 bombona de 50L, ou volume equivalente...',
  frete: '...',
  janela: '...',
},
```

O texto de `janela` aparece igual na home e na página Cobertura. Não escreva
valor em R$ em nenhum desses campos: o site não exibe preço.

### Mudar as mensagens que abrem no WhatsApp

No bloco `mensagens:`. Cada seção do site tem a sua, e é assim que você
descobre de onde veio o contato — basta ler a primeira frase da mensagem.

---

## Formulário de orçamento

O formulário funciona de três maneiras. Escolha uma:

**1. Netlify (mais simples).** Se hospedar na Netlify, já funciona sozinho.
Os envios aparecem no painel, em *Forms*. Configure a notificação por e-mail
em *Site settings → Forms → Form notifications*.

**2. Formspree.** Crie um formulário grátis em formspree.io, copie a URL do
endpoint e cole em `js/config.js`:

```js
formEndpoint: 'https://formspree.io/f/xxxxxxx',
```

**3. Sem nada configurado.** O site abre o programa de e-mail do próprio
visitante com tudo preenchido, e oferece o WhatsApp. Nada se perde, mas
depende do visitante clicar em enviar.

Em qualquer um dos casos, a tela de confirmação sempre oferece o WhatsApp
com o pedido já escrito.

---

## Analytics

Deixe em branco para não carregar nada. Para ligar, cole os identificadores:

```js
analytics: {
  ga4: 'G-XXXXXXXXXX',
  metaPixel: '123456789012345',
},
```

Os scripts só carregam **depois** do visitante aceitar os cookies, conforme
a LGPD. Se ele recusar, nada é carregado e o site continua funcionando igual.

Eventos já registrados:

| Evento | Quando dispara |
|---|---|
| `uso_calculadora` | Visitante usa a calculadora de diluição |
| `clique_whatsapp` | Qualquer botão de WhatsApp, com a origem junto |
| `consulta_cobertura` | Verificação de bairro, com o resultado |
| `envio_formulario` | Envio do formulário de orçamento |
| `clique_mapa` | Clique no endereço do rodapé |

O evento `consulta_preco` não existe: o site não tem página de preço.

---

## Publicar de graça

### Netlify — recomendado, porque o formulário funciona sozinho

**Pelo navegador, sem instalar nada:**

1. Entre em [app.netlify.com](https://app.netlify.com) e crie uma conta.
2. Clique em **Add new site → Deploy manually**.
3. Arraste a pasta inteira do site para a área indicada.
4. Em poucos segundos sai um endereço tipo `nome-aleatorio.netlify.app`.
5. Em **Site configuration → Change site name**, troque para `3squimica`.

**Ligar o domínio 3squimica.com.br:**

1. Vá em **Domain management → Add a domain** e digite `3squimica.com.br`.
2. A Netlify mostra os servidores de DNS dela.
3. No painel onde o domínio foi registrado (Registro.br, por exemplo),
   troque os servidores DNS pelos que a Netlify indicou.
4. Aguarde a propagação — costuma levar de 1 a 24 horas.
5. O certificado HTTPS é emitido sozinho, sem custo.

**Para atualizar depois:** arraste a pasta de novo em **Deploys**.

### Vercel — alternativa

1. Entre em [vercel.com](https://vercel.com) e crie uma conta.
2. **Add New → Project → Deploy** e envie a pasta (ou conecte o repositório
   do GitHub, se o site estiver versionado).
3. Framework Preset: **Other**. Não há comando de build.
4. Em **Settings → Domains**, adicione `3squimica.com.br` e siga as
   instruções de DNS que aparecerem.

Na Vercel o formulário **não** funciona sozinho: use o Formspree (opção 2
acima) ou o modo de reserva.

---

## Testar no seu computador antes de publicar

Abrir o arquivo com dois cliques funciona, mas o navegador bloqueia algumas
coisas. O certo é subir um servidor local. Com Python instalado:

```
cd pasta-do-site
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

---

## Decisões que não devem ser desfeitas sem conversar

Estas escolhas têm motivo comercial ou regulatório. Mudar sem saber o porquê
quebra alguma coisa.

**O site não exibe preço nem rendimento.** Preço é passado por WhatsApp,
conforme o volume. Rendimento em litros foi removido de todas as páginas.

**A calculadora mostra um número só: quantas embalagens por mês.** O fator
de diluição existe no código e não aparece na tela.

**A empresa não é descrita como fundada em 1967.** O sujeito da frase é
sempre a *cadeia familiar de fornecimento*, nunca a razão social nem a
marca. O CNPJ no rodapé é muito posterior a 1967, e quem cruzar as duas
informações precisa achar coerência. A menção aparece em exatamente dois
lugares: o selo do topo da home e um parágrafo da página Empresa.

**Não existe menção a responsável técnico nem a CRQ.**

**Não se escreve "entrega própria", "rota própria" nem "rota fixa".**

**Não existe link de telefone em lugar nenhum.** O atendimento é por
WhatsApp, em texto. Um botão "ligue agora" gera ligação que ninguém atende.

**O bloco de segurança fica só na página Produtos.** Foi removido da home.
Pictogramas GHS, aviso de não misturar com ácidos e amoniacais e referência
à FISPQ continuam lá.

**Vermelho aparece só no bloco de segurança química.** No setor químico,
vermelho é sinalização de risco. Usar vermelho em promoção ou botão anula a
sinalização. Todo botão principal é azul.

**O regime de troca de vasilhame do 50L aparece antes do botão de compra.**
Cliente que descobre depois devolve o pedido.

**O verificador de cobertura nunca responde "não atendemos".** Endereço fora
da lista recebe convite para consultar rota pelo WhatsApp. Rota nova se
combina; cliente perdido não volta.

**O formulário tem 6 campos e nenhum a mais.** Sem CPF, sem CNPJ obrigatório,
sem "como nos conheceu". Cada campo extra derruba a conversão.

**O site não diz "fabricamos", "fábrica", "produção própria" nem "formulação
própria"**, e não faz nenhuma alegação de eficácia ("elimina 99,9%",
"bactericida", "hospitalar", "aprovado pela ANVISA"). Também não publica
número de AFE ou registro. Enquanto a AFE não for emitida, a empresa se
descreve como **distribuidora** e **fornecedora**. O site é documento público
e indexado: alegação acima da situação regulatória pode ser usada em
fiscalização.

**A validade declarada é a do rótulo aprovado.** Sem estudo de estabilidade,
não afirme 12 meses.

**Produtos que ainda não podem aparecer:** linha de desinfetantes (Floral,
Lavanda, Fresh, Eucalipto), cloro gel, flotador, desengraxante e qualquer
produto de amônio quaternário. Só entram depois da AFE emitida.

---

## Observações técnicas

**Base de cálculo da calculadora.** O produto vendido tem **12% de cloro
ativo**. Diluído a 1% de uso final, 1L de produto rende 12L de solução
pronta. Daí sai o número de embalagens.

Esse cálculo **não aparece na tela**: a calculadora mostra só quantas
embalagens por mês. Rendimento, preço e economia foram removidos do site.

Se o teor do produto mudar, altere `teorAtivoProduto` em `js/config.js` —
o fator é recalculado sozinho.

**Pictogramas GHS.** Os SVGs em `assets/` são versões desenhadas para uso na
tela. Para rótulo impresso, use a arte oficial do GHS, não estes arquivos.

**Verde do WhatsApp.** Os CTAs usam `#25D366` (hover `#1DA851`) com texto em
grafite `#1A1D22`, não em branco. Branco sobre `#25D366` dá 1,98:1 e reprova
em AA; grafite dá 8,52:1. Para inverter, troque `color` em `.btn--zap` no
CSS — mas aí o site deixa de passar AA nos botões principais.

**Logo do rodapé.** Como o rodapé passou a ser branco, o rodapé usa
`logo-azul.svg` (Opção 1 do documento de correções). O `logo-branco.svg`
segue no projeto para uso sobre fundo azul.

**Fontes.** Archivo e Montserrat estão em `assets/fonts`, auto-hospedadas,
com `font-display: swap`. Nenhuma requisição sai para o Google.

**Acessibilidade.** O site funciona inteiro por teclado, tem foco visível,
respeita `prefers-reduced-motion` e anuncia o resultado da calculadora e do
verificador de cobertura por região `aria-live`.

**Imagens.** O site não usa foto. Se acrescentar alguma, salve em WebP,
declare `width` e `height` na tag e escreva um `alt` que descreva a imagem.
