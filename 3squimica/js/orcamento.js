/* =========================================================================
   3S QUÍMICA — FORMULÁRIO DE ORÇAMENTO
   =========================================================================
   Seis campos, nada além disso. Cada campo extra derruba conversão.

   O envio tenta, nesta ordem:
     1. Endpoint configurado em CONFIG.formEndpoint (ex.: Formspree)
     2. Netlify Forms — funciona sozinho se o site estiver na Netlify
     3. Modo de reserva: abre o e-mail do usuário já preenchido

   Em qualquer um dos casos, a confirmação sempre oferece o WhatsApp,
   que é o canal principal.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('form-orcamento');
  if (!form) return;

  var confirmacao = document.getElementById('orcamento-confirmacao');
  var botao = form.querySelector('button[type="submit"]');

  /* --- Validação -------------------------------------------------------- */
  /* Mensagem explica o que houve e como resolver. Sem "desculpe". */

  var REGRAS = {
    nome:      { rotulo: 'Nome',      erro: 'Escreva seu nome para sabermos com quem falamos.' },
    empresa:   { rotulo: 'Empresa',   erro: 'Informe a empresa ou o condomínio que vai receber.' },
    whatsapp:  { rotulo: 'WhatsApp',  erro: 'Informe o WhatsApp com DDD. É por onde respondemos.' },
    endereco:  { rotulo: 'Endereço',  erro: 'Informe ao menos o bairro e a cidade da entrega.' },
    demanda:   { rotulo: 'Demanda',   erro: 'Diga a embalagem e o volume que você usa por mês.' },
  };

  function campoDe(input) { return input.closest('.campo'); }

  function mostrarErro(input, mensagem) {
    var caixa = campoDe(input);
    var alvo = caixa.querySelector('.campo__erro');
    input.setAttribute('aria-invalid', 'true');
    if (alvo) alvo.textContent = mensagem;
  }

  function limparErro(input) {
    var caixa = campoDe(input);
    var alvo = caixa.querySelector('.campo__erro');
    input.setAttribute('aria-invalid', 'false');
    if (alvo) alvo.textContent = '';
  }

  /** Valida um campo. Devolve true se está bom. */
  function validarCampo(input) {
    var regra = REGRAS[input.name];
    if (!regra) return true;                        // observações é opcional

    var valor = input.value.trim();

    if (!valor) { mostrarErro(input, regra.erro); return false; }

    // WhatsApp precisa ter dígitos suficientes para ser um número real.
    if (input.name === 'whatsapp') {
      var digitos = valor.replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 13) {
        mostrarErro(input, 'Informe DDD + número. Ex.: (21) 98765-4321.');
        return false;
      }
    }

    limparErro(input);
    return true;
  }

  // Revalida ao sair do campo, não a cada tecla — corrigir enquanto digita
  // é irritante.
  Array.prototype.forEach.call(form.querySelectorAll('input, textarea, select'), function (input) {
    input.addEventListener('blur', function () { validarCampo(input); });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') validarCampo(input);
    });
  });

  /* --- Montagem dos dados ------------------------------------------------ */

  function coletar() {
    return {
      nome:         form.elements['nome'].value.trim(),
      empresa:      form.elements['empresa'].value.trim(),
      whatsapp:     form.elements['whatsapp'].value.trim(),
      endereco:     form.elements['endereco'].value.trim(),
      demanda:      form.elements['demanda'].value.trim(),
      observacoes:  form.elements['observacoes'].value.trim(),
    };
  }

  function comoTexto(d) {
    return 'Nome: ' + d.nome + '\n' +
           'Empresa: ' + d.empresa + '\n' +
           'WhatsApp: ' + d.whatsapp + '\n' +
           'Endereço de entrega: ' + d.endereco + '\n' +
           'Produto e volume mensal: ' + d.demanda + '\n' +
           'Observações: ' + (d.observacoes || '—');
  }

  /* --- Envio ------------------------------------------------------------- */

  function corpoCodificado(d) {
    var params = new URLSearchParams();
    params.append('form-name', 'orcamento');       // exigido pela Netlify
    Object.keys(d).forEach(function (k) { params.append(k, d[k]); });
    return params.toString();
  }

  function enviar(d) {
    var destino = CONFIG.formEndpoint || window.location.pathname;

    return fetch(destino, {
      method: 'POST',
      headers: CONFIG.formEndpoint
        ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
        : { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: corpoCodificado(d),
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      return true;
    });
  }

  /** Modo de reserva: abre o e-mail do usuário com tudo preenchido. */
  function reservaPorEmail(d) {
    var assunto = 'Orçamento pelo site — ' + (d.empresa || d.nome);
    var url = 'mailto:' + CONFIG.email +
              '?subject=' + encodeURIComponent(assunto) +
              '&body=' + encodeURIComponent(comoTexto(d));
    window.location.href = url;
  }

  function mostrarConfirmacao(d, viaEmail) {
    // Mensagem de WhatsApp já com o pedido dentro, para acelerar a conversa.
    var extra = 'Sou ' + d.nome + ', da ' + d.empresa + '. ' +
                'Preciso de ' + d.demanda + ', com entrega em ' + d.endereco + '.';

    confirmacao.innerHTML =
      '<h3>Pedido registrado.</h3>' +
      '<p>' + (viaEmail
        ? 'Abrimos seu programa de e-mail com o pedido preenchido. Confira e envie.'
        : 'Recebemos seus dados e respondemos em horário comercial.') +
      '</p>' +
      '<p>Para adiantar, mande a mesma mensagem no WhatsApp — é por lá que ' +
      'fechamos pedido e combinamos a entrega.</p>' +
      '<a class="btn btn--primario" id="orcamento-cta">Continuar no WhatsApp</a>';

    confirmacao.hidden = false;

    var cta = document.getElementById('orcamento-cta');
    cta.setAttribute('href', window.linkWhatsApp('orcamento', extra));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.addEventListener('click', function () {
      window.rastrear('clique_whatsapp', { origem: 'orcamento_confirmacao' });
    });

    form.hidden = true;
    confirmacao.setAttribute('tabindex', '-1');
    confirmacao.focus();                            // leva o foco ao resultado
    window.rastrear('envio_formulario', { origem: 'orcamento' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Valida tudo e leva o foco ao primeiro campo com problema.
    var invalidos = [];
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (input) {
      if (!validarCampo(input)) invalidos.push(input);
    });
    if (invalidos.length) { invalidos[0].focus(); return; }

    var dados = coletar();

    botao.disabled = true;
    botao.textContent = 'Enviando…';

    enviar(dados)
      .then(function () { mostrarConfirmacao(dados, false); })
      .catch(function () {
        // Sem endpoint e fora da Netlify: nada se perde, vai por e-mail.
        reservaPorEmail(dados);
        mostrarConfirmacao(dados, true);
      })
      .then(function () {
        botao.disabled = false;
        botao.textContent = 'Enviar pedido de orçamento';
      });
  });
})();
