/* =========================================================================
   3S QUÍMICA — CALCULADORA DE CONSUMO
   =========================================================================
   Escopo reduzido de propósito. A tela mostra UMA coisa: quantas embalagens
   por mês. Não exibe rendimento, não exibe preço, não exibe economia.

   O fator de diluição continua no código, vindo de CONFIG.calculo:
     produto com 12% de cloro ativo, diluído a 1% de uso final,
     rende 12L de solução pronta por litro de produto.

   A calculadora existe para qualificar o contato antes da conversa:
   o número calculado vai junto na mensagem do WhatsApp.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('calculadora');
  if (!form) return;                        // página sem calculadora

  var saida = document.getElementById('calc-resultado');
  var numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  // Litros de solução pronta por litro de produto. Fica no código, some da tela.
  var FATOR = CONFIG.calculo.litrosPorLitroDeProduto;


  /* --- Leitura dos campos ---------------------------------------------- */

  function lerEntrada() {
    var idProduto = form.elements['embalagem'].value;
    var produto = CONFIG.produtos.filter(function (p) { return p.id === idProduto; })[0];
    var consumo = parseFloat(form.elements['consumo'].value);

    return {
      produto: produto,
      consumo: (isFinite(consumo) && consumo > 0) ? consumo : 0,
    };
  }


  /* --- O cálculo -------------------------------------------------------- */

  function calcular(e) {
    // Quanto uma embalagem rende, em litros de solução pronta.
    // Este número é usado, mas nunca mostrado.
    var rendimento = e.produto.volume * FATOR;

    // Embalagem é item inteiro: arredonda para cima.
    var embalagensMes = e.consumo > 0 ? Math.ceil(e.consumo / rendimento) : 0;

    return {
      produto: e.produto,
      consumo: e.consumo,
      embalagensMes: embalagensMes,
    };
  }


  /* --- Painel de resultado ---------------------------------------------- */

  function render(r) {
    var html = '';

    if (r.consumo > 0) {
      var unidade = r.embalagensMes === 1 ? 'embalagem' : 'embalagens';
      html +=
        '<p class="calc__rotulo">Seu consumo mensal equivale a</p>' +
        '<p class="calc__numero" data-atualizado="true">' +
          numero.format(r.embalagensMes) +
        '</p>' +
        '<p class="calc__unidade">' + unidade + ' de ' + r.produto.nome + ' por mês</p>';
    } else {
      html +=
        '<p class="calc__rotulo">Informe o consumo mensal</p>' +
        '<p class="calc__vazio">Preencha quantos litros de solução pronta sua ' +
        'equipe usa por mês para ver quantas embalagens isso dá.</p>';
    }

    html += '<a class="btn btn--zap btn--largo" id="calc-cta" style="margin-top:var(--e-5)">' +
              'Pedir orçamento no WhatsApp' +
            '</a>';

    if (r.produto.trocaVasilhame) {
      html += '<p class="calc__nota"><strong>Atenção:</strong> ' + r.produto.nome +
              ' é vendida em regime de troca de vasilhame — a embalagem vazia ' +
              'é devolvida na entrega seguinte.</p>';
    }

    saida.innerHTML = html;

    // O CTA carrega o número calculado para dentro da conversa.
    var cta = document.getElementById('calc-cta');
    cta.setAttribute('href', window.linkWhatsApp('calculadora', mensagemDoResultado(r)));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.addEventListener('click', function () {
      window.rastrear('clique_whatsapp', {
        origem: 'calculadora',
        embalagem: r.produto.id,
        embalagens_mes: r.embalagensMes,
      });
    });
  }

  /** Texto que vai junto na mensagem do WhatsApp. */
  function mensagemDoResultado(r) {
    if (r.consumo <= 0) {
      return 'Quero um orçamento de ' + r.produto.nome + ' para fornecimento mensal. ' +
             'Meu endereço de entrega é ___.';
    }
    var unidade = r.embalagensMes === 1 ? 'unidade' : 'unidades';
    return 'Preciso de aproximadamente ' + numero.format(r.embalagensMes) + ' ' + unidade +
           ' de ' + r.produto.nome + ' por mês. Meu endereço de entrega é ___.';
  }


  /* --- Ligação com a tela ----------------------------------------------- */

  var jaRastreouUso = false;

  function atualizar() {
    var entrada = lerEntrada();
    if (!entrada.produto) return;
    render(calcular(entrada));

    // Registra o uso uma vez por visita, não a cada tecla.
    if (!jaRastreouUso && entrada.consumo > 0) {
      jaRastreouUso = true;
      window.rastrear('uso_calculadora', { embalagem: entrada.produto.id });
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
