/* =========================================================================
   3S QUÍMICA — VERIFICADOR DE COBERTURA
   =========================================================================
   O comprador digita o bairro ou município e recebe uma resposta direta.
   Regra de conversão: se o local NÃO está na lista, o site nunca responde
   "não atendemos". Responde "vamos verificar a rota" e abre o WhatsApp.
   Rota nova se combina; lead perdido não volta.
   ========================================================================= */

(function () {
  'use strict';

  var form = document.getElementById('form-cobertura');
  if (!form) return;                       // página sem verificador

  var campo = document.getElementById('cobertura-local');
  var listaSugestoes = document.getElementById('cobertura-sugestoes');
  var resposta = document.getElementById('cobertura-resposta');

  /* --- Normalização ----------------------------------------------------- */
  /* "São Gonçalo" e "sao goncalo" precisam bater. Tira acento, caixa e
     espaço sobrando. */

  function normalizar(texto) {
    return String(texto)
      .normalize('NFD')                    // separa a letra do acento
      .replace(/[\u0300-\u036f]/g, '')      // remove o acento
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Escapa o que o usuário digitou antes de jogar na tela. Sem isso, um
     texto com < ou > quebraria o HTML da resposta. */
  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Índice montado uma vez, na carga.
  var indice = CONFIG.cobertura.map(function (c) {
    return { dados: c, chave: normalizar(c.nome) };
  });

  /* --- Busca ------------------------------------------------------------ */

  function buscar(termo) {
    var t = normalizar(termo);
    if (!t) return [];
    // Primeiro quem começa com o termo, depois quem apenas contém.
    var comeca = indice.filter(function (i) { return i.chave.indexOf(t) === 0; });
    var contem = indice.filter(function (i) {
      return i.chave.indexOf(t) > 0;
    });
    return comeca.concat(contem);
  }

  /* --- Sugestões enquanto digita ---------------------------------------- */

  function mostrarSugestoes(termo) {
    var achados = buscar(termo).slice(0, 6);

    if (!termo || achados.length === 0) {
      listaSugestoes.innerHTML = '';
      campo.setAttribute('aria-expanded', 'false');
      return;
    }

    listaSugestoes.innerHTML = achados.map(function (i) {
      return '<li><button type="button" data-local="' + escapar(i.dados.nome) + '">' +
               escapar(i.dados.nome) +
               ' <span style="color:var(--cinza-medio)">· ' + escapar(i.dados.tipo) + '</span>' +
             '</button></li>';
    }).join('');
    campo.setAttribute('aria-expanded', 'true');
  }

  listaSugestoes.addEventListener('click', function (e) {
    var botao = e.target.closest('button[data-local]');
    if (!botao) return;
    campo.value = botao.getAttribute('data-local');
    listaSugestoes.innerHTML = '';
    campo.setAttribute('aria-expanded', 'false');
    responder(campo.value);
  });

  /* --- Resposta --------------------------------------------------------- */

  function responder(termo) {
    var texto = String(termo || '').trim();

    // Estado vazio: diz o que falta, sem pedir desculpa.
    if (!texto) {
      resposta.innerHTML =
        '<div class="resposta resposta--consultar">' +
          '<p class="resposta__titulo">Digite o bairro ou o município</p>' +
          '<p>Ex.: Bonsucesso, Niterói, Duque de Caxias.</p>' +
        '</div>';
      campo.setAttribute('aria-invalid', 'true');
      campo.focus();
      return;
    }
    campo.setAttribute('aria-invalid', 'false');

    var achados = buscar(texto);

    if (achados.length > 0) {
      var local = achados[0].dados;
      resposta.innerHTML =
        '<div class="resposta resposta--atende">' +
          '<p class="resposta__titulo">Sim, entregamos em ' + local.nome + '.</p>' +
          '<p>Prazo típico: <strong>' + local.prazo + '</strong> após a confirmação do pedido. ' +
            'Pedido mínimo: ' + CONFIG.entrega.pedidoMinimo + '.</p>' +
          '<a class="btn btn--primario" id="cobertura-cta">Fechar pedido no WhatsApp</a>' +
        '</div>';

      ligarCta('cobertura-cta',
        'Meu endereço de entrega é ' + local.nome + '. Quero fechar um pedido de hipoclorito de sódio.',
        { origem: 'cobertura', resultado: 'atende', local: local.nome });

      window.rastrear('consulta_cobertura', { local: local.nome, resultado: 'atende' });

    } else {
      // Fora da lista: nunca dizer "não atendemos".
      resposta.innerHTML =
        '<div class="resposta resposta--consultar">' +
          '<p class="resposta__titulo">' + escapar(texto) + ' não está na nossa lista de rotas fixas.</p>' +
          '<p>Isso não quer dizer que não entregamos. Rodamos rota própria na região ' +
            'metropolitana e avaliamos endereço novo conforme volume e frequência. ' +
            'Mande o endereço no WhatsApp que respondemos com prazo e frete.</p>' +
          '<a class="btn btn--primario" id="cobertura-cta">Consultar rota no WhatsApp</a>' +
        '</div>';

      ligarCta('cobertura-cta',
        'Meu endereço de entrega é ' + texto + '. Vocês conseguem atender esse endereço?',
        { origem: 'cobertura', resultado: 'consultar', local: texto });

      window.rastrear('consulta_cobertura', { local: texto, resultado: 'fora_da_lista' });
    }
  }

  /** Liga um botão recém-criado ao WhatsApp com mensagem específica. */
  function ligarCta(id, extra, dadosEvento) {
    var cta = document.getElementById(id);
    if (!cta) return;
    cta.setAttribute('href', window.linkWhatsApp('cobertura', extra));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.addEventListener('click', function () {
      window.rastrear('clique_whatsapp', dadosEvento);
    });
  }

  /* --- Eventos ---------------------------------------------------------- */

  campo.addEventListener('input', function () { mostrarSugestoes(campo.value); });

  // Esc limpa as sugestões sem apagar o que foi digitado.
  campo.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      listaSugestoes.innerHTML = '';
      campo.setAttribute('aria-expanded', 'false');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    listaSugestoes.innerHTML = '';
    campo.setAttribute('aria-expanded', 'false');
    responder(campo.value);
  });

  /* --- Lista completa, quando a página pedir ---------------------------- */
  /* Usada em /cobertura. A home só tem o campo de busca. */

  var alvoLista = document.getElementById('lista-cobertura');
  if (alvoLista) {
    var bairros = CONFIG.cobertura.filter(function (c) { return c.tipo === 'bairro'; });
    var municipios = CONFIG.cobertura.filter(function (c) { return c.tipo === 'município'; });

    function tabela(titulo, itens, rotuloColuna) {
      return '<h3>' + titulo + '</h3>' +
        '<div class="tabela-envolucro"><table class="tabela">' +
          '<thead><tr><th scope="col">' + rotuloColuna + '</th>' +
          '<th scope="col">Prazo típico</th></tr></thead><tbody>' +
          itens.map(function (c) {
            return '<tr><td>' + c.nome + '</td><td>' + c.prazo + '</td></tr>';
          }).join('') +
        '</tbody></table></div>';
    }

    alvoLista.innerHTML =
      tabela('Bairros do Rio de Janeiro', bairros, 'Bairro') +
      '<div style="height:var(--e-7)"></div>' +
      tabela('Municípios da região metropolitana', municipios, 'Município');
  }
})();
