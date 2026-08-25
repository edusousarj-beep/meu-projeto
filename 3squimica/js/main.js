/* =========================================================================
   3S QUÍMICA — JAVASCRIPT COMPARTILHADO
   Carregado em todas as páginas. Cuida de:
     1. Links de WhatsApp com mensagem por seção
     2. Menu mobile
     3. Revelação no scroll
     4. Consentimento de cookies e analytics (LGPD)
     5. Rodapé montado a partir do config
   Sem biblioteca externa. JavaScript puro.
   ========================================================================= */

(function () {
  'use strict';

  /* =======================================================================
     1. WHATSAPP
     ===================================================================== */

  /**
   * Monta o link do WhatsApp com a mensagem já escrita.
   * @param {string} origem  chave em CONFIG.mensagens (ex.: 'hero')
   * @param {string} [extra] texto adicional colado ao final
   */
  function linkWhatsApp(origem, extra) {
    var base = CONFIG.mensagens[origem] || CONFIG.mensagens.flutuante;
    var texto = extra ? base + ' ' + extra : base;
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  }
  window.linkWhatsApp = linkWhatsApp;   // usado pelos outros arquivos

  /**
   * Preenche todo elemento com data-zap="origem" com o link correto.
   * Assim o HTML fica limpo: <a data-zap="hero">Pedir orçamento</a>
   */
  function montarLinksWhatsApp(escopo) {
    var alvos = (escopo || document).querySelectorAll('[data-zap]');
    Array.prototype.forEach.call(alvos, function (el) {
      var origem = el.getAttribute('data-zap');
      el.setAttribute('href', linkWhatsApp(origem, el.getAttribute('data-zap-extra')));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      // Cada clique vira um evento de analytics identificado pela origem.
      el.addEventListener('click', function () {
        rastrear('clique_whatsapp', { origem: origem });
      });
    });
  }
  window.montarLinksWhatsApp = montarLinksWhatsApp;


  /* =======================================================================
     2. MENU MOBILE
     ===================================================================== */

  function iniciarMenu() {
    var botao = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu-principal');
    if (!botao || !menu) return;

    function fechar() {
      botao.setAttribute('aria-expanded', 'false');
      menu.setAttribute('data-aberto', 'false');
    }

    botao.addEventListener('click', function () {
      var aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      menu.setAttribute('data-aberto', String(!aberto));
    });

    // Esc fecha e devolve o foco ao botão — navegação por teclado.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        fechar();
        botao.focus();
      }
    });

    // Clicar fora fecha.
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !botao.contains(e.target)) fechar();
    });

    // Ao voltar para desktop, limpa o estado para o menu não ficar preso.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) fechar();
    });
  }


  /* =======================================================================
     3. REVELAÇÃO NO SCROLL
     Uma aparição suave por seção. Se o navegador não suportar
     IntersectionObserver, tudo aparece de imediato — nada some.
     ===================================================================== */

  function iniciarRevelacao() {
    var alvos = document.querySelectorAll('.revelar');
    if (!alvos.length) return;

    var querMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (querMenosMovimento || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(alvos, function (el) {
        el.setAttribute('data-visivel', 'true');
      });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.setAttribute('data-visivel', 'true');
          observador.unobserve(entrada.target);   // anima uma vez só
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(alvos, function (el) { observador.observe(el); });
  }


  /* =======================================================================
     4. ANALYTICS E LGPD
     Nenhum script de terceiro é carregado antes do aceite.
     ===================================================================== */

  var CHAVE_CONSENTIMENTO = '3sq_consentimento_v1';

  /** Guarda os eventos disparados antes do aceite, para não perder dado. */
  var filaEventos = [];

  function temConsentimento() {
    try { return localStorage.getItem(CHAVE_CONSENTIMENTO) === 'aceito'; }
    catch (e) { return false; }   // navegador com armazenamento bloqueado
  }

  /**
   * Dispara um evento para GA4 e Meta Pixel, se estiverem carregados.
   * Se o usuário ainda não decidiu sobre cookies, o evento fica na fila.
   */
  function rastrear(nome, params) {
    if (!temConsentimento()) { filaEventos.push([nome, params]); return; }
    if (typeof window.gtag === 'function') window.gtag('event', nome, params || {});
    if (typeof window.fbq === 'function') window.fbq('trackCustom', nome, params || {});
  }
  window.rastrear = rastrear;

  function carregarAnalytics() {
    var a = CONFIG.analytics;

    // --- GA4 ---
    if (a.ga4) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + a.ga4;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', a.ga4);
    }

    // --- Meta Pixel ---
    if (a.metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', a.metaPixel);
      window.fbq('track', 'PageView');
    }

    // Descarrega a fila acumulada antes do aceite.
    filaEventos.forEach(function (ev) { rastrear(ev[0], ev[1]); });
    filaEventos = [];
  }

  function iniciarCookies() {
    var banner = document.getElementById('banner-cookies');

    if (temConsentimento()) { carregarAnalytics(); return; }
    if (!banner) return;

    // Só mostra o banner se houver algo a consentir.
    if (!CONFIG.analytics.ga4 && !CONFIG.analytics.metaPixel) return;

    banner.hidden = false;

    function decidir(valor) {
      try { localStorage.setItem(CHAVE_CONSENTIMENTO, valor); } catch (e) { /* sem storage */ }
      banner.hidden = true;
      if (valor === 'aceito') carregarAnalytics();
    }

    banner.querySelector('[data-cookies="aceitar"]')
      .addEventListener('click', function () { decidir('aceito'); });
    banner.querySelector('[data-cookies="recusar"]')
      .addEventListener('click', function () { decidir('recusado'); });
  }


  /* =======================================================================
     5. RODAPÉ E DADOS DA EMPRESA
     Montado por JS para que trocar telefone ou endereço no config
     atualize as cinco páginas de uma vez.
     ===================================================================== */

  function preencherDadosEmpresa() {
    var e = CONFIG.empresa;

    // Elementos com data-config="caminho.no.config" recebem o texto.
    var alvos = document.querySelectorAll('[data-config]');
    Array.prototype.forEach.call(alvos, function (el) {
      var caminho = el.getAttribute('data-config').split('.');
      var valor = caminho.reduce(function (obj, chave) {
        return (obj && obj[chave] !== undefined) ? obj[chave] : null;
      }, CONFIG);
      if (valor) {
        el.textContent = valor;
      } else {
        // Campo vazio no config: some a linha inteira, para não deixar
        // rótulo órfão do tipo "CEP:" sem valor nenhum.
        var linha = el.closest('[data-config-linha]');
        if (linha) linha.remove();
      }
    });

    // E-mail comercial: é o único contato clicável além do WhatsApp.
    var links = document.querySelectorAll('[data-email]');
    Array.prototype.forEach.call(links, function (el) {
      el.setAttribute('href', 'mailto:' + CONFIG.email);
      el.textContent = CONFIG.email;
    });

    /* Endereço clicável: abre a rota no Google Maps, em nova aba.
       Se não houver logradouro no config, o link vira texto simples —
       o endereço continua visível, só não leva a lugar nenhum. */
    var mapas = document.querySelectorAll('[data-mapa]');
    Array.prototype.forEach.call(mapas, function (el) {
      if (CONFIG.enderecoMapa) {
        el.setAttribute('href', CONFIG.enderecoMapa);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.setAttribute('title', 'Ver rota no Google Maps');
        el.addEventListener('click', function () {
          rastrear('clique_mapa', { origem: 'rodape' });
        });
      } else {
        el.removeAttribute('href');
      }
    });

    // SAC dos rótulos: texto simples, NUNCA link. Some se não houver valor.
    var sacs = document.querySelectorAll('[data-sac]');
    Array.prototype.forEach.call(sacs, function (el) {
      if (CONFIG.sac) el.textContent = 'SAC (informações de produto e emergência): ' + CONFIG.sac;
      else el.remove();
    });

    // Ano corrente no aviso de copyright.
    var anos = document.querySelectorAll('[data-ano]');
    Array.prototype.forEach.call(anos, function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Schema.org LocalBusiness, montado com os dados reais do config.
    injetarSchema(e);
  }

  function injetarSchema(e) {
    var endereco = { '@type': 'PostalAddress', addressCountry: 'BR' };
    if (CONFIG.endereco.logradouro) endereco.streetAddress = CONFIG.endereco.logradouro;
    if (CONFIG.endereco.bairro)     endereco.addressLocality = CONFIG.endereco.bairro;
    if (CONFIG.endereco.cep)        endereco.postalCode = CONFIG.endereco.cep;
    endereco.addressRegion = CONFIG.endereco.uf;
    if (!endereco.addressLocality) endereco.addressLocality = CONFIG.endereco.cidade;

    var dados = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: e.nomeFantasia,
      legalName: e.razaoSocial,
      taxID: e.cnpj,
      url: e.dominio,
      email: CONFIG.email,
      address: endereco,
      // Área de atendimento vem da mesma lista do verificador de cobertura.
      areaServed: CONFIG.cobertura.map(function (c) {
        return { '@type': c.tipo === 'município' ? 'City' : 'Place', name: c.nome };
      }),
      knowsLanguage: 'pt-BR',
    };
    if (CONFIG.whatsappConfigurado) {
      dados.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: 'https://wa.me/' + CONFIG.whatsapp,
        availableLanguage: 'Portuguese',
      };
    }

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(dados);
    document.head.appendChild(tag);
  }

  /**
   * Enquanto o número de WhatsApp for o de exemplo, o site avisa quem
   * publicou. É melhor um aviso visível do que um link que não converte.
   */
  function avisarConfigPendente() {
    if (CONFIG.whatsappConfigurado) return;
    console.warn(
      '[3S Química] O número de WhatsApp ainda é o de exemplo. ' +
      'Edite CONFIG.whatsapp em js/config.js antes de publicar.'
    );
    var aviso = document.createElement('div');
    aviso.className = 'aviso-config';
    aviso.setAttribute('role', 'status');
    aviso.textContent = 'Configuração pendente: edite o número de WhatsApp em js/config.js antes de publicar este site.';
    document.body.insertBefore(aviso, document.body.firstChild);
  }


  /* =======================================================================
     INICIALIZAÇÃO
     ===================================================================== */

  function iniciar() {
    preencherDadosEmpresa();
    montarLinksWhatsApp(document);
    iniciarMenu();
    iniciarRevelacao();
    iniciarCookies();
    avisarConfigPendente();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
