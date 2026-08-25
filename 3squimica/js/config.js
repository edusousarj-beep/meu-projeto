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

  // PREENCHER: endereço público que vai no Schema.org e no rodapé.
  // Decida com o contador se entra a sede operacional ou o endereço fiscal
  // do rótulo. Enquanto não decidir, fica só a cidade/estado — que é
  // verdadeiro e não cria divergência com o rótulo.
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
     3. PREÇOS
     --------------------------------------------------------------------- */

  // 'sim'  → mostra a tabela de preços na página /produtos e na calculadora
  // 'nao'  → troca por "preço por faixa de volume — consulte pelo WhatsApp"
  mostrarPrecos: 'sim',

  // Preço por embalagem, em reais. Use null para "sob consulta".
  // Para editar: troque só o número depois de "preco:".
  produtos: [
    {
      id: '5l',
      volume: 5,
      nome: 'Bombona 5L',
      preco: 22.90,
      aplicacao: 'Uso pontual e reposição de ponto de limpeza',
      publico: 'Condomínios pequenos, clínicas, salões, escritórios',
      embalagem: 'Bombona de polietileno com tampa lacrada. Sem devolução de vasilhame.',
      trocaVasilhame: false,
    },
    {
      id: '20l',
      volume: 20,
      nome: 'Bombona 20L',
      preco: 84.90,
      aplicacao: 'Consumo semanal de equipe de limpeza',
      publico: 'Terceirizadas de porte médio, hotelaria, cozinhas industriais',
      embalagem: 'Bombona de polietileno com tampa lacrada. Sem devolução de vasilhame.',
      trocaVasilhame: false,
    },
    {
      id: '50l',
      volume: 50,
      nome: 'Bombona 50L',
      preco: 179.00,
      aplicacao: 'Abastecimento mensal de operação contínua',
      publico: 'Facilities, condomínios grandes, empresas de conservação',
      embalagem: 'Venda em regime de troca de vasilhame: a bombona vazia é devolvida na entrega seguinte.',
      trocaVasilhame: true,
    },
    {
      id: 'ibc',
      volume: 1000,
      nome: 'IBC 1.000L',
      preco: null,                 // null = sob consulta
      aplicacao: 'Abastecimento industrial e reenvase por distribuidor',
      publico: 'Distribuidores, indústria, grandes contratos',
      embalagem: 'Contêiner IBC com gaiola metálica, em regime de comodato. Retorna na troca.',
      trocaVasilhame: true,
    },
  ],

  /* -----------------------------------------------------------------------
     4. BASE DE CÁLCULO DA CALCULADORA
     --------------------------------------------------------------------- */

  calculo: {
    // Referência validada do briefing: uma bombona de 50L rende 600L de
    // solução a 1%. Isso equivale a 12L de solução pronta para cada 1L de
    // produto concentrado, na concentração de 1%.
    rendimentoPorLitroA1Pct: 12,

    // Concentrações de uso final oferecidas no seletor, em %.
    concentracoes: [0.5, 1, 2],
    concentracaoPadrao: 1,

    // Referência de comparação com varejo. Ajuste se o preço de mercado
    // mudar. O site sempre mostra essa premissa na tela — não é número
    // escondido.
    varejo: {
      precoPorLitro: 2.50,       // R$ por litro de água sanitária de varejo
      teorAtivo: 2.5,            // % de cloro ativo típico do produto de varejo
      descricao: 'água sanitária de varejo (2,5% de cloro ativo, R$ 2,50/L)',
    },
  },

  /* -----------------------------------------------------------------------
     5. ÁREA DE ENTREGA
     --------------------------------------------------------------------- */
     // Para adicionar um bairro, copie uma linha inteira e troque o nome.
     // prazo: texto livre que aparece para o usuário.

  cobertura: [
    // --- Município do Rio de Janeiro ---
    { nome: 'Centro',              tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Bonsucesso',          tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Ramos',               tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Penha',               tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Olaria',              tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Méier',               tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Tijuca',              tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Vila Isabel',         tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Maracanã',            tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'São Cristóvão',       tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Madureira',           tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Cascadura',           tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Irajá',               tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Pavuna',              tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Copacabana',          tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Ipanema',             tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Leblon',              tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Botafogo',            tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Flamengo',            tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Laranjeiras',         tipo: 'bairro',    prazo: 'até 48h' },
    { nome: 'Barra da Tijuca',     tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Recreio dos Bandeirantes', tipo: 'bairro', prazo: 'até 72h' },
    { nome: 'Jacarepaguá',         tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Taquara',             tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Campo Grande',        tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Bangu',               tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Realengo',            tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Santa Cruz',          tipo: 'bairro',    prazo: 'até 72h' },
    { nome: 'Ilha do Governador',  tipo: 'bairro',    prazo: 'até 72h' },

    // --- Demais municípios da região metropolitana ---
    { nome: 'Niterói',             tipo: 'município', prazo: 'até 72h' },
    { nome: 'São Gonçalo',         tipo: 'município', prazo: 'até 72h' },
    { nome: 'Duque de Caxias',     tipo: 'município', prazo: 'até 48h' },
    { nome: 'São João de Meriti',  tipo: 'município', prazo: 'até 48h' },
    { nome: 'Nilópolis',           tipo: 'município', prazo: 'até 72h' },
    { nome: 'Mesquita',            tipo: 'município', prazo: 'até 72h' },
    { nome: 'Nova Iguaçu',         tipo: 'município', prazo: 'até 72h' },
    { nome: 'Belford Roxo',        tipo: 'município', prazo: 'até 72h' },
    { nome: 'Queimados',           tipo: 'município', prazo: 'a combinar' },
    { nome: 'Japeri',              tipo: 'município', prazo: 'a combinar' },
    { nome: 'Magé',                tipo: 'município', prazo: 'a combinar' },
    { nome: 'Itaboraí',            tipo: 'município', prazo: 'a combinar' },
    { nome: 'Maricá',              tipo: 'município', prazo: 'a combinar' },
    { nome: 'Itaguaí',             tipo: 'município', prazo: 'a combinar' },
    { nome: 'Seropédica',          tipo: 'município', prazo: 'a combinar' },
  ],

  // Condições de entrega exibidas na página /cobertura.
  entrega: {
    pedidoMinimo: 'R$ 250,00 em produto, ou 1 bombona de 50L',
    frete: 'Frete incluso para pedido acima do mínimo dentro da área listada. Abaixo do mínimo, retirada no local ou frete a combinar.',
    janela: 'Entregas de segunda a sexta, em horário comercial. Janela combinada por WhatsApp no fechamento do pedido.',
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
