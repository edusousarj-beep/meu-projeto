/* =========================================================================
   3S QUÍMICA — ARQUIVO DE CONFIGURAÇÃO
   =========================================================================
   Este é o ÚNICO arquivo que precisa ser editado para trocar telefone,
   preços, bairros atendidos e textos comerciais.
   Não é preciso saber programar: altere apenas o que está entre aspas
   ou entre números. Não apague vírgulas, chaves { } ou colchetes [ ].

   >>> ANTES DE PUBLICAR, PREENCHA OS 3 ITENS MARCADOS COM "PREENCHER". <<<
   ========================================================================= */

const CONFIG = {

  /* -----------------------------------------------------------------------
     1. CANAIS DE ATENDIMENTO
     --------------------------------------------------------------------- */

  // Número de WhatsApp comercial em formato internacional, só números:
  // 55 (Brasil) + 21 (DDD) + 984492698.
  whatsapp: '5521984492698',

  // PREENCHER se houver outro: e-mail comercial do domínio publicado.
  email: 'comercial@3squimica.com.br',

  // Endereço público, usado no rodapé e no Schema.org.
  //
  // Está de propósito só com cidade e estado: é o que se pode afirmar sem
  // risco. Assim o site declara apenas "Rio de Janeiro — RJ", que é
  // verdadeiro e não diverge do endereço do rótulo.
  //
  // Quando o endereço for definido (decida com o contador entre a sede
  // operacional e o endereço fiscal do rótulo), preencha os campos abaixo.
  // O rodapé passa a exibir o endereço completo, clicável, abrindo a rota
  // no Google Maps — não é preciso mexer em mais nada.
  endereco: {
    logradouro: '',              // ex.: 'Rua Exemplo, 100 — Galpão 2'
    bairro: '',                  // ex.: 'Bonsucesso'
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '',                     // ex.: '21040-000'
  },

  // SAC dos rótulos. Fica em TEXTO SIMPLES, não clicável, separado do
  // canal comercial. Deixe vazio ('') para não exibir.
  sac: '',

  /* -----------------------------------------------------------------------
     2. DADOS DA EMPRESA (usados no rodapé e no Schema.org)
     --------------------------------------------------------------------- */

  empresa: {
    nomeFantasia: '3S Química',
    razaoSocial: 'Nova Jocal Comércio de Produtos de Limpeza LTDA',
    cnpj: '21.339.490/0001-25',
    dominio: 'https://3squimica.com.br',
  },

  /* -----------------------------------------------------------------------
     3. EMBALAGENS
     --------------------------------------------------------------------- */
     // O site não exibe preço. Valor é passado por WhatsApp, conforme volume.

  produtos: [
    {
      id: '5l',
      volume: 5,
      nome: 'Bombona 5L',
      aplicacao: 'Reposição de ponto de limpeza.',
      publico: 'Condomínios pequenos, clínicas, escritórios',
      embalagem: 'Bombona de PEAD com tampa lacrada. Sem devolução de vasilhame.',
      trocaVasilhame: false,
    },
    {
      id: '20l',
      volume: 20,
      nome: 'Bombona 20L',
      aplicacao: 'Consumo semanal de equipe em campo.',
      publico: 'Empresas de limpeza, hotelaria, cozinhas industriais, veterinárias e canis',
      embalagem: 'Bombona de PEAD com tampa lacrada. Sem devolução de vasilhame.',
      trocaVasilhame: false,
    },
    {
      id: '50l',
      volume: 50,
      nome: 'Bombona 50L',
      aplicacao: 'Abastecimento mensal de operação contínua.',
      publico: 'Empresas de limpeza, condomínios grandes, conservação, piscinas e clubes',
      embalagem: 'Venda em regime de troca — a bombona vazia é devolvida na entrega seguinte.',
      trocaVasilhame: true,
    },
    {
      id: 'ibc',
      volume: 1000,
      nome: 'IBC 1.000L',
      aplicacao: 'Abastecimento industrial e reenvase.',
      publico: 'Distribuidores, indústria, grandes contratos',
      embalagem: '',
      trocaVasilhame: false,
    },
  ],

  /* -----------------------------------------------------------------------
     4. BASE DE CÁLCULO DA CALCULADORA
     --------------------------------------------------------------------- */
     // O visitante informa o consumo de hipoclorito puro, em litros. Não há
     // conta de diluição na tela nem no código: o número que entra é o
     // volume de produto que ele compra.
     //
     // Sobre esse volume aplicamos uma margem de segurança, para o
     // abastecimento não terminar exatamente no fim do mês. Trocar 0.20 por
     // 0.15 reduz a margem para 15%.

  calculo: {
    margemSeguranca: 0.20,       // 20% acima do consumo informado
    teorAtivoProduto: 12,        // % de cloro ativo, para referência técnica
  },

  /* -----------------------------------------------------------------------
     5. ÁREA DE ENTREGA
     --------------------------------------------------------------------- */
     // Duas regiões, sem detalhar bairro e sem prazo. Também alimenta o
     // areaServed do Schema.org.

  cobertura: [
    { nome: 'Rio',        tipo: 'região' },
    { nome: 'Grande Rio', tipo: 'região' },
  ],

  // Condições de entrega exibidas na página /cobertura.
  entrega: {
    pedidoMinimo: 'A partir de 1 bombona de 50L, ou volume equivalente nas demais embalagens.',
    frete: 'Frete incluso para pedido acima do mínimo dentro da área atendida. Abaixo do mínimo, retirada no local ou frete a combinar.',
    janela: 'Entregas de segunda a sábado, em horário comercial. O dia da sua região é combinado por WhatsApp no fechamento do pedido.',
  },

  /* -----------------------------------------------------------------------
     6. FORMULÁRIO DE ORÇAMENTO
     --------------------------------------------------------------------- */

  // Deixe '' para o formulário usar o modo de reserva (abre o e-mail do
  // usuário já preenchido + oferece o WhatsApp). Se hospedar na Netlify,
  // o formulário já funciona sozinho pelo atributo data-netlify no HTML.
  // Para usar Formspree, cole aqui a URL do endpoint.
  // Ex.: 'https://formspree.io/f/xxxxxxx'
  formEndpoint: '',

  /* -----------------------------------------------------------------------
     7. ANALYTICS (opcional)
     --------------------------------------------------------------------- */
  // Deixe '' para não carregar nada. Os scripts só são carregados depois
  // do aceite de cookies, conforme a LGPD.

  analytics: {
    ga4: '',        // ex.: 'G-XXXXXXXXXX'
    metaPixel: '',  // ex.: '123456789012345'
  },

  /* -----------------------------------------------------------------------
     8. MENSAGENS PRÉ-PREENCHIDAS DO WHATSAPP
     --------------------------------------------------------------------- */
  // Cada origem gera uma mensagem diferente. É assim que se sabe de qual
  // seção veio o contato, sem ferramenta paga: basta ler a primeira frase.

  mensagens: {
    hero:        'Olá! Vim pelo site da 3S Química e quero falar sobre fornecimento de hipoclorito de sódio.',
    calculadora: 'Olá! Usei a calculadora do site da 3S Química.',
    produto:     'Olá! Vim pela página de produtos do site da 3S Química.',
    cobertura:   'Olá! Vim pelo verificador de cobertura do site da 3S Química e quero confirmar se vocês entregam no meu endereço.',
    recorrente:  'Olá! Quero falar sobre fornecimento recorrente mensal de hipoclorito de sódio.',
    ctaFinal:    'Olá! Vim pelo site da 3S Química e quero pedir um orçamento.',
    flutuante:   'Olá! Vim pelo site da 3S Química.',
    orcamento:   'Olá! Preenchi o formulário de orçamento no site da 3S Química.',
    empresa:     'Olá! Vim pela página institucional do site da 3S Química.',
  },
};

/* =========================================================================
   A PARTIR DAQUI É CÓDIGO. Não precisa editar.
   ========================================================================= */

// Detecta se o número de WhatsApp ainda é o de exemplo, para avisar quem
// publicou o site sem trocar. O aviso aparece só no rodapé e no console.
CONFIG.whatsappConfigurado = !/^55\d{2}0{6,}$/.test(CONFIG.whatsapp);

// Monta o endereço em uma linha, pulando os campos vazios.
CONFIG.enderecoLinha = (function () {
  const e = CONFIG.endereco;
  const partes = [e.logradouro, e.bairro, `${e.cidade} — ${e.uf}`, e.cep];
  return partes.filter(Boolean).join(', ');
})();

// Link de rota no Google Maps, montado com o mesmo endereço acima.
// Só existe quando há logradouro: mandar o comprador para uma rota que
// termina no meio da cidade é pior do que não oferecer rota nenhuma.
CONFIG.enderecoMapa = CONFIG.endereco.logradouro
  ? 'https://www.google.com/maps/dir/?api=1&destination=' +
    // Travessão vira hífen: alguns apps de mapa engasgam com "—".
    encodeURIComponent(CONFIG.enderecoLinha.replace(/\s—\s/g, ' - '))
  : '';
