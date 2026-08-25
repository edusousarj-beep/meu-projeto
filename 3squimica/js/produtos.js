/* =========================================================================
   3S QUÍMICA — TABELA DE PREÇOS DA PÁGINA /produtos
   =========================================================================
   Respeita a chave CONFIG.mostrarPrecos:
     'sim' → tabela com valor por embalagem e custo do litro pronto
     'nao' → bloco "preço por faixa de volume, consulte pelo WhatsApp"
   ========================================================================= */

(function () {
  'use strict';

  var alvo = document.getElementById('tabela-precos');
  if (!alvo) return;

  var moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  /* --- Preço escondido --------------------------------------------------- */

  if (CONFIG.mostrarPrecos !== 'sim') {
    alvo.innerHTML =
      '<div class="resposta resposta--atende">' +
        '<p class="resposta__titulo">Preço por faixa de volume.</p>' +
        '<p>O valor muda conforme o volume mensal e a frequência de entrega. ' +
          'Mande a embalagem e a quantidade que você usa por mês — respondemos ' +
          'com o preço fechado.</p>' +
        '<a class="btn btn--primario" id="preco-cta">Consultar preço no WhatsApp</a>' +
      '</div>';
    ligar('preco-cta', 'Quero saber o preço por faixa de volume.');
    return;
  }

  /* --- Tabela de preços -------------------------------------------------- */

  // Rendimento a 1%: base do briefing (50L rendem 600L).
  var fator = CONFIG.calculo.rendimentoPorLitroA1Pct;

  var linhas = CONFIG.produtos.map(function (p) {
    var rendimento = p.volume * fator;
    var temPreco = typeof p.preco === 'number';

    return '<tr>' +
      '<td><strong>' + p.nome + '</strong></td>' +
      '<td class="num">' + numero.format(rendimento) + ' L</td>' +
      '<td class="preco">' + (temPreco ? moeda.format(p.preco) : 'sob consulta') + '</td>' +
      '<td class="preco">' + (temPreco ? moeda.format(p.preco / rendimento) : '—') + '</td>' +
    '</tr>';
  }).join('');

  alvo.innerHTML =
    '<div class="tabela-envolucro">' +
      '<table class="tabela">' +
        '<caption class="apenas-leitor">Preço por embalagem e custo do litro de solução pronta a 1%</caption>' +
        '<thead><tr>' +
          '<th scope="col">Embalagem</th>' +
          '<th scope="col">Rende a 1%</th>' +
          '<th scope="col">Preço</th>' +
          '<th scope="col">Litro pronto</th>' +
        '</tr></thead>' +
        '<tbody>' + linhas + '</tbody>' +
      '</table>' +
    '</div>' +
    '<p class="nota" style="margin-top:var(--e-5)">' +
      'Valores para retirada ou para entrega a partir do pedido mínimo (' +
      CONFIG.entrega.pedidoMinimo + '), sujeitos a volume e frequência. ' +
      'IBC de 1.000L sob consulta. Contrato mensal fixa o preço no período combinado.' +
    '</p>' +
    '<a class="btn btn--primario" id="preco-cta" style="margin-top:var(--e-5)">' +
      'Fechar preço no WhatsApp</a>';

  ligar('preco-cta', 'Vi a tabela de preços no site e quero fechar o meu volume mensal.');

  /** Liga um CTA recém-criado ao WhatsApp com mensagem própria da seção. */
  function ligar(id, extra) {
    var cta = document.getElementById(id);
    if (!cta) return;
    cta.setAttribute('href', window.linkWhatsApp('produto', extra));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.addEventListener('click', function () {
      window.rastrear('clique_whatsapp', { origem: 'tabela_precos' });
    });
  }
})();
