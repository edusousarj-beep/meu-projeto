/* =========================================================================
   3S QUÍMICA — CALCULADORA DE CONSUMO
   =========================================================================
   A calculadora não é um relatório: é um vendedor.

   O visitante informa só quanto consome. O site RECOMENDA a embalagem certa
   para aquele volume, mostra por que ela é melhor que o formato pequeno, e
   oferece o fornecimento mensal como caminho principal — pedido avulso fica
   como alternativa secundária, nunca como botão de mesmo peso.

   O fator de diluição continua no código, vindo de CONFIG.calculo:
     produto com 12% de cloro ativo, diluído a 1% de uso final,
     rende 12L de solução pronta por litro de produto.
   Rendimento, preço e economia não aparecem na tela.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('calculadora');
  if (!form) return;                        // página sem calculadora

  var saida = document.getElementById('calc-resultado');
  var numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var FATOR = CONFIG.calculo.litrosPorLitroDeProduto;

  // Embalagens da menor para a maior, para escolher a recomendada.
  var ESCALA = ['5l', '20l', '50l', 'ibc'];
  function porId(id) {
    return CONFIG.produtos.filter(function (p) { return p.id === id; })[0];
  }


  /* --- Recomendação -----------------------------------------------------
     Escolhe a maior embalagem que o consumo justifica. Comprar 60 bombonas
     de 5L por mês é ruim para os dois lados: o cliente movimenta 60 peças e
     nós entregamos 60 peças. A recomendação empurra para cima, mas nunca
     para um formato que o cliente não consome dentro do mês.
     -------------------------------------------------------------------- */

  function recomendar(litrosDeProdutoPorMes) {
    var escolhida = '5l';
    ESCALA.forEach(function (id) {
      // Só sobe de formato se consumir ao menos ~90% de uma embalagem no mês.
      if (litrosDeProdutoPorMes >= porId(id).volume * 0.9) escolhida = id;
    });
    return escolhida;
  }


  /* --- Cálculo ---------------------------------------------------------- */

  function calcular() {
    var consumo = parseFloat(form.elements['consumo'].value);
    consumo = (isFinite(consumo) && consumo > 0) ? consumo : 0;

    // Litros de produto concentrado por mês. Usado, nunca mostrado.
    var produtoMes = consumo / FATOR;

    var escolha = form.elements['embalagem'].value;   // 'auto' ou um id
    var recomendada = recomendar(produtoMes);
    var id = (escolha === 'auto') ? recomendada : escolha;
    var produto = porId(id);

    var qtd = consumo > 0 ? Math.ceil(produtoMes / produto.volume) : 0;

    // Quantas peças o mesmo volume daria na menor embalagem — é o argumento
    // que justifica subir de formato.
    var menor = porId('5l');
    var qtdMenor = consumo > 0 ? Math.ceil(produtoMes / menor.volume) : 0;

    return {
      consumo: consumo,
      produto: produto,
      quantidade: qtd,
      recomendada: recomendada,
      seguiuRecomendacao: id === recomendada,
      qtdNaMenor: qtdMenor,
      ganhaTrocandoDeFormato: id !== '5l' && qtdMenor > qtd * 3,
    };
  }


  /* --- Tela -------------------------------------------------------------- */

  function item(texto) {
    return '<li class="calc__ganho">' + texto + '</li>';
  }

  function render(r) {
    if (r.consumo <= 0) {
      saida.innerHTML =
        '<p class="calc__rotulo">Informe o consumo mensal</p>' +
        '<p class="calc__vazio">Preencha quantos litros de solução pronta sua ' +
        'equipe usa por mês. Devolvemos a embalagem indicada e a quantidade.</p>' +
        '<a class="btn btn--zap btn--largo" id="calc-cta" ' +
        'style="margin-top:var(--e-5)">Falar no WhatsApp</a>';
      ligarCta(r);
      return;
    }

    var html =
      '<p class="calc__rotulo">Para ' + numero.format(r.consumo) +
        ' L por mês, o abastecimento indicado é</p>' +
      '<p class="calc__numero" data-atualizado="true">' + numero.format(r.quantidade) + '</p>' +
      '<p class="calc__unidade">' + nomeFlexionado(r) + ' por mês</p>';

    // Os ganhos: é aqui que a calculadora deixa de informar e passa a vender.
    html += '<ul class="calc__ganhos">';
    html += item('<strong>Uma entrega por mês</strong>, na data que você combinar');

    if (r.ganhaTrocandoDeFormato) {
      html += item('O mesmo volume em bombonas de 5L seriam <strong>' +
                   numero.format(r.qtdNaMenor) + ' peças</strong> para receber e movimentar');
    }
    if (r.produto.trocaVasilhame) {
      html += item('Vasilhame trocado na entrega seguinte, sem acúmulo no estoque');
    }
    html += item('Volume garantido no mês, sem risco de faltar');
    html += '</ul>';

    // Caminho principal: fornecimento mensal.
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


  /* --- Ligação dos CTAs -------------------------------------------------- */

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

  /* "1 bombona de 50L" / "2 bombonas de 50L" / "4 IBCs de 1.000L" */
  function nomeFlexionado(r) {
    var muitos = r.quantidade !== 1;
    if (r.produto.id === 'ibc') return 'IBC' + (muitos ? 's' : '') + ' de 1.000L';
    return 'bombona' + (muitos ? 's' : '') + ' de ' + r.produto.volume + 'L';
  }

  function comoQuantidade(r) {
    return numero.format(r.quantidade) + ' ' + nomeFlexionado(r);
  }

  function mensagemMensal(r) {
    if (r.consumo <= 0) {
      return 'Quero falar sobre fornecimento mensal de hipoclorito de sódio. ' +
             'Meu endereço de entrega é ___.';
    }
    return 'Quero fechar fornecimento mensal de ' + comoQuantidade(r) +
           ' por mês. Meu endereço de entrega é ___.';
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
