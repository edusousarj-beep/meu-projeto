# Site da 3S Química

Site institucional e comercial da 3S Química (Nova Jocal Comércio de Produtos
de Limpeza LTDA), distribuidora de hipoclorito de sódio no Rio de Janeiro.

HTML, CSS e JavaScript puros. Sem build, sem CMS, sem dependência externa.
Para editar, basta abrir o arquivo em um editor de texto e salvar.

---

## ⚠️ Antes de publicar

Abra o arquivo **`js/config.js`** e preencha estes três itens. Enquanto o
primeiro não for preenchido, aparece uma tarja amarela no topo do site
avisando que a configuração está pendente.

| O que | Onde no arquivo | Observação |
|---|---|---|
| Número de WhatsApp | `whatsapp:` | Só números: 55 + DDD + número. Ex.: `'5521987654321'` |
| E-mail comercial | `email:` | Use um e-mail do domínio publicado |
| Endereço público | `endereco:` | Decida com o contador: sede operacional ou endereço fiscal do rótulo |

O número que vem no arquivo (`5521000000000`) é inválido de propósito, para
não cair no WhatsApp de um terceiro por engano.

---

## Estrutura dos arquivos

```
index.html                  Home (hero, calculadora, embalagens, cobertura,
                            confiabilidade, segurança, CTA final)
produtos.html               Catálogo com ficha de cada embalagem e preços
cobertura.html              Área de entrega, prazos, frete e pedido mínimo
empresa.html                Quem somos, história e responsabilidade técnica
orcamento.html              Formulário de proposta (6 campos)
politica-privacidade.html   Política de privacidade (LGPD)

css/style.css               Folha única, em camadas:
                            tokens → fontes → base → layout → componentes
                            → seções → movimento → pontos de quebra

js/config.js                ⭐ ÚNICO arquivo que você precisa editar
js/main.js                  Menu, WhatsApp, rodapé, cookies, analytics
js/calculadora.js           Calculadora de diluição e economia
js/cobertura.js             Verificador de bairro e lista de rotas
js/produtos.js              Tabela de preços
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
whatsapp: '5521987654321',
```

Muda em todas as páginas de uma vez, inclusive no botão flutuante.

### Mudar preços

Procure o bloco `produtos:` e altere o valor depois de `preco:`.
Use ponto como separador decimal (`179.00`, não `179,00`).

```js
{
  id: '50l',
  volume: 50,
  nome: 'Bombona 50L',
  preco: 179.00,        // ← só este número
  ...
}
```

Para deixar uma embalagem como "sob consulta", escreva `preco: null`.

### Esconder todos os preços

```js
mostrarPrecos: 'nao',
```

A tabela some e no lugar aparece "preço por faixa de volume, consulte pelo
WhatsApp". A calculadora deixa de mostrar custo e economia.

Para mostrar de novo, volte para `'sim'`.

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

### Mudar pedido mínimo, frete ou horário

```js
entrega: {
  pedidoMinimo: 'R$ 250,00 em produto, ou 1 bombona de 50L',
  frete: '...',
  janela: '...',
},
```

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

**Não existe link de telefone em lugar nenhum.** O atendimento é por
WhatsApp, em texto. Um botão "ligue agora" gera ligação que ninguém atende.

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

**Base de cálculo da calculadora.** Uma bombona de 50L rende 600L de solução
a 1% — ou seja, 12L de solução pronta por litro de produto. As outras
concentrações são proporcionais (0,5% rende o dobro; 2%, a metade). Para
mudar a base, altere `rendimentoPorLitroA1Pct` em `js/config.js`.

**Comparação com o varejo.** Usa água sanitária de varejo a 2,5% de cloro
ativo, a R$ 2,50/L, na mesma concentração de uso. Essa premissa aparece
escrita na tela, embaixo do resultado — número de economia sem premissa à
vista não convence comprador técnico. Ajuste em `calculo.varejo`.

**Pictogramas GHS.** Os SVGs em `assets/` são versões desenhadas para uso na
tela. Para rótulo impresso, use a arte oficial do GHS, não estes arquivos.

**Fontes.** Archivo e Montserrat estão em `assets/fonts`, auto-hospedadas,
com `font-display: swap`. Nenhuma requisição sai para o Google.

**Acessibilidade.** O site funciona inteiro por teclado, tem foco visível,
respeita `prefers-reduced-motion` e anuncia o resultado da calculadora e do
verificador de cobertura por região `aria-live`.

**Imagens.** O site não usa foto. Se acrescentar alguma, salve em WebP,
declare `width` e `height` na tag e escreva um `alt` que descreva a imagem.
