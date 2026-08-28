/* =========================================================================
   3S QUÍMICA — CALCULADORA DE ABASTECIMENTO
   =========================================================================
   Entrada: consumo mensal de hipoclorito, em litros de produto. Não há
   conta de diluição — nem na tela, nem aqui.

   Sobre o consumo informado aplicamos a margem de segurança de
   CONFIG.calculo.margemSeguranca, para o abastecimento não terminar
   exatamente no fim do mês. A margem aparece escrita na tela: número
   inflado sem explicação o comprador descobre no primeiro pedido.

   O caminho principal é o fornecimento mensal. Pedido avulso continua
   disponível, em peso visual menor.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('calculadora');
  if (!form) return;                        // página sem calculadora

  var saida = document.getElementById('calc-resultado');
  var numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var MARGEM = CONFIG.calculo.margemSeguranca;

  // Embalagens da menor para a maior, para escolher a recomendada.
  var ESCALA = ['5l', '20l', '50l', 'ibc'];
  function porId(id) {
    return CONFIG.produtos.filter(function (p) { return p.id === id; })[0];
  }


  /* --- Recomendação -----------------------------------------------------
     Prefere a MAIOR embalagem — receber 60 bombonas de 5L é ruim para os
     dois lados —, mas só até onde o arredondamento não estoura o volume.

     Sem esse teto, quem consome 1.000L levaria 2 IBCs, ou seja 2.000L: o
     dobro, não os 20% de margem prometidos. O teto de 25% mantém a conta
     honesta com o que está escrito na tela.
     -------------------------------------------------------------------- */

  var TETO_SOBRA = 1.25;

  function recomendar(litrosPorMes) {
    for (var i = ESCALA.length - 1; i >= 0; i--) {
      var vol = porId(ESCALA[i]).volume;
      if (Math.ceil(litrosPorMes / vol) * vol <= litrosPorMes * TETO_SOBRA) {
        return ESCALA[i];
      }
    }
    return ESCALA[0];               // volume pequeno demais: fica na de 5L
  }


  /* --- Cálculo ---------------------------------------------------------- */

  function calcular() {
    // Litros de hipoclorito por mês, direto do campo. Sem conversão.
    var consumo = parseFloat(form.elements['consumo'].value);
    consumo = (isFinite(consumo) && consumo > 0) ? consumo : 0;

    // Volume com margem: é o que a empresa deve manter abastecido.
    var comMargem = consumo * (1 + MARGEM);

    var escolha = form.elements['embalagem'].value;   // 'auto' ou um id
    var recomendada = recomendar(comMargem);
    var id = (escolha === 'auto') ? recomendada : escolha;
    var produto = porId(id);

    var qtd = consumo > 0 ? Math.ceil(comMargem / produto.volume) : 0;

    // Quantas peças o mesmo volume daria na menor embalagem — o argumento
    // que justifica subir de formato.
    var qtdNaMenor = consumo > 0 ? Math.ceil(comMargem / porId('5l').volume) : 0;

    return {
      consumo: consumo,
      comMargem: comMargem,
      volumeContratado: qtd * produto.volume,
      produto: produto,
      quantidade: qtd,
      recomendada: recomendada,
      seguiuRecomendacao: id === recomendada,
      qtdNaMenor: qtdNaMenor,
      ganhaTrocandoDeFormato: id !== '5l' && qtdNaMenor > qtd * 3,
    };
  }


  /* --- Tela -------------------------------------------------------------- */

  function item(texto) { return '<li class="calc__ganho">' + texto + '</li>'; }

  function render(r) {
    if (r.consumo <= 0) {
      saida.innerHTML =
        '<p class="calc__rotulo">Informe seu consumo mensal</p>' +
        '<p class="calc__vazio">Quantos litros de hipoclorito sua operação ' +
        'compra por mês? Devolvemos o abastecimento indicado, já com margem ' +
        'para não faltar.</p>' +
        '<a class="btn btn--zap btn--largo" id="calc-cta" ' +
        'style="margin-top:var(--e-5)">Falar no WhatsApp</a>';
      ligarCta(r);
      return;
    }

    var html =
      '<p class="calc__rotulo">Abastecimento mensal recomendado</p>' +
      '<p class="calc__numero" data-atualizado="true">' + numero.format(r.quantidade) + '</p>' +
      '<p class="calc__unidade">' + nomeFlexionado(r) + ' por mês</p>' +
      '<p class="calc__margem">' + numero.format(r.volumeContratado) + ' L no mês — ' +
        'seu consumo de ' + numero.format(r.consumo) + ' L mais margem de segurança de ' +
        numero.format(MARGEM * 100) + '% (' + numero.format(Math.ceil(r.comMargem)) + ' L), ' +
        'fechado em embalagens inteiras.</p>';

    html += '<ul class="calc__ganhos">';
    html += item('<strong>Estoque garantido o mês inteiro.</strong> Sem hipoclorito, ' +
                 'a limpeza para — e equipe parada custa mais caro que a margem');
    html += item('<strong>Uma entrega por mês</strong>, em dia fixo, sem precisar ' +
                 'lembrar de pedir');
    if (r.ganhaTrocandoDeFormato) {
      html += item('O mesmo volume em bombonas de 5L seriam <strong>' +
                   numero.format(r.qtdNaMenor) + ' peças</strong> para receber e movimentar');
    }
    if (r.produto.trocaVasilhame) {
      html += item('Vasilhame trocado na entrega seguinte, sem acúmulo no estoque');
    }
    html += item('Volume reservado para você, mesmo em mês de pico');
    html += '</ul>';

    // Caminho principal.
    html += '<a class="btn btn--zap btn--largo" id="calc-cta">' +
              'Fechar fornecimento mensal no WhatsApp</a>';

    // Alternativa, em peso visual menor de propósito.
    html += '<a class="calc__secundario" id="calc-cta-avulso">' +
              'Prefiro um pedido avulso</a>';

    if (!r.seguiuRecomendacao) {
      html += '<p class="calc__nota">Para esse volume, o formato indicado seria ' +
              porId(r.recomendada).nome + '.</p>';
    }

    saida.innerHTML = html;
    ligarCta(r);
  }


  /* --- CTAs -------------------------------------------------------------- */

  function ligarCta(r) {
    ligar('calc-cta', mensagemMensal(r), 'calculadora_mensal', r);
    ligar('calc-cta-avulso', mensagemAvulsa(r), 'calculadora_avulso', r);
  }

  function ligar(id, extra, origem, r) {
    var el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('href', window.linkWhatsApp('calculadora', extra));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () {
      window.rastrear('clique_whatsapp', {
        origem: origem,
        embalagem: r.produto.id,
        quantidade_mes: r.quantidade,
      });
    });
  }

  /* "1 bombona de 50L" / "3 bombonas de 50L" / "4 IBCs de 1.000L" */
  function nomeFlexionado(r) {
    var muitos = r.quantidade !== 1;
    if (r.produto.id === 'ibc') return 'IBC' + (muitos ? 's' : '') + ' de 1.000L';
    return 'bombona' + (muitos ? 's' : '') + ' de ' + r.produto.volume + 'L';
  }

  function comoQuantidade(r) {
    return numero.format(r.quantidade) + ' ' + nomeFlexionado(r);
  }

  /* A mensagem leva o volume COM margem — é o abastecimento que sustenta o
     mês, não o mínimo que zera o estoque no dia 30. */
  function mensagemMensal(r) {
    if (r.consumo <= 0) {
      return 'Quero falar sobre fornecimento mensal de hipoclorito de sódio. ' +
             'Meu endereço de entrega é ___.';
    }
    return 'Quero fechar fornecimento mensal de ' + comoQuantidade(r) +
           ' por mês, o que dá ' + numero.format(r.volumeContratado) + ' L com margem. ' +
           'Meu endereço de entrega é ___.';
  }

  function mensagemAvulsa(r) {
    if (r.consumo <= 0) {
      return 'Quero um orçamento avulso de hipoclorito de sódio. ' +
             'Meu endereço de entrega é ___.';
    }
    return 'Quero um pedido avulso de ' + comoQuantidade(r) +
           '. Meu endereço de entrega é ___.';
  }


  /* --- Eventos ----------------------------------------------------------- */

  var jaRastreouUso = false;

  function atualizar() {
    var r = calcular();
    render(r);
    if (!jaRastreouUso && r.consumo > 0) {
      jaRastreouUso = true;
      window.rastrear('uso_calculadora', {
        embalagem: r.produto.id,
        recomendada: r.recomendada,
      });
    }
  }

  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);

  // A calculadora não envia nada: Enter apenas recalcula.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    atualizar();
  });

  atualizar();
})();
