/* =========================================================================
   3S QUÍMICA — CALCULADORA DE DILUIÇÃO E ECONOMIA
   =========================================================================
   Base de cálculo (vem de CONFIG.calculo):
     Uma bombona de 50L rende 600L de solução a 1%.
     Logo, 1L de produto rende 12L de solução pronta a 1%.
     Em outra concentração, o rendimento é proporcional:
       0,5% → 24L por litro     2% → 6L por litro

   A calculadora existe para qualificar o contato antes da conversa:
   o volume calculado vai junto na mensagem do WhatsApp.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('calculadora');
  if (!form) return;                        // página sem calculadora

  var saida = document.getElementById('calc-resultado');
  var C = CONFIG.calculo;
  var mostrarPrecos = CONFIG.mostrarPrecos === 'sim';

  /* --- Formatação em português ---------------------------------------- */

  var moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  function litros(v) { return numero.format(Math.round(v)) + ' L'; }
  function pct(v)    { return numero.format(Math.round(v)) + '%'; }

  /* Concentração sem zero à toa: 1 vira "1%", 0.5 vira "0,5%". */
  var umaCasa = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  function conc(v) { return umaCasa.format(v) + '%'; }

  /* "Bombona 50L" → "bombona 50L", para caber no meio da frase sem
     maiúscula solta. O IBC continua em caixa alta, que é como se escreve. */
  function nomeNaFrase(nome) { return nome.replace(/^Bombona/, 'bombona'); }


  /* --- Leitura dos campos ---------------------------------------------- */

  function lerEntrada() {
    var idProduto = form.elements['embalagem'].value;
    var produto = CONFIG.produtos.filter(function (p) { return p.id === idProduto; })[0];
    var concentracao = parseFloat(form.elements['concentracao'].value);
    var consumo = parseFloat(form.elements['consumo'].value);

    return {
      produto: produto,
      concentracao: concentracao,
      // Consumo vazio ou zerado não é erro: a calculadora ainda mostra o
      // rendimento da embalagem, que já é informação útil.
      consumo: (isFinite(consumo) && consumo > 0) ? consumo : 0,
    };
  }


  /* --- O cálculo em si -------------------------------------------------- */

  function calcular(e) {
    // Litros de solução pronta por litro de produto concentrado.
    var fator = C.rendimentoPorLitroA1Pct / e.concentracao;

    // Quanto uma embalagem rende.
    var rendimento = e.produto.volume * fator;

    // Quantas embalagens por mês. Embalagem é item inteiro: arredonda para cima.
    var embalagensExatas = e.consumo > 0 ? e.consumo / rendimento : 0;
    var embalagensMes = Math.ceil(embalagensExatas);

    var r = {
      produto: e.produto,
      concentracao: e.concentracao,
      consumo: e.consumo,
      rendimento: rendimento,
      embalagensMes: embalagensMes,
      volumeMes: embalagensMes * e.produto.volume,
      temPreco: mostrarPrecos && typeof e.produto.preco === 'number',
    };

    if (r.temPreco) {
      r.custoPorLitroPronto = e.produto.preco / rendimento;
      r.custoMensal = embalagensMes * e.produto.preco;

      // Comparação com varejo, na MESMA concentração de uso final.
      // 1L de água sanitária de varejo a 2,5% rende 2,5L de solução a 1%.
      var rendimentoVarejo = C.varejo.teorAtivo / e.concentracao;
      r.custoVarejoPorLitroPronto = C.varejo.precoPorLitro / rendimentoVarejo;

      r.economiaPorLitro = r.custoVarejoPorLitroPronto - r.custoPorLitroPronto;
      r.economiaPercentual = (r.economiaPorLitro / r.custoVarejoPorLitroPronto) * 100;
      r.economiaMensal = e.consumo * r.economiaPorLitro;
    }

    return r;
  }


  /* --- Montagem do painel de resultado ---------------------------------- */

  function linha(rotulo, valor, modificador) {
    return '<li class="calc__linha' + (modificador ? ' ' + modificador : '') + '">' +
             '<span class="calc__rotulo">' + rotulo + '</span>' +
             '<span class="calc__valor" data-atualizado="true">' + valor + '</span>' +
           '</li>';
  }

  function render(r) {
    var html = '<h3>Seu consumo em números</h3><ul class="calc__linhas">';

    html += linha(
      'Cada ' + nomeNaFrase(r.produto.nome) + ' rende',
      litros(r.rendimento) + ' a ' + conc(r.concentracao)
    );

    if (r.consumo > 0) {
      html += linha('Embalagens por mês', numero.format(r.embalagensMes) + '×');
      html += linha('Produto concentrado por mês', litros(r.volumeMes));

      if (r.temPreco) {
        html += linha('Custo do litro pronto', moeda.format(r.custoPorLitroPronto));
        html += linha('Custo mensal estimado', moeda.format(r.custoMensal));
        html += linha(
          'Economia contra o varejo',
          moeda.format(Math.max(0, r.economiaMensal)) + '/mês',
          'calc__linha--destaque'
        );
      } else if (!mostrarPrecos) {
        html += linha('Preço', 'por faixa de volume');
      } else {
        html += linha('Preço', 'sob consulta');
      }
    }

    html += '</ul>';

    // Premissa sempre visível. Número de economia sem premissa à mostra é
    // número que o comprador técnico não acredita.
    if (r.consumo > 0 && r.temPreco) {
      html += '<p class="calc__premissa">Comparação com ' + C.varejo.descricao +
              ', na mesma concentração de uso (' + conc(r.concentracao) + '). ' +
              'Isso equivale a ' + pct(r.economiaPercentual) + ' a menos por litro de solução pronta. ' +
              'Preços de referência, sujeitos a volume e condição comercial.</p>';
    } else if (r.consumo === 0) {
      html += '<p class="calc__premissa">Informe o consumo mensal para ver quantas ' +
              'embalagens você usa e quanto economiza.</p>';
    }

    // O botão carrega o número calculado para dentro da conversa.
    html += '<a class="btn btn--claro btn--largo" id="calc-cta" style="margin-top:var(--e-5)">' +
              'Pedir orçamento no WhatsApp' +
            '</a>';

    if (r.produto.trocaVasilhame) {
      html += '<p class="calc__premissa"><strong>Atenção:</strong> ' +
              r.produto.nome + ' é vendida em regime de troca de vasilhame — ' +
              'a embalagem vazia é devolvida na entrega seguinte.</p>';
    }

    saida.innerHTML = html;

    // Liga o CTA com a mensagem já preenchida.
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
           ' de ' + r.produto.nome + ' por mês, o que dá cerca de ' + litros(r.consumo) +
           ' de solução pronta a ' + conc(r.concentracao) + '. ' +
           'Meu endereço de entrega é ___.';
  }


  /* --- Ligação com a tela ----------------------------------------------- */

  var jaRastreouUso = false;

  function atualizar() {
    var entrada = lerEntrada();
    if (!entrada.produto) return;
    render(calcular(entrada));

    // Registra o uso da calculadora uma vez por visita, não a cada tecla.
    if (!jaRastreouUso && entrada.consumo > 0) {
      jaRastreouUso = true;
      window.rastrear('uso_calculadora', {
        embalagem: entrada.produto.id,
        concentracao: entrada.concentracao,
      });
    }
  }

  // Recalcula a cada mudança. 'input' cobre digitação, seta e colar.
  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);

  // A calculadora não envia nada: Enter apenas recalcula.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    atualizar();
  });

  // Primeiro cálculo ao abrir a página, para o painel nunca ficar vazio.
  atualizar();
})();
